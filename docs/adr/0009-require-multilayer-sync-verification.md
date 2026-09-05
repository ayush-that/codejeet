# Require multilayer synchronization verification

The production PR cannot merge until pure TypeScript tests cover golden binary fixtures, codec round trips, malformed and non-canonical input, property-based CRDT laws, randomized replica simulations, and a seedable decoder fuzz target. Development-only `fast-check` and the current official Cloudflare Vitest integration may be added so Durable Object, D1, WebSocket, hibernation, transaction, and failure behavior run in the Workers environment.

Playwright must also verify two-tab coordination, independent browser installations, offline Progress and Problem Note edits, explicit sign-out hiding, same-account restoration, legacy import, reconnect and bootstrap repair, and IndexedDB persistence after refresh. Passing isolated unit tests is not sufficient evidence for the local-first product contract.
