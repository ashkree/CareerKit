use std::sync::Mutex;

use rusqlite::{Connection, Result};
use rusqlite_migration::{Migrations, M};

// Database State
pub struct AppDatabase {
    pub conn: Mutex<Connection>,
}

// Migrations
const MIGRATION_ARRAY: &[M] = &[
    // Create profile table
    M::up(
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
        );",
    ),
    // Create skills table
    M::up(
        "
        CREATE TABLE IF NOT EXISTS skill (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL UNIQUE,
        );",
    ),
    M::up(
        "CREATE TABLE IF NOT EXISTS experience (
            id                  INTEGER PRIMARY KEY,
            role                TEXT NULL,
            company             TEXT,
            city                TEXT,
            country             TEXT,
            description         TEXT,
            highlights          TEXT,
            start_date          TEXT,
            end_date            TEXT
            );
        
        CREATE TABLE IF NOT EXISTS experience_skill (
            experience_id       INTEGER NOT NULL REFERENCES experience(id) ON DELETE CASCADE
            skill_id            INTEGER NOT NULL REFERENCES skill(id) ON DELETE CASCADE
            PRIMARY KEY (experience_id, skill_id)
            );
        ",
    ),
];

const MIGRATIONS: Migrations<'_> = Migrations::from_slice(MIGRATION_ARRAY);

pub fn init_db(in_memory: bool) -> Result<Connection> {
    let mut conn = if in_memory {
        Connection::open("careerkit.db").unwrap()
    } else {
        Connection::open_in_memory().unwrap()
    };
    _ = MIGRATIONS.to_latest(&mut conn);

    Ok(conn)
}
