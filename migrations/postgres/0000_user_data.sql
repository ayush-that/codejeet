CREATE TABLE IF NOT EXISTS progress (
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  solved_at TEXT NOT NULL,
  PRIMARY KEY (user_id, slug)
);

CREATE TABLE IF NOT EXISTS notes (
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  note TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, slug)
);
