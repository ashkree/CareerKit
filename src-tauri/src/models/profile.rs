use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
struct ProfilePhone {
    country_code: String,
    number: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
struct ProfileLocation {
    city: String,
    country: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
struct ProfileLink {
    name: String,
    url: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct Profile {
    first_name: String,
    last_name: String,
    email: String,
    phone: ProfilePhone,
    location: ProfileLocation,
    links: Vec<ProfileLink>,
    languages: Vec<String>,
}

pub fn get_profile(conn: &Connection) -> rusqlite::Result<Profile> {
    let mut stmt = conn.prepare("SELECT * FROM profile WHERE id = 1")?;
    stmt.query_one([], |row| {
        Ok(Profile {
            first_name: row.get("first_name")?,
            last_name: row.get("last_name")?,
            email: row.get("email")?,
            phone: ProfilePhone {
                country_code: row.get("phone_country_code")?,
                number: row.get("phone_number")?,
            },
            location: ProfileLocation {
                city: row.get("city")?,
                country: row.get("country")?,
            },
            links: serde_json::from_str(&row.get::<_, String>("links")?).map_err(|e| {
                rusqlite::Error::FromSqlConversionFailure(
                    7,
                    rusqlite::types::Type::Text,
                    Box::new(e),
                )
            })?,
            languages: serde_json::from_str(&row.get::<_, String>("languages")?).map_err(|e| {
                rusqlite::Error::FromSqlConversionFailure(
                    8,
                    rusqlite::types::Type::Text,
                    Box::new(e),
                )
            })?,
        })
    })
}

pub fn upsert_profile(conn: &Connection, profile: Profile) -> Result<usize, String> {
    let links_json = serde_json::to_string(&profile.links).map_err(|e| e.to_string())?;
    let languages_json = serde_json::to_string(&profile.languages).map_err(|e| e.to_string())?;

    let rows_affected = conn
        .execute(
            "INSERT INTO profile (id, first_name, last_name, email, phone_country_code, phone_number, city, country, links, languages)
        VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        ON CONFLICT(id) DO UPDATE SET
            first_name         = excluded.first_name,
            last_name          = excluded.last_name,
            email              = excluded.email,
            phone_country_code = excluded.phone_country_code,
            phone_number       = excluded.phone_number,
            city               = excluded.city,
            country            = excluded.country,
            links              = excluded.links,
            languages          = excluded.languages",
            params![
                &profile.first_name,
                &profile.last_name,
                &profile.email,
                &profile.phone.country_code,
                &profile.phone.number,
                &profile.location.city,
                &profile.location.country,
                links_json,
                languages_json,
            ],
        )
        .map_err(|e| e.to_string())?;
    Ok(rows_affected)
}

#[cfg(test)]
mod tests {

    use super::*;
    use crate::database::run_migrations;

    fn setup() -> Connection {
        let conn = Connection::open_in_memory().unwrap();

        run_migrations(&conn).unwrap();
        conn
    }

    fn seed_data() -> Profile {
        Profile {
            first_name: "Maveron".to_string(),
            last_name: "Aguares".to_string(),
            email: "maveron.dev@gmail.com".to_string(),
            phone: ProfilePhone {
                country_code: "971".to_string(),
                number: "555600680".to_string(),
            },
            location: ProfileLocation {
                city: "Dubai".to_string(),
                country: "United Arab Emirates".to_string(),
            },
            links: vec![
                ProfileLink {
                    name: "github".to_string(),
                    url: "https://github.com/ashkree".to_string(),
                },
                ProfileLink {
                    name: "linkedin".to_string(),
                    url: "https://www.linkedin.com/in/maveron-tyriel-aguares/".to_string(),
                },
            ],
            languages: vec!["English".to_string(), "Filipino".to_string()],
        }
    }

    #[test]
    fn test_fresh_insert_profile() {
        let conn = setup();
        let profile = seed_data();

        let rows_affected = upsert_profile(&conn, profile).unwrap();
        assert_eq!(rows_affected, 1)
    }

    #[test]
    fn test_get_profile() {
        let conn = setup();
        let profile = seed_data();

        upsert_profile(&conn, profile.clone()).unwrap();
        let stored = get_profile(&conn).unwrap();

        assert_eq!(profile, stored);
    }

    #[test]
    fn test_update_profile() {
        let conn = setup();

        // Add seeded data
        let profile = seed_data();
        upsert_profile(&conn, profile).unwrap();

        // Add updated data
        let mut updated_profile = seed_data();
        updated_profile.first_name = "Maveron Tyriel".to_string();
        upsert_profile(&conn, updated_profile.clone()).unwrap();

        // Get stored data
        let stored = get_profile(&conn).unwrap();

        assert_eq!(updated_profile, stored);
    }
}
