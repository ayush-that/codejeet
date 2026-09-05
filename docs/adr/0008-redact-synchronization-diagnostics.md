# Redact synchronization diagnostics

Codejeet will record structured Cloudflare diagnostics without Problem Note text, binary payloads, Clerk tokens, Revocation Handles, raw Clerk user IDs, or full actor IDs. Logs may contain event and validation codes, protocol version, message type, byte and item counts, retry class, safe server revisions, and truncated one-way hashes for account and actor correlation. This preserves operational debugging while keeping synchronized learning data and credentials out of logs.
