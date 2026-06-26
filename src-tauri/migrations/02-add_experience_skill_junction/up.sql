CREATE TABLE IF NOT EXISTS experience_skill (
    experience_id INTEGER NOT NULL REFERENCES experience (id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skill (id) ON DELETE CASCADE,
    PRIMARY KEY (experience_id, skill_id)
);

-- The existing experience table is missing start_date / end_date columns.
-- Add them only if they don't already exist (SQLite doesn't support
-- IF NOT EXISTS on ALTER TABLE, so we use a separate migration file).
ALTER TABLE experience ADD COLUMN start_date TEXT;
ALTER TABLE experience ADD COLUMN end_date TEXT;
