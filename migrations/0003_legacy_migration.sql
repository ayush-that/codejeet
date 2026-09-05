CREATE TABLE IF NOT EXISTS sync_legacy_migrations (
  account_id TEXT PRIMARY KEY,
  completed_revision TEXT NOT NULL
);
