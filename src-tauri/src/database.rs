use std::sync::Mutex;

use rusqlite::{Connection, Result};

// Database State
pub struct AppDatabase {
    pub conn: Mutex<Connection>,
}

pub fn init_db() -> Result<Connection> {
    let conn = Connection::open("careerkit.db")?;
    run_migrations(&conn)?;
    Ok(conn)
}

pub fn run_migrations(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS profile (
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
        );

        CREATE TABLE IF NOT EXISTS skills (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            category    TEXT,
            proficiency TEXT
        );

    ",
    )?;

    Ok(())
}
