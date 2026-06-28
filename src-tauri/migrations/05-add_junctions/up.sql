CREATE TABLE IF NOT EXISTS project_skill (
    project_id INTEGER NOT NULL REFERENCES project (id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skill (id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

CREATE TABLE IF NOT EXISTS education_skill (
    education_id INTEGER NOT NULL REFERENCES education (id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skill (id) ON DELETE CASCADE,
    PRIMARY KEY (education_id, skill_id)
);
