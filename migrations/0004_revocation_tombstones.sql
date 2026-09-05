-- Retained operational tombstones for account deletion. These tables contain
-- no Account Data and are intentionally not removed by the deletion service.
CREATE TABLE IF NOT EXISTS sync_account_deletions (
  account_route_key TEXT PRIMARY KEY,
  deleted_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_revocation_handles (
  handle_hash BLOB PRIMARY KEY,
  deleted_at TEXT NOT NULL
);
