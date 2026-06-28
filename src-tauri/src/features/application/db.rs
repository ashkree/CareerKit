use rusqlite::{params, Connection, Error};

use crate::{features::application::Application, shared::utilities::query_rows};

// Get applications
pub fn get_applications(conn: &Connection) -> Result<Vec<Application>, Error> {
    let sql = "SELECT * FROM application";

    query_rows(conn, sql, params![], |row| {
        Ok(Application {
            id: row.get("id")?,
            job_title: row.get("job_title")?,
            job_url: row.get("job_url")?,
            company: row.get("company")?,
            company_website: row.get("company_website")?,
            status: row.get("status")?,
            date_saved: row.get("date_saved")?,
            date_applied: row.get("date_applied")?,
            contact: row.get("contact")?,
            contact_email: row.get("contact_email")?,
            contact_linkedin_url: row.get("contact_linkedin_url")?,
        })
    })
}

// Get application
pub fn get_application(conn: &Connection, id: i64) -> Result<Application, Error> {
    let mut stmt = conn.prepare("SELECT * FROM application WHERE id = ?1")?;

    stmt.query_one(params![id], |row| {
        Ok(Application {
            id: row.get("id")?,
            job_title: row.get("job_title")?,
            job_url: row.get("job_url")?,
            company: row.get("company")?,
            company_website: row.get("company_website")?,
            status: row.get("status")?,
            date_saved: row.get("date_saved")?,
            date_applied: row.get("date_applied")?,
            contact: row.get("contact")?,
            contact_email: row.get("contact_email")?,
            contact_linkedin_url: row.get("contact_linkedin_url")?,
        })
    })
}

pub fn insert_application(conn: &Connection, application: Application) -> Result<usize, Error> {
    conn.execute(
        "INSERT INTO application (job_title, job_url, company, company_website, status, date_saved, date_applied, contact, contact_email, contact_linkedin_url)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            &application.job_title,
            &application.job_url,
            &application.company,
            &application.company_website,
            &application.status,
            &application.date_saved,
            &application.date_applied,
            &application.contact,
            &application.contact_email,
            &application.contact_linkedin_url,
        ],
    )
}

pub fn update_application(
    conn: &Connection,
    application: Application,
    id: i64,
) -> Result<usize, Error> {
    conn.execute(
        "UPDATE application SET 
            job_title               = ?1,
            job_url                 = ?2,
            company                 = ?3,
            company_website         = ?4,
            status                  = ?5,
            date_saved              = ?6,
            date_applied            = ?7,
            contact                 = ?8,
            contact_email           = ?9,
            contact_linkedin_url    = ?10
        WHERE id = ?11",
        params![
            &application.job_title,
            &application.job_url,
            &application.company,
            &application.company_website,
            &application.status,
            &application.date_saved,
            &application.date_applied,
            &application.contact,
            &application.contact_email,
            &application.contact_linkedin_url,
            &id
        ],
    )
}

// Delete application
pub fn delete_application(conn: &Connection, id: i64) -> Result<usize, Error> {
    conn.execute(
        "DELETE FROM application 
        WHERE id = ?1",
        params![&id],
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    fn setup() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS application (
                id                  INTEGER PRIMARY KEY,
                job_title           TEXT,
                job_url             TEXT,
                company             TEXT,
                company_website     TEXT,
                status              TEXT,
                date_saved          TEXT,
                date_applied        TEXT,
                contact             TEXT,
                contact_email       TEXT,
                contact_linkedin_url TEXT
            );",
        )
        .unwrap();
        conn
    }

    fn seed_data() -> Vec<Application> {
        vec![
            Application {
                id: Some(1),
                job_title: "Software Engineer".to_string(),
                job_url: "https://example.com/job/1".to_string(),
                company: "Acme Corp".to_string(),
                company_website: "https://acme.com".to_string(),
                status: "Saved".to_string(),
                date_saved: "2025-01-15".to_string(),
                date_applied: "".to_string(),
                contact: "Jane Doe".to_string(),
                contact_email: "jane@acme.com".to_string(),
                contact_linkedin_url: "https://linkedin.com/in/janedoe".to_string(),
            },
            Application {
                id: Some(2),
                job_title: "Frontend Developer".to_string(),
                job_url: "https://example.com/job/2".to_string(),
                company: "Startup Inc".to_string(),
                company_website: "https://startup.io".to_string(),
                status: "Applied".to_string(),
                date_saved: "2025-02-01".to_string(),
                date_applied: "2025-02-10".to_string(),
                contact: "".to_string(),
                contact_email: "".to_string(),
                contact_linkedin_url: "".to_string(),
            },
        ]
    }

    #[test]
    fn test_get_applications_empty() {
        let conn = setup();
        let stored = get_applications(&conn).unwrap();
        assert!(stored.is_empty());
    }

    #[test]
    fn test_insert_application() {
        let conn = setup();
        let row_count = insert_application(&conn, seed_data()[0].clone()).unwrap();
        assert_eq!(row_count, 1);
    }

    #[test]
    fn test_get_applications() {
        let conn = setup();
        for application in seed_data() {
            insert_application(&conn, application).unwrap();
        }

        let stored = get_applications(&conn).unwrap();
        assert_eq!(stored.len(), 2);
        assert_eq!(stored[0], seed_data()[0]);
        assert_eq!(stored[1], seed_data()[1]);
    }

    #[test]
    fn test_get_application() {
        let conn = setup();
        insert_application(&conn, seed_data()[0].clone()).unwrap();
        let stored = get_application(&conn, 1).unwrap();
        assert_eq!(stored, seed_data()[0]);
    }

    #[test]
    fn test_get_application_not_found() {
        let conn = setup();
        let result = get_application(&conn, 999);
        assert!(result.is_err());
    }

    #[test]
    fn test_update_application() {
        let conn = setup();
        insert_application(&conn, seed_data()[0].clone()).unwrap();

        let mut updated = seed_data()[0].clone();
        updated.status = "Interviewing".to_string();
        let rows_affected = update_application(&conn, updated.clone(), 1).unwrap();

        assert_eq!(rows_affected, 1);

        let stored = get_application(&conn, 1).unwrap();
        assert_eq!(stored, updated);
    }

    #[test]
    fn test_update_application_not_found() {
        let conn = setup();
        let rows_affected = update_application(&conn, seed_data()[0].clone(), 999).unwrap();
        assert_eq!(rows_affected, 0);
    }

    #[test]
    fn test_delete_application() {
        let conn = setup();
        for application in seed_data() {
            insert_application(&conn, application).unwrap();
        }

        let rows_affected = delete_application(&conn, 1).unwrap();
        assert_eq!(rows_affected, 1);

        let stored = get_applications(&conn).unwrap();
        assert_eq!(stored.len(), 1);
    }
}

