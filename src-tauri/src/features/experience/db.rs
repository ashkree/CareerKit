use crate::features::experience::model::Experience;
use crate::shared::duration::Duration;
use crate::shared::location::Location;
use crate::shared::utilities::{deserialize_json_col, query_rows, to_json_string};
use rusqlite::{params, Connection};

use crate::shared::junctions::{get_skills_for, sync_skills_for};

const JUNCTION_TABLE: &str = "experience_skill";
const FK_COLUMN: &str = "experience_id";

pub fn get_experiences(conn: &Connection) -> rusqlite::Result<Vec<Experience>> {
    let sql = "SELECT * FROM experience";
    let mut experiences = query_rows(conn, sql, params![], |row| {
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
            skills: vec![],
        })
    })?;

    for exp in &mut experiences {
        if let Some(id) = exp.id {
            exp.skills = get_skills_for(conn, JUNCTION_TABLE, FK_COLUMN, id)?;
        }
    }

    Ok(experiences)
}

pub fn insert_experience(conn: &Connection, experience: Experience) -> rusqlite::Result<usize> {
    let highlights_json = to_json_string(&experience.highlights)?;

    conn.execute(
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
        ],
    )?;

    let exp_id = conn.last_insert_rowid();
    sync_skills_for(conn, JUNCTION_TABLE, FK_COLUMN, exp_id, experience.skills)?;

    Ok(1)
}

pub fn update_experience(
    conn: &Connection,
    experience: Experience,
    exp_id: i64,
) -> rusqlite::Result<usize> {
    let highlights_json = to_json_string(&experience.highlights)?;

    let row_count = conn.execute(
        "UPDATE experience SET
            role = ?1, company = ?2, city = ?3, country = ?4,
            description = ?5, start_date = ?6, end_date = ?7, highlights = ?8
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

    sync_skills_for(conn, JUNCTION_TABLE, FK_COLUMN, exp_id, experience.skills)?;

    Ok(row_count)
}

pub fn delete_experience(conn: &Connection, exp_id: i64) -> rusqlite::Result<usize> {
    conn.execute("DELETE FROM experience WHERE id = ?1", params![exp_id])
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::features::skills::Skill;

    fn setup() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS skill (
                id   INTEGER PRIMARY KEY,
                name TEXT NOT NULL UNIQUE
            );
            CREATE TABLE IF NOT EXISTS experience_skill (
                experience_id INTEGER NOT NULL,
                skill_id      INTEGER NOT NULL,
                PRIMARY KEY (experience_id, skill_id)
            );
            CREATE TABLE IF NOT EXISTS experience (
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
                skills: vec![
                    Skill {
                        name: "Rust".to_string(),
                    },
                    Skill {
                        name: "React".to_string(),
                    },
                ],
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
                skills: vec![Skill {
                    name: "Python".to_string(),
                }],
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

    #[test]
    fn test_get_experiences_skills_loaded() {
        let conn = setup();
        for experience in seed_data() {
            insert_experience(&conn, experience).unwrap();
        }

        let stored = get_experiences(&conn).unwrap();
        assert_eq!(stored[0].skills, seed_data()[0].skills);
        assert_eq!(stored[1].skills, seed_data()[1].skills);
    }

    #[test]
    fn test_update_experience_skills_replaced() {
        let conn = setup();
        insert_experience(&conn, seed_data()[0].clone()).unwrap();

        let mut updated = seed_data()[0].clone();
        updated.skills = vec![Skill {
            name: "Go".to_string(),
        }];
        let rows_affected = update_experience(&conn, updated.clone(), 1).unwrap();
        assert_eq!(rows_affected, 1);

        let stored = get_experiences(&conn).unwrap();
        assert_eq!(
            stored[0].skills,
            vec![Skill {
                name: "Go".to_string()
            }]
        );
    }

    #[test]
    fn test_delete_experience_not_found() {
        let conn = setup();
        let rows_affected = delete_experience(&conn, 999).unwrap();
        assert_eq!(rows_affected, 0);
    }

    #[test]
    fn test_update_experience_skills_empty() {
        let conn = setup();
        insert_experience(&conn, seed_data()[0].clone()).unwrap();

        let mut updated = seed_data()[0].clone();
        updated.skills = vec![];
        let rows_affected = update_experience(&conn, updated.clone(), 1).unwrap();
        assert_eq!(rows_affected, 1);

        let stored = get_experiences(&conn).unwrap();
        assert!(stored[0].skills.is_empty());
    }
}
