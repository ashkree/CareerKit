use crate::features::profile::model::Profile;
use crate::shared::location::Location;
use crate::shared::phone::Phone;
use crate::shared::utilities::{deserialize_json_col, to_json_string};
use rusqlite::{params, Connection, Error, Result};

pub fn get_profile(conn: &Connection) -> Result<Profile, Error> {
    let mut stmt = conn.prepare("SELECT * FROM profile")?;

    stmt.query_one([], |row| {
        Ok(Profile {
            first_name: row.get("first_name")?,
            last_name: row.get("last_name")?,
            email: row.get("email")?,
            phone: Phone {
                country_code: row.get("phone_country_code")?,
                number: row.get("phone_number")?,
            },
            location: Location {
                city: row.get("city")?,
                country: row.get("country")?,
            },
            links: deserialize_json_col(&row.get::<_, String>("links")?, 7)?,
            languages: deserialize_json_col(&row.get::<_, String>("languages")?, 8)?,
        })
    })
}

pub fn upsert_profile(conn: &Connection, profile: Profile) -> Result<usize, Error> {
    let links_json = to_json_string(&profile.links)?;
    let languages_json = to_json_string(&profile.languages)?;

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
        )?;

    Ok(rows_affected)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::shared::link::Link;

    fn setup() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS profile (
                id                  INTEGER PRIMARY KEY,
                first_name          TEXT NOT NULL,
                last_name           TEXT NOT NULL,
                email               TEXT NOT NULL UNIQUE,
                phone_country_code  TEXT NOT NULL,
                phone_number        TEXT NOT NULL,
                city                TEXT,
                country             TEXT,
                links               TEXT,
                languages           TEXT
            );",
        )
        .unwrap();
        conn
    }

    fn seed_data() -> Profile {
        Profile {
            first_name: "Maveron".to_string(),
            last_name: "Aguares".to_string(),
            email: "maveron.dev@gmail.com".to_string(),
            phone: Phone {
                country_code: "971".to_string(),
                number: "555600680".to_string(),
            },
            location: Location {
                city: "Dubai".to_string(),
                country: "United Arab Emirates".to_string(),
            },
            links: vec![
                Link {
                    name: "github".to_string(),
                    url: "https://github.com/ashkree".to_string(),
                },
                Link {
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
        let rows_affected = upsert_profile(&conn, seed_data()).unwrap();
        assert_eq!(rows_affected, 1);
    }

    #[test]
    fn test_get_profile_not_found() {
        let conn = setup();
        let result = get_profile(&conn);
        assert!(result.is_err());
    }

    #[test]
    fn test_get_profile() {
        let conn = setup();
        let profile = seed_data();
        upsert_profile(&conn, profile.clone()).unwrap();

        let stored = get_profile(&conn).unwrap();
        assert_eq!(stored, profile);
    }

    #[test]
    fn test_update_profile() {
        let conn = setup();
        upsert_profile(&conn, seed_data()).unwrap();

        let mut updated = seed_data();
        updated.first_name = "Maveron Tyriel".to_string();
        upsert_profile(&conn, updated.clone()).unwrap();

        let stored = get_profile(&conn).unwrap();
        assert_eq!(stored, updated);
    }

    #[test]
    fn test_upsert_profile_empty_links_languages() {
        let conn = setup();
        let mut profile = seed_data();
        profile.links = vec![];
        profile.languages = vec![];

        upsert_profile(&conn, profile.clone()).unwrap();
        let stored = get_profile(&conn).unwrap();

        assert!(stored.links.is_empty());
        assert!(stored.languages.is_empty());
    }

    #[test]
    fn test_update_profile_does_not_create_duplicate() {
        let conn = setup();
        upsert_profile(&conn, seed_data()).unwrap();

        let mut updated = seed_data();
        updated.first_name = "Maveron Tyriel".to_string();
        upsert_profile(&conn, updated).unwrap();

        let count: i64 = conn
            .query_row("SELECT COUNT(*) FROM profile", [], |row| row.get(0))
            .unwrap();
        assert_eq!(count, 1);
    }
}
