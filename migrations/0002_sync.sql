CREATE TABLE IF NOT EXISTS sync_accounts (
  account_id TEXT PRIMARY KEY,
  server_revision TEXT NOT NULL DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS sync_actors (
  account_id TEXT NOT NULL,
  actor_id BLOB NOT NULL,
  revocation_handle_hash BLOB NOT NULL,
  is_legacy INTEGER NOT NULL DEFAULT 0 CHECK (is_legacy IN (0, 1)),
  PRIMARY KEY (account_id, actor_id)
);

CREATE TABLE IF NOT EXISTS sync_causal_summaries (
  account_id TEXT NOT NULL,
  actor_id BLOB NOT NULL,
  counter TEXT NOT NULL,
  PRIMARY KEY (account_id, actor_id)
);

CREATE TABLE IF NOT EXISTS sync_progress_shards (
  account_id TEXT NOT NULL,
  shard_prefix TEXT NOT NULL,
  prefix_depth INTEGER NOT NULL,
  encoded_state BLOB NOT NULL,
  byte_length INTEGER NOT NULL,
  PRIMARY KEY (account_id, shard_prefix)
);

CREATE TABLE IF NOT EXISTS sync_progress_directory (
  account_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  shard_prefix TEXT NOT NULL,
  PRIMARY KEY (account_id, slug)
);

CREATE TABLE IF NOT EXISTS sync_problem_notes (
  account_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  operation_kind TEXT NOT NULL CHECK (operation_kind IN ('value', 'delete')),
  value BLOB,
  actor_id BLOB NOT NULL,
  local_revision TEXT NOT NULL,
  server_revision TEXT NOT NULL,
  PRIMARY KEY (account_id, slug),
  CHECK ((operation_kind = 'value' AND value IS NOT NULL) OR
    (operation_kind = 'delete' AND value IS NULL))
);

CREATE TABLE IF NOT EXISTS sync_note_actor_bounds (
  account_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  actor_id BLOB NOT NULL,
  highest_local_revision TEXT NOT NULL,
  PRIMARY KEY (account_id, slug, actor_id)
);
