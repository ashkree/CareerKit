use crate::shared::link::Link;
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
            serde_json::to_string(&vec![
                Link { name: "GitHub".into(), url: "https://github.com/alexrivera".into() },
                Link { name: "LinkedIn".into(), url: "https://linkedin.com/in/alexrivera".into() },
            ])
            .unwrap(),
            serde_json::to_string(&vec!["English", "Spanish"]).unwrap(),
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
            serde_json::to_string(&vec![
                "Rewrote the core job-queue in Rust, cutting p99 latency by 60%",
                "Mentored a team of 4 junior engineers",
                "Shipped zero-downtime DB migration for 200 GB production database",
            ])
            .unwrap(),
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
            serde_json::to_string(&vec![
                "Built real-time notification system using WebSockets",
                "Reduced frontend bundle size by 35% via code splitting",
                "Integrated Stripe and Plaid payment APIs",
            ])
            .unwrap(),
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

    // --- Applications ---
    tx.execute(
        "INSERT INTO application (job_title, job_url, company, company_website, status, date_saved, date_applied, description, contact, contact_email, contact_linkedin_url)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            "Senior Rust Engineer",
            "https://linkedin.com/jobs/view/123",
            "Neuralink Corp",
            "https://neuralink.com",
            "saved",
            "2026-06-15",
            "",
            "Build high-performance distributed systems for real-time data processing. Must have 5+ years of Rust experience.",
            "Sarah Chen",
            "sarah@neuralink.com",
            "https://linkedin.com/in/sarahchen",
        ],
    )?;

    tx.execute(
        "INSERT INTO application (job_title, job_url, company, company_website, status, date_saved, date_applied, description, contact, contact_email, contact_linkedin_url)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            "Staff Software Engineer",
            "https://example.com/jobs/456",
            "DataFlow Inc",
            "https://dataflow.io",
            "applied",
            "2026-06-10",
            "2026-06-12",
            "Lead the backend platform team building next-gen data infrastructure at scale.",
            "",
            "",
            "",
        ],
    )?;

    tx.execute(
        "INSERT INTO application (job_title, job_url, company, company_website, status, date_saved, date_applied, description, contact, contact_email, contact_linkedin_url)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            "Engineering Manager",
            "https://example.com/jobs/789",
            "TechGrowth Inc",
            "https://techgrowth.com",
            "interview",
            "2026-05-28",
            "2026-06-01",
            "Manage a team of 8 backend engineers building SaaS products for enterprise customers.",
            "Mike Johnson",
            "mike@techgrowth.com",
            "https://linkedin.com/in/mikejohnson",
        ],
    )?;

    tx.execute(
        "INSERT INTO application (job_title, job_url, company, company_website, status, date_saved, date_applied, description, contact, contact_email, contact_linkedin_url)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            "Principal Architect",
            "https://example.com/jobs/101",
            "CloudScale Systems",
            "https://cloudscale.io",
            "rejected",
            "2026-05-10",
            "2026-05-12",
            "Design and own the technical architecture for a multi-tenant cloud platform serving 10M+ users.",
            "Emily Park",
            "emily@cloudscale.io",
            "https://linkedin.com/in/emilypark",
        ],
    )?;

    tx.execute(
        "INSERT INTO application (job_title, job_url, company, company_website, status, date_saved, date_applied, description, contact, contact_email, contact_linkedin_url)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            "Lead Platform Engineer",
            "https://example.com/jobs/202",
            "Finova Financial",
            "https://finova.com",
            "offer_received",
            "2026-05-20",
            "2026-05-22",
            "Lead platform engineering for a fintech startup post-Series B. Build internal developer platform and core infrastructure.",
            "David Kim",
            "david@finova.com",
            "https://linkedin.com/in/davidkim",
        ],
    )?;

    tx.commit()?;
    println!("Database seeded with dummy data.");
    Ok(())
}
