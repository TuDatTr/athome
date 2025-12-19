CREATE TABLE IF NOT EXISTS publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER,
    venue TEXT,
    authors TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS publication_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publication_id INTEGER,
    language_code TEXT NOT NULL,
    title TEXT,
    description TEXT,
    FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE
);
