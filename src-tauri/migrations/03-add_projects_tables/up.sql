CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT,
    highlights TEXT,
    start_date TEXT,
    end_date TEXT,
    links TEXT
);
