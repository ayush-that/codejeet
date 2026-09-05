-- Opaque per-window limiter keys for anonymous revocation checks. The key is
-- an HMAC digest of the client address and is never reversible server-side.
CREATE TABLE IF NOT EXISTS sync_revocation_rate_limits (
  bucket_key BLOB PRIMARY KEY,
  window_started INTEGER NOT NULL,
  request_count INTEGER NOT NULL
);
