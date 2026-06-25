use crate::models::shared::utilities::{deserialize_json_col, query_rows, to_json_string};
use crate::models::shared::{duration::Duration, location::Location};
use rusqlite::{params, Connection, Error, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct Experience {
    id: Option<i64>,
    role: String,
    location: Location,
    company: String,
    description: String,
    highlights: Vec<String>,
    duration: Duration,
}

// Get Experiences
fn get_experiences(conn: &Connection) -> Result<Vec<Experience>, Error> {
    let sql = "SELECT * FROM experience";

    query_rows(conn, sql, params![], |row| {
        Ok(Experience {
            id: row.get("id")?,
            role: row.get("role")?,
            company: row.get("company")?,
            description: row.get("description")?,
            location: Location {
                city: row.get("city")?,
                country: row.get("country")?,
            },
            duration: Duration {
                start_date: row.get("start_date")?,
                end_date: row.get("end_date")?,
            },
            highlights: deserialize_json_col(&row.get::<_, String>("highlights")?, 6)?,
        })
    })
}

// Insert a new experience
pub fn insert_experience(conn: &Connection, experience: Experience) -> Result<usize> {
    let highlights_json = to_json_string(&experience.highlights)?;

    let row_count = conn.execute(
        "INSERT INTO experience (role, company, city, country, description, start_date, end_date, highlights)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)", 
        params![
            &experience.role,
            &experience.company,
            &experience.location.city,
            &experience.location.country,
            &experience.description,
            &experience.duration.start_date,
            &experience.duration.end_date,
            &highlights_json,
        ])?;

    Ok(row_count)
}

// Update an existing experience
pub fn update_experience(
    conn: &Connection,
    experience: Experience,
    exp_id: i64, // no need for Option here, we always need an id to update
) -> rusqlite::Result<usize> {
    let highlights_json = serde_json::to_string(&experience.highlights)
        .map_err(|e| rusqlite::Error::ToSqlConversionFailure(Box::new(e)))?;

    let row_count = conn.execute(
        "UPDATE experience SET
            role        = ?1,
            company     = ?2,
            city        = ?3,
            country     = ?4,
            description = ?5,
            start_date  = ?6,
            end_date    = ?7,
            highlights  = ?8
        WHERE id = ?9",
        params![
            &experience.role,
            &experience.company,
            &experience.location.city,
            &experience.location.country,
            &experience.description,
            &experience.duration.start_date,
            &experience.duration.end_date,
            &highlights_json,
            &exp_id,
        ],
    )?;
    Ok(row_count)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn setup() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS experience (
                id          INTEGER PRIMARY KEY,
                role        TEXT,
                company     TEXT,
                city        TEXT,
                country     TEXT,
                description TEXT,
                highlights  TEXT,
                start_date  TEXT,
                end_date    TEXT
            );",
        )
        .unwrap();
        conn
    }

    fn seed_data() -> Vec<Experience> {
        vec![
            Experience {
                id: Some(1),
                role: "Software Engineer".to_string(),
                company: "Acme Corp".to_string(),
                location: Location {
                    city: "Dubai".to_string(),
                    country: "United Arab Emirates".to_string(),
                },
                description: "Developed and maintained web applications".to_string(),
                highlights: vec![
                    "Reduced load time by 40%".to_string(),
                    "Led a team of 3 engineers".to_string(),
                ],
                duration: Duration {
                    start_date: "2021-01".to_string(),
                    end_date: "2023-06".to_string(),
                },
            },
            Experience {
                id: Some(2),
                role: "Junior Developer".to_string(),
                company: "Startup Inc".to_string(),
                location: Location {
                    city: "Abu Dhabi".to_string(),
                    country: "United Arab Emirates".to_string(),
                },
                description: "Built internal tooling and automation scripts".to_string(),
                highlights: vec![
                    "Automated deployment pipeline".to_string(),
                    "Wrote integration tests".to_string(),
                ],
                duration: Duration {
                    start_date: "2019-06".to_string(),
                    end_date: "2021-01".to_string(),
                },
            },
        ]
    }

    #[test]
    fn test_get_experiences_empty() {
        let conn = setup();
        let stored = get_experiences(&conn).unwrap();
        assert!(stored.is_empty());
    }

    #[test]
    fn test_insert_experience() {
        let conn = setup();
        let row_count = insert_experience(&conn, seed_data()[0].clone()).unwrap();
        assert_eq!(row_count, 1);
    }

    #[test]
    fn test_get_experiences() {
        let conn = setup();
        for experience in seed_data() {
            insert_experience(&conn, experience).unwrap();
        }

        let stored = get_experiences(&conn).unwrap();
        assert_eq!(stored.len(), 2);
        assert_eq!(stored[0], seed_data()[0]);
        assert_eq!(stored[1], seed_data()[1]);
    }

    #[test]
    fn test_update_experience() {
        let conn = setup();
        for experience in seed_data() {
            insert_experience(&conn, experience).unwrap();
        }

        let mut updated = seed_data()[0].clone();
        updated.role = "Senior Engineer".to_string();
        let rows_affected = update_experience(&conn, updated.clone(), 1).unwrap();

        assert_eq!(rows_affected, 1);

        let stored = get_experiences(&conn).unwrap();
        assert_eq!(stored[0], updated);
    }

    #[test]
    fn test_update_experience_not_found() {
        let conn = setup();
        let rows_affected = update_experience(&conn, seed_data()[0].clone(), 999).unwrap();
        assert_eq!(rows_affected, 0);
    }
}
