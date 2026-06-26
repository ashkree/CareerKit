use crate::features::skills::model::Skill;
use crate::shared::utilities::query_rows;
use rusqlite::{params, Connection, Error};

pub fn get_skill(conn: &Connection, id: i64) -> Result<Skill, Error> {
    let mut stmt = conn.prepare("SELECT * FROM skill WHERE id = ?1")?;
    stmt.query_one([id], |row| {
        Ok(Skill {
            name: row.get("name")?,
        })
    })
}

pub fn get_skills(conn: &Connection) -> Result<Vec<Skill>, Error> {
    let sql = "SELECT * FROM skill";

    query_rows(conn, sql, params![], |row| {
        Ok(Skill {
            name: row.get("name")?,
        })
    })
}

pub fn insert_skills(conn: &mut Connection, skills: Vec<Skill>) -> Result<(), Error> {
    let tx = conn.transaction()?;
    for skill in skills {
        tx.execute(
            "INSERT OR IGNORE INTO skill (name) VALUES (?1)",
            params![skill.name],
        )?;
    }
    tx.commit()
}

pub fn delete_skills(conn: &mut Connection, skills: Vec<Skill>) -> Result<(), Error> {
    let tx = conn.transaction()?;
    for skill in skills {
        tx.execute("DELETE FROM skill WHERE name = ?1", params![skill.name])?;
    }
    tx.commit()
}

#[cfg(test)]
mod tests {

    use super::*;

    fn setup() -> Connection {
        let conn = Connection::open_in_memory().unwrap();

        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS skill (
               id   INTEGER PRIMARY KEY AUTOINCREMENT,
               name TEXT NOT NULL UNIQUE
            )",
        )
        .unwrap();

        conn
    }

    fn seed_data() -> Vec<Skill> {
        vec![
            Skill {
                name: "Flipping Burgers".to_string(),
            },
            Skill {
                name: "Frying Fries".to_string(),
            },
            Skill {
                name: "Slurping Drinks".to_string(),
            },
            Skill {
                name: "Slurping Drinks".to_string(),
            },
        ]
    }

    #[test]
    fn test_inserting_skills_w_duplicates() {
        let mut conn = setup();
        let skills = seed_data();

        _ = insert_skills(&mut conn, skills);

        let count: i64 = conn
            .query_row("SELECT COUNT(*) FROM skill", [], |row| row.get(0))
            .unwrap();

        assert_eq!(count, 3);
    }

    #[test]
    fn test_get_skills() {
        let mut conn = setup();
        let skills = seed_data();
        insert_skills(&mut conn, skills).unwrap();

        let stored = get_skills(&conn).unwrap();
        assert_eq!(stored.len(), 3);
    }

    #[test]
    fn test_get_skill() {
        let mut conn = setup();
        insert_skills(
            &mut conn,
            vec![Skill {
                name: "Flipping Burgers".to_string(),
            }],
        )
        .unwrap();

        let stored = get_skill(&conn, 1).unwrap();
        assert_eq!(stored.name, "Flipping Burgers");
    }

    #[test]
    fn test_delete_skills() {
        let mut conn = setup();
        let skills = seed_data();
        insert_skills(&mut conn, skills.clone()).unwrap();

        delete_skills(&mut conn, skills[2..4].to_vec()).unwrap();
        let stored = get_skills(&conn).unwrap();
        assert_eq!(stored.len(), 2);
    }

    #[test]
    fn test_get_skill_not_found() {
        let conn = setup();
        let result = get_skill(&conn, 999);
        assert!(result.is_err());
    }
}
