CREATE TABLE IF NOT EXISTS sync_loro_snapshots (
  account_id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL,
  snapshot BLOB NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_loro_updates (
  account_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  update_data BLOB NOT NULL,
  byte_length INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (account_id, revision)
);

CREATE TABLE IF NOT EXISTS sync_loro_migrations (
  account_id TEXT PRIMARY KEY,
  completed_revision INTEGER NOT NULL
);
