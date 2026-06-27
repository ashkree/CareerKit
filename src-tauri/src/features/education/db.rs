use crate::features::education::model::Education;
use crate::shared::duration::Duration;
use crate::shared::location::Location;
use crate::shared::utilities::{deserialize_json_col, query_rows, to_json_string};
use rusqlite::{params, Connection};

pub fn get_education(conn: &Connection) -> rusqlite::Result<Vec<Education>> {
    let sql = "SELECT * FROM education";

    query_rows(conn, sql, params![], |row| {
        Ok(Education {
            id: row.get("id")?,
            school: row.get("school")?,
            qualification: row.get("qualification")?,
            specializations: deserialize_json_col(
                &row.get::<_, String>("specializations")?,
                2,
            )?,
            location: Location {
                city: row.get("city")?,
                country: row.get("country")?,
            },
            duration: Duration {
                start_date: row.get("start_date")?,
                end_date: row.get("end_date")?,
            },
            coursework: deserialize_json_col(
                &row.get::<_, String>("coursework")?,
                7,
            )?,
        })
    })
}

pub fn insert_education(conn: &Connection, education: Education) -> rusqlite::Result<usize> {
    let specializations_json = to_json_string(&education.specializations)?;
    let coursework_json = to_json_string(&education.coursework)?;

    let row_count = conn.execute(
        "INSERT INTO education (school, qualification, specializations, city, country, start_date, end_date, coursework)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            &education.school,
            &education.qualification,
            &specializations_json,
            &education.location.city,
            &education.location.country,
            &education.duration.start_date,
            &education.duration.end_date,
            &coursework_json,
        ],
    )?;

    Ok(row_count)
}

pub fn update_education(
    conn: &Connection,
    education: Education,
    edu_id: i64,
) -> rusqlite::Result<usize> {
    let specializations_json = to_json_string(&education.specializations)?;
    let coursework_json = to_json_string(&education.coursework)?;

    let row_count = conn.execute(
        "UPDATE education SET
            school           = ?1,
            qualification    = ?2,
            specializations  = ?3,
            city             = ?4,
            country          = ?5,
            start_date       = ?6,
            end_date         = ?7,
            coursework       = ?8
         WHERE id = ?9",
        params![
            &education.school,
            &education.qualification,
            &specializations_json,
            &education.location.city,
            &education.location.country,
            &education.duration.start_date,
            &education.duration.end_date,
            &coursework_json,
            &edu_id,
        ],
    )?;
    Ok(row_count)
}

pub fn delete_education(conn: &Connection, edu_id: i64) -> rusqlite::Result<usize> {
    conn.execute("DELETE FROM education WHERE id = ?1", params![edu_id])
}

#[cfg(test)]
mod tests {
    use super::*;

    fn setup() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS education (
                id              INTEGER PRIMARY KEY,
                school          TEXT,
                qualification   TEXT,
                specializations TEXT,
                city            TEXT,
                country         TEXT,
                coursework      TEXT,
                start_date      TEXT,
                end_date        TEXT
            );",
        )
        .unwrap();
        conn
    }

    fn seed_data() -> Vec<Education> {
        vec![
            Education {
                id: Some(1),
                school: "University of Technology".to_string(),
                qualification: "Bachelor of Science".to_string(),
                specializations: vec![
                    "Computer Science".to_string(),
                    "Mathematics".to_string(),
                ],
                location: Location {
                    city: "Boston".to_string(),
                    country: "USA".to_string(),
                },
                duration: Duration {
                    start_date: "2017-09".to_string(),
                    end_date: "2021-06".to_string(),
                },
                coursework: vec![
                    "Data Structures".to_string(),
                    "Algorithms".to_string(),
                ],
            },
            Education {
                id: Some(2),
                school: "City College".to_string(),
                qualification: "Associate Degree".to_string(),
                specializations: vec![],
                location: Location {
                    city: "London".to_string(),
                    country: "UK".to_string(),
                },
                duration: Duration {
                    start_date: "2015-09".to_string(),
                    end_date: "2017-06".to_string(),
                },
                coursework: vec![],
            },
        ]
    }

    #[test]
    fn test_get_education_empty() {
        let conn = setup();
        let stored = get_education(&conn).unwrap();
        assert!(stored.is_empty());
    }

    #[test]
    fn test_insert_education() {
        let conn = setup();
        let row_count = insert_education(&conn, seed_data()[0].clone()).unwrap();
        assert_eq!(row_count, 1);
    }

    #[test]
    fn test_get_education() {
        let conn = setup();
        for education in seed_data() {
            insert_education(&conn, education).unwrap();
        }

        let stored = get_education(&conn).unwrap();
        assert_eq!(stored.len(), 2);
        assert_eq!(stored[0], seed_data()[0]);
        assert_eq!(stored[1], seed_data()[1]);
    }

    #[test]
    fn test_update_education() {
        let conn = setup();
        for education in seed_data() {
            insert_education(&conn, education).unwrap();
        }

        let mut updated = seed_data()[0].clone();
        updated.school = "MIT".to_string();
        let rows_affected = update_education(&conn, updated.clone(), 1).unwrap();

        assert_eq!(rows_affected, 1);

        let stored = get_education(&conn).unwrap();
        assert_eq!(stored[0], updated);
    }

    #[test]
    fn test_update_education_not_found() {
        let conn = setup();
        let rows_affected = update_education(&conn, seed_data()[0].clone(), 999).unwrap();
        assert_eq!(rows_affected, 0);
    }
}
