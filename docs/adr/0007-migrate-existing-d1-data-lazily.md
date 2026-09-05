# Migrate existing D1 data lazily

The first post-deployment access to an unmigrated account will enter its Durable Object FIFO queue and transactionally convert the current `progress` and `notes` rows into canonical state through the reserved legacy actor. Initial mutations and server revisions are assigned deterministically in problem-slug order, and the account is marked migrated only after all canonical rows commit. Concurrent requests wait behind this migration.

For the rollback window, every canonical transaction also updates the existing tables as materialized compatibility mirrors, and mirror failure aborts the transaction. These tables and the legacy endpoint adapters remain until telemetry shows that old frontend traffic has exceeded its supported lifetime and one stable production release has passed; canonical D1 state remains authoritative throughout.

Production rollout applies additive D1 schema changes before deploying the custom Worker and Durable Object namespace. Destructive table or adapter cleanup belongs to a later PR. If the new deployment fails, the old Worker continues using its original schema; if it is rolled back after serving traffic, the compatibility mirrors preserve its materialized view.
