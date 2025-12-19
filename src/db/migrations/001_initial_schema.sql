-- Structural tables
CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    phone TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_date DATE,
    end_date DATE,
    company_url TEXT,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_date DATE,
    end_date DATE,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT, -- e.g., 'Frontend', 'Backend'
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT,
    github_url TEXT,
    live_url TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Translation tables
CREATE TABLE IF NOT EXISTS profile_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER,
    language_code TEXT NOT NULL, -- 'en' or 'de'
    name TEXT,
    title TEXT,
    about_me TEXT,
    location TEXT,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS experience_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    experience_id INTEGER,
    language_code TEXT NOT NULL,
    job_title TEXT,
    company_name TEXT,
    description TEXT,
    FOREIGN KEY (experience_id) REFERENCES experience(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS education_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    education_id INTEGER,
    language_code TEXT NOT NULL,
    degree TEXT,
    institution TEXT,
    description TEXT,
    FOREIGN KEY (education_id) REFERENCES education(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS skill_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    skill_id INTEGER,
    language_code TEXT NOT NULL,
    name TEXT,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    language_code TEXT NOT NULL,
    title TEXT,
    description TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
