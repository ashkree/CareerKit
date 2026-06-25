use std::sync::{LazyLock, Mutex};

use include_dir::{include_dir, Dir};
use rusqlite::{Connection, Result};
use rusqlite_migration::Migrations;

// Database State
pub struct AppDatabase {
    pub conn: Mutex<Connection>,
}

static MIGRATIONS_DIR: Dir = include_dir!("$CARGO_MANIFEST_DIR/migrations/");
static MIGRATIONS: LazyLock<Migrations<'_>> =
    LazyLock::new(|| Migrations::from_directory(&MIGRATIONS_DIR).unwrap());

pub fn init_db(in_memory: bool) -> Result<Connection> {
    let mut conn = if in_memory {
        Connection::open("careerkit.db").unwrap()
    } else {
        Connection::open_in_memory().unwrap()
    };
    _ = MIGRATIONS.to_latest(&mut conn);

    Ok(conn)
}

// Test that migrations are working
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn migrations_test() {
        assert!(MIGRATIONS.validate().is_ok());
    }
}
