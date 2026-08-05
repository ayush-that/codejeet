// Bump when the dashboard payload shape changes. Stale keys are evicted in
// lib/dashboard-store.ts, so an old oversized entry cannot eat the quota.
export const CACHE_VERSION = "v6";
