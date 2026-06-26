use rusqlite::{params, Connection, Result};

/// Returns true if the database has already been seeded.
fn is_seeded(conn: &Connection) -> Result<bool> {
    let count: i64 = conn.query_row("SELECT COUNT(*) FROM profile", [], |row| row.get(0))?;
    Ok(count > 0)
}

pub fn seed(conn: &mut Connection) -> Result<()> {
    if is_seeded(conn)? {
        return Ok(());
    }

    let tx = conn.transaction()?;

    // --- Profile ---
    tx.execute(
        "INSERT INTO profile (
            id, first_name, last_name, email,
            phone_country_code, phone_number,
            city, country, links, languages
        ) VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            "Alex",
            "Rivera",
            "alex.rivera@example.com",
            "1",
            "5559871234",
            "San Francisco",
            "United States",
            r#"[{"name":"GitHub","url":"https://github.com/alexrivera"},{"name":"LinkedIn","url":"https://linkedin.com/in/alexrivera"}]"#,
            r#"["English","Spanish"]"#,
        ],
    )?;

    // --- Skills ---
    // Returns the inserted row id so we can reference them in the junction table.
    let skill_ids: Vec<i64> = {
        let skills = vec![
            "Rust",
            "TypeScript",
            "React",
            "PostgreSQL",
            "Docker",
            "System Design",
        ];
        let mut ids = Vec::new();
        for name in skills {
            tx.execute(
                "INSERT OR IGNORE INTO skill (name) VALUES (?1)",
                params![name],
            )?;
            let id: i64 = tx.query_row(
                "SELECT id FROM skill WHERE name = ?1",
                params![name],
                |row| row.get(0),
            )?;
            ids.push(id);
        }
        ids
    };

    // --- Experiences ---
    // Experience 1 — senior role
    tx.execute(
        "INSERT INTO experience (
            role, company, city, country,
            description, start_date, end_date, highlights
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            "Senior Software Engineer",
            "Acme Corp",
            "San Francisco",
            "United States",
            "Led backend platform work for a B2B SaaS product serving 50k+ businesses.",
            "2021-03",
            "2024-11",
            r#"["Rewrote the core job-queue in Rust, cutting p99 latency by 60%","Mentored a team of 4 junior engineers","Shipped zero-downtime DB migration for 200 GB production database"]"#,
        ],
    )?;
    let exp1_id = tx.last_insert_rowid();

    // Experience 2 — mid-level role
    tx.execute(
        "INSERT INTO experience (
            role, company, city, country,
            description, start_date, end_date, highlights
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            "Software Engineer",
            "Startup Inc",
            "Austin",
            "United States",
            "Full-stack engineer on a consumer fintech product.",
            "2019-06",
            "2021-02",
            r#"["Built real-time notification system using WebSockets","Reduced frontend bundle size by 35% via code splitting","Integrated Stripe and Plaid payment APIs"]"#,
        ],
    )?;
    let exp2_id = tx.last_insert_rowid();

    // --- Experience ↔ Skill junction ---
    // skill_ids order: Rust=0, TypeScript=1, React=2, PostgreSQL=3, Docker=4, System Design=5
    let exp1_skills = [
        skill_ids[0], // Rust
        skill_ids[3], // PostgreSQL
        skill_ids[4], // Docker
        skill_ids[5], // System Design
    ];
    let exp2_skills = [
        skill_ids[1], // TypeScript
        skill_ids[2], // React
        skill_ids[3], // PostgreSQL
    ];

    for skill_id in &exp1_skills {
        tx.execute(
            "INSERT OR IGNORE INTO experience_skill (experience_id, skill_id) VALUES (?1, ?2)",
            params![exp1_id, skill_id],
        )?;
    }
    for skill_id in &exp2_skills {
        tx.execute(
            "INSERT OR IGNORE INTO experience_skill (experience_id, skill_id) VALUES (?1, ?2)",
            params![exp2_id, skill_id],
        )?;
    }

    tx.commit()?;
    println!("Database seeded with dummy data.");
    Ok(())
}
