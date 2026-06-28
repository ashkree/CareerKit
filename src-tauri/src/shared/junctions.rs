use rusqlite::{params, Connection};

use crate::{features::skills::Skill, shared::utilities::query_rows};

pub fn get_skills_for(
    conn: &Connection,
    junction_table: &str,
    fk_column: &str,
    entity_id: i64,
) -> rusqlite::Result<Vec<Skill>> {
    let sql = format!(
        "SELECT s.name FROM skill s
         JOIN {junction_table} j ON j.skill_id = s.id
         WHERE j.{fk_column} = ?1"
    );

    query_rows(conn, &sql, params![entity_id], |row| {
        Ok(Skill { name: row.get(0)? })
    })
}

pub fn sync_skills_for(
    conn: &Connection,
    junction_table: &str,
    fk_column: &str,
    entity_id: i64,
    skills: Vec<Skill>,
) -> rusqlite::Result<()> {
    conn.execute(
        &format!("DELETE FROM {junction_table} WHERE {fk_column} = ?1"),
        params![entity_id],
    )?;

    for skill in skills {
        conn.execute(
            "INSERT OR IGNORE INTO skill (name) VALUES (?1)",
            params![skill.name],
        )?;

        conn.execute(
            &format!(
                "INSERT OR IGNORE INTO {junction_table} ({fk_column}, skill_id)
                 SELECT ?1, id FROM skill WHERE name = ?2"
            ),
            params![entity_id, skill.name],
        )?;
    }

    Ok(())
}
