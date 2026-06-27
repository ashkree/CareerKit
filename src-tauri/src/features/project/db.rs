use crate::features::project::model::Project;
use crate::shared::duration::Duration;
use crate::shared::utilities::{deserialize_json_col, query_rows, to_json_string};
use rusqlite::{params, Connection};

pub fn get_projects(conn: &Connection) -> rusqlite::Result<Vec<Project>> {
    let sql = "SELECT * FROM projects";

    query_rows(conn, sql, params![], |row| {
        Ok(Project {
            id: row.get("id")?,
            name: row.get("name")?,
            description: row.get("description")?,
            status: row.get("status")?,
            highlights: deserialize_json_col(&row.get::<_, String>("highlights")?, 4)?,
            duration: Duration {
                start_date: row.get("start_date")?,
                end_date: row.get("end_date")?,
            },
            links: deserialize_json_col(&row.get::<_, String>("links")?, 7)?,
        })
    })
}

pub fn insert_project(conn: &Connection, project: Project) -> rusqlite::Result<usize> {
    let highlights_json = to_json_string(&project.highlights)?;
    let links_json = to_json_string(&project.links)?;

    let row_count = conn.execute(
        "INSERT INTO projects (name, description, status, highlights, start_date, end_date, links)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            &project.name,
            &project.description,
            &project.status,
            &highlights_json,
            &project.duration.start_date,
            &project.duration.end_date,
            &links_json,
        ],
    )?;

    Ok(row_count)
}

pub fn update_project(
    conn: &Connection,
    project: Project,
    proj_id: i64,
) -> rusqlite::Result<usize> {
    let highlights_json = to_json_string(&project.highlights)?;
    let links_json = to_json_string(&project.links)?;

    let row_count = conn.execute(
        "UPDATE projects SET
            name        = ?1,
            description = ?2,
            status      = ?3,
            highlights  = ?4,
            start_date  = ?5,
            end_date    = ?6,
            links       = ?7
         WHERE id = ?8",
        params![
            &project.name,
            &project.description,
            &project.status,
            &highlights_json,
            &project.duration.start_date,
            &project.duration.end_date,
            &links_json,
            &proj_id,
        ],
    )?;
    Ok(row_count)
}

pub fn delete_project(conn: &Connection, proj_id: i64) -> rusqlite::Result<usize> {
    conn.execute("DELETE FROM projects WHERE id = ?1", params![proj_id])
}

#[cfg(test)]
mod tests {
    use crate::shared::link::Link;

    use super::*;

    fn setup() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS projects (
                id          INTEGER PRIMARY KEY,
                name        TEXT,
                description TEXT,
                status      TEXT,
                highlights  TEXT,
                start_date  TEXT,
                end_date    TEXT,
                links       TEXT
            );",
        )
        .unwrap();
        conn
    }

    fn seed_data() -> Vec<Project> {
        vec![
            Project {
                id: Some(1),
                name: "Portfolio Website".to_string(),
                description: "A personal portfolio built with React".to_string(),
                status: "Completed".to_string(),
                highlights: vec![
                    "Responsive design".to_string(),
                    "CI/CD pipeline".to_string(),
                ],
                duration: Duration {
                    start_date: "2023-01".to_string(),
                    end_date: "2023-06".to_string(),
                },
                links: vec![Link {
                    name: "GitHub".to_string(),
                    url: "https://github.com/user/portfolio".to_string(),
                }],
            },
            Project {
                id: Some(2),
                name: "CLI Tool".to_string(),
                description: "A command-line utility for automation".to_string(),
                status: "In Progress".to_string(),
                highlights: vec!["Written in Rust".to_string()],
                duration: Duration {
                    start_date: "2024-01".to_string(),
                    end_date: "".to_string(),
                },
                links: vec![],
            },
        ]
    }

    #[test]
    fn test_get_projects_empty() {
        let conn = setup();
        let stored = get_projects(&conn).unwrap();
        assert!(stored.is_empty());
    }

    #[test]
    fn test_insert_project() {
        let conn = setup();
        let row_count = insert_project(&conn, seed_data()[0].clone()).unwrap();
        assert_eq!(row_count, 1);
    }

    #[test]
    fn test_get_projects() {
        let conn = setup();
        for project in seed_data() {
            insert_project(&conn, project).unwrap();
        }

        let stored = get_projects(&conn).unwrap();
        assert_eq!(stored.len(), 2);
        assert_eq!(stored[0], seed_data()[0]);
        assert_eq!(stored[1], seed_data()[1]);
    }

    #[test]
    fn test_update_project() {
        let conn = setup();
        for project in seed_data() {
            insert_project(&conn, project).unwrap();
        }

        let mut updated = seed_data()[0].clone();
        updated.status = "Archived".to_string();
        let rows_affected = update_project(&conn, updated.clone(), 1).unwrap();

        assert_eq!(rows_affected, 1);

        let stored = get_projects(&conn).unwrap();
        assert_eq!(stored[0], updated);
    }

    #[test]
    fn test_update_project_not_found() {
        let conn = setup();
        let rows_affected = update_project(&conn, seed_data()[0].clone(), 999).unwrap();
        assert_eq!(rows_affected, 0);
    }
}
