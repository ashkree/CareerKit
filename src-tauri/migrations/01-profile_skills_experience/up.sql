CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_country_code TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    city TEXT,
    country TEXT,
    links TEXT,
    languages TEXT
);


CREATE TABLE IF NOT EXISTS skill (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY,
    role TEXT NOT NULL,
    company TEXT,
    city TEXT,
    country TEXT,
    description TEXT,
    highlights TEXT
);
