CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY,
    school TEXT NOT NULL,
    qualification TEXT,
    specializations TEXT,
    city TEXT,
    country TEXT,
    coursework TEXT,
    start_date TEXT,
    end_date TEXT
);
