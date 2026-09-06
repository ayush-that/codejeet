# CodeJeet Coolify Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run CodeJeet on Coolify with PostgreSQL-backed user data and Cloudflare providing only DNS, TLS proxying, and safe edge caching.

**Architecture:** A standalone Next.js 16 container listens on `0.0.0.0:3000`, reads packaged generated data from disk, and uses a PostgreSQL pool for progress and notes. Coolify builds the Dockerfile and runs the app beside a managed PostgreSQL service. The cutover uses a verified D1 export/import, a brief mutation freeze, proxied Cloudflare DNS, explicit cache bypasses, and a retained Worker rollback path.

**Tech Stack:** Next.js 16, React 19, TypeScript, Node.js 22, `pg`, PostgreSQL 17, Docker, Coolify 4.3, Clerk, Cloudflare DNS/Cache Rules, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-06-coolify-migration-design.md`

## Global Constraints

- Preserve all 2,221 progress rows and 24 note rows observed at migration discovery, plus any writes made before the final freeze.
- Preserve the existing `/api/progress` and `/api/notes` request and response contracts.
- Derive database identity only from Clerk's authenticated `userId`.
- Do not commit credentials, exports, or production user data.
- Keep the existing Worker, D1 database, R2 bucket, and previous DNS routing available for rollback until post-cutover verification succeeds.
- Do not change production DNS until the replacement origin passes build, health, route, authentication, persistence, and data-parity checks.
- Cache only safe public GET/HEAD responses. Bypass APIs, authentication traffic, authenticated requests, mutation methods, private/no-store responses, and responses containing `Set-Cookie`.

---

### Task 1: Make the Next.js runtime portable

**Files:**

- Modify: `next.config.ts`
- Modify: `lib/blog-data.ts`
- Modify: `lib/pseo-data.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Test: `tests/runtime-portability.test.ts`

**Interfaces:**

- Consumes: generated JSON files under `public/data`.
- Produces: `readJson<T>(filePath: string): Promise<T>` behavior that works from the standalone Node filesystem and `output: "standalone"` in Next configuration.

- [ ] **Step 1: Write a failing portability test**

Create `tests/runtime-portability.test.ts` that reads `next.config.ts`, `lib/blog-data.ts`, and `lib/pseo-data.ts` and asserts that standalone output is enabled and no application runtime file imports `@opennextjs/cloudflare`.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec tsx --test tests/runtime-portability.test.ts`

Expected: FAIL because standalone output is absent and Cloudflare asset fallbacks remain.

- [ ] **Step 3: Implement the portable runtime**

Set `output: "standalone"` in `next.config.ts`. Remove `initOpenNextCloudflareForDev` and both lazy `getCloudflareContext` asset fallbacks. Keep the existing bounded in-memory JSON caches and use `fs.readFile` against `public/data`. Remove `@opennextjs/cloudflare` from runtime dependencies and remove Cloudflare-only scripts from the default deploy path while retaining `wrangler` temporarily for export and rollback operations.

- [ ] **Step 4: Run the focused test**

Run: `pnpm exec tsx --test tests/runtime-portability.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the portable runtime**

Run: `git add next.config.ts lib/blog-data.ts lib/pseo-data.ts package.json pnpm-lock.yaml tests/runtime-portability.test.ts && git commit -m "Make the Next.js runtime portable"`

---

### Task 2: Add the PostgreSQL user-data repository

**Files:**

- Create: `lib/database.ts`
- Create: `lib/user-data-repository.ts`
- Create: `migrations/postgres/0000_user_data.sql`
- Test: `tests/user-data-repository.test.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: `DATABASE_URL` and `pg.Pool`.
- Produces: `getDatabasePool(): Pool`, `closeDatabasePool(): Promise<void>`, `UserDataQueryClient`, `listProgress(client, userId)`, `setProgress(client, userId, slug, completed, now)`, `listNotes(client, userId)`, and `setNote(client, userId, slug, note, now)`.

- [ ] **Step 1: Write failing repository tests**

Use a fake `UserDataQueryClient` to assert exact parameter values and behavior for listing progress, preserving the first solve with `ON CONFLICT DO NOTHING`, deleting progress, listing notes, upserting notes, and deleting blank notes. Assert that caller-supplied user IDs are always query parameters rather than interpolated SQL.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec tsx --test tests/user-data-repository.test.ts`

Expected: FAIL because the repository does not exist.

- [ ] **Step 3: Implement the repository and schema**

Add `pg` and `@types/pg`. Create a lazy singleton pool that throws a clear startup/request error when `DATABASE_URL` is absent and closes cleanly in tests. Implement parameterized queries with the existing text timestamp semantics and primary keys. Add idempotent PostgreSQL DDL matching the approved schema.

- [ ] **Step 4: Run the focused test**

Run: `pnpm exec tsx --test tests/user-data-repository.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the repository**

Run: `git add lib/database.ts lib/user-data-repository.ts migrations/postgres/0000_user_data.sql tests/user-data-repository.test.ts package.json pnpm-lock.yaml && git commit -m "Store user data in PostgreSQL"`

---

### Task 3: Move API handlers to the portable repository

**Files:**

- Create: `lib/progress-api.ts`
- Create: `lib/notes-api.ts`
- Modify: `app/api/progress/route.ts`
- Modify: `app/api/notes/route.ts`
- Test: `tests/progress-api.test.ts`
- Test: `tests/notes-api.test.ts`

**Interfaces:**

- Consumes: Clerk `auth()`, `getDatabasePool()`, and repository functions from Task 2.
- Produces: `handleProgressGet`, `handleProgressPost`, `handleNotesGet`, and `handleNotesPost`, each accepting injected authentication and repository dependencies for deterministic tests.

- [ ] **Step 1: Write failing API tests**

Cover signed-out GET responses, unauthorized POST responses, invalid JSON, invalid or oversized slugs, progress insert/delete dispatch, note validation, note upsert/delete dispatch, and exact response shapes. Include a test that `USER_DATA_READ_ONLY=1` returns `503` for POST while GET remains available for the cutover freeze.

- [ ] **Step 2: Run the focused tests and confirm they fail**

Run: `pnpm exec tsx --test tests/progress-api.test.ts tests/notes-api.test.ts`

Expected: FAIL because the injectable handlers do not exist.

- [ ] **Step 3: Implement handler cores and thin routes**

Move validation and response construction into the injected handler functions. Keep each route responsible only for obtaining Clerk auth and the PostgreSQL pool. Preserve all existing status codes and response JSON. Implement the temporary read-only gate without logging request bodies or user data.

- [ ] **Step 4: Run the focused tests**

Run: `pnpm exec tsx --test tests/progress-api.test.ts tests/notes-api.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the API migration**

Run: `git add lib/progress-api.ts lib/notes-api.ts app/api/progress/route.ts app/api/notes/route.ts tests/progress-api.test.ts tests/notes-api.test.ts && git commit -m "Run user data APIs on PostgreSQL"`

---

### Task 4: Add container health and Coolify deployment files

**Files:**

- Create: `app/api/health/route.ts`
- Create: `Dockerfile`
- Create: `.dockerignore`
- Modify: `.env.example`
- Test: `tests/container-config.test.ts`

**Interfaces:**

- Consumes: the Next.js standalone build from Task 1.
- Produces: `GET /api/health` returning `200 { "ok": true }` and a non-root container listening on `0.0.0.0:3000` with a Docker health check.

- [ ] **Step 1: Write failing container configuration tests**

Assert that the Dockerfile uses Node 22, copies `.next/standalone`, `.next/static`, and `public`, sets `HOSTNAME=0.0.0.0`, exposes 3000, runs as a non-root user, and checks `/api/health`. Assert that `.dockerignore` excludes local secrets, build outputs, `.git`, and migration exports.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec tsx --test tests/container-config.test.ts`

Expected: FAIL because the deployment files do not exist.

- [ ] **Step 3: Implement the health route and multi-stage image**

Use Corepack with the repository-pinned pnpm version in dependency and build stages. Generate build-time data, build standalone Next.js, copy only runtime output and public assets, install `wget` for the health check, create an unprivileged Node user, and start `server.js` on port 3000. Document `DATABASE_URL`, Clerk variables, `NEXT_PUBLIC_R2_BASE_URL`, and the temporary `USER_DATA_READ_ONLY` flag in `.env.example` without values.

- [ ] **Step 4: Run the focused test and build locally**

Run: `pnpm exec tsx --test tests/container-config.test.ts && docker build -t codejeet:coolify .`

Expected: PASS and Docker build exit 0.

- [ ] **Step 5: Start and probe the image**

Run the image on an unused local port with test-safe environment values, request `/api/health`, inspect Docker health, then stop and remove only that named test container.

Expected: HTTP 200 with `{"ok":true}` and healthy container state.

- [ ] **Step 6: Commit the deployment files**

Run: `git add app/api/health/route.ts Dockerfile .dockerignore .env.example tests/container-config.test.ts && git commit -m "Add the Coolify container deployment"`

---

### Task 5: Add deterministic D1-to-PostgreSQL migration tooling

**Files:**

- Create: `scripts/migrate-user-data.ts`
- Create: `tests/migrate-user-data.test.ts`
- Modify: `.gitignore`
- Modify: `package.json`

**Interfaces:**

- Consumes: Wrangler JSON exports for `progress` and `notes`, plus `DATABASE_URL`.
- Produces: `normalizeD1Export`, `checksumRows`, `importUserData`, and CLI commands `migration:import` and `migration:verify`.

- [ ] **Step 1: Write failing migration-tool tests**

Use fixtures containing apostrophes, Unicode notes, duplicate keys, empty tables, and reordered rows. Assert stable SHA-256 checksums independent of row order, transactional conflict-safe import, and a non-zero verification result for any count or checksum mismatch.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec tsx --test tests/migrate-user-data.test.ts`

Expected: FAIL because the migration tool does not exist.

- [ ] **Step 3: Implement import and verification**

Read files only from an explicit path beneath `.migration/`, validate every field before opening a transaction, batch parameterized inserts, roll back on failure, and print counts plus checksums without printing user IDs, slugs, or note text. Add `.migration/` to `.gitignore`.

- [ ] **Step 4: Run the focused test**

Run: `pnpm exec tsx --test tests/migrate-user-data.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the migration tooling**

Run: `git add scripts/migrate-user-data.ts tests/migrate-user-data.test.ts .gitignore package.json && git commit -m "Add verified user data migration tooling"`

---

### Task 6: Verify the implementation and prepare the deployable commit

**Files:**

- Modify only files required to fix failures found by the commands below.

**Interfaces:**

- Consumes: Tasks 1 through 5.
- Produces: one exact Git commit that Coolify can build and deploy.

- [ ] **Step 1: Run all repository checks**

Run: `pnpm test && pnpm lint && pnpm format:check && pnpm build`

Expected: all commands exit 0 with no warnings promoted to errors.

- [ ] **Step 2: Rebuild the image without local cache**

Run: `docker build --no-cache -t codejeet:coolify-verified .`

Expected: exit 0.

- [ ] **Step 3: Run final local smoke checks**

Start the verified image with a disposable PostgreSQL database, apply `migrations/postgres/0000_user_data.sql`, and probe health, home, representative public routes, signed-out APIs, and static assets. Stop and remove only the named disposable containers and network after checks complete.

Expected: all probes return their intended 200/401 statuses and no container reports unhealthy.

- [ ] **Step 4: Record the exact deployment commit**

Run: `git status --short --branch && git rev-parse HEAD && git log -1 --format=%s`

Expected: clean tree, full commit SHA, and a plain one-sentence subject.

---

### Task 7: Create and verify the Coolify replacement environment

**Files:**

- No repository files unless a deployment-discovered defect requires a focused tested fix.

**Interfaces:**

- Consumes: exact deployable Git commit, connected source `coolify-ayush-that`, server `localhost`, Dockerfile, and production secrets.
- Produces: a healthy Coolify application and PostgreSQL service reachable through a non-production hostname.

- [ ] **Step 1: Validate the Coolify server**

Use Coolify's server connection validation and fetch-details actions. Confirm Docker and proxy readiness before creating resources. If validation fails, inspect the visible error and Coolify/server logs before changing configuration.

- [ ] **Step 2: Create the CodeJeet project and PostgreSQL service**

Create a `codejeet` project with a `production` environment, PostgreSQL 17, persistent storage, generated credentials, and scheduled backups. Do not expose PostgreSQL publicly.

- [ ] **Step 3: Create the GitHub Dockerfile application**

Select repository `ayush-that/codejeet`, the exact deployable commit or its branch, root base directory, `/Dockerfile`, port 3000, and `/api/health`. Configure rolling health checks.

- [ ] **Step 4: Configure secrets**

Set runtime-only `DATABASE_URL`, Clerk secret key, and other private values. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and any required public build variables using Coolify's build-variable mechanism. Never paste secrets into repository files, logs, or chat.

- [ ] **Step 5: Deploy and inspect**

Deploy, read the complete build/deployment logs, confirm container health, and inspect runtime logs for startup, filesystem, database, Clerk, and proxy errors.

- [ ] **Step 6: Verify the preview origin**

Check `/api/health`, home, company, topic, problem, blog, system-design, robots, sitemap, data JSON, images, signed-out APIs, and a real Clerk sign-in plus progress/note persistence through hard refresh.

---

### Task 8: Migrate production data and cut traffic over

**Files:**

- Local ignored artifacts under `.migration/`; never stage or commit them.

**Interfaces:**

- Consumes: D1 `codejeet-progress`, Coolify PostgreSQL, healthy preview application, Cloudflare zone for `codejeet.com`.
- Produces: PostgreSQL parity and production traffic through Cloudflare to Coolify.

- [ ] **Step 1: Rehearse the export and import**

Export both D1 tables as Wrangler JSON into `.migration/`, record counts/checksums, import into PostgreSQL, and run `migration:verify`. Confirm PostgreSQL has the same logical rows without displaying row contents.

- [ ] **Step 2: Prepare rollback evidence**

Record the active Worker version, Worker route, current DNS records, Cloudflare cache rules, SSL mode, and Coolify application/deployment identifiers in a local ignored migration log.

- [ ] **Step 3: Freeze user-data mutations briefly**

Enable a narrowly scoped Cloudflare rule that blocks POST requests only to `/api/progress` and `/api/notes`, or set the deployed Worker's `USER_DATA_READ_ONLY=1` gate. Verify GET remains available and POST returns the planned maintenance response.

- [ ] **Step 4: Perform the final synchronized import**

Take fresh D1 exports, re-import transactionally, and require exact progress/notes count and checksum parity. Abort cutover and lift the freeze if parity fails.

- [ ] **Step 5: Attach production domains and confirm origin TLS**

Configure `codejeet.com` and `www.codejeet.com` on the Coolify app. Confirm Coolify's origin certificate and routing are ready before changing Cloudflare DNS.

- [ ] **Step 6: Change Cloudflare routing**

Update only the required apex and `www` DNS records to the Coolify origin, keep them proxied, retain Full (strict) SSL, and purge the affected hostname cache.

- [ ] **Step 7: Configure safe cache rules**

Set bypass rules for `/api/*`, auth paths, non-GET/HEAD methods, and authenticated/session-cookie requests. Allow long caching for immutable `/_next/static/*` assets and respect safe public-page origin headers. Do not override `private`, `no-store`, `Set-Cookie`, or authenticated responses.

- [ ] **Step 8: Lift the write freeze on Coolify**

Confirm the production hostname reaches the new healthy deployment and PostgreSQL, then remove the temporary mutation freeze. Verify authenticated writes now reach Coolify.

---

### Task 9: Complete production verification and retain rollback

**Files:**

- No repository files unless verification discovers a focused defect.

**Interfaces:**

- Consumes: public Cloudflare hostname, Coolify origin, PostgreSQL, Clerk session, and rollback record.
- Produces: evidence that every completion criterion in the design is satisfied.

- [ ] **Step 1: Verify public routing and TLS**

Resolve apex and `www`, inspect certificates, follow redirects, and confirm response headers identify Cloudflare at the edge and the Coolify application at the origin rather than the Worker.

- [ ] **Step 2: Verify representative public routes in Comet**

Use a headed browser on `https://codejeet.com` for home, company, topic, problem, blog, system-design, images, robots, and sitemap. Check console and network failures.

- [ ] **Step 3: Verify authenticated persistence in Comet**

Use a real Clerk session to read existing migrated data, create and remove a deterministic test progress entry and note, hard-refresh between operations, and confirm PostgreSQL reflects the final intended state.

- [ ] **Step 4: Verify cache safety and effectiveness**

Make repeated unauthenticated requests to immutable assets and public pages and require an appropriate `CF-Cache-Status` transition or HIT. Confirm `/api/progress`, `/api/notes`, authenticated requests, and mutation responses are never served from cache.

- [ ] **Step 5: Inspect Coolify health and logs**

Confirm the application and database remain healthy and logs contain no migration, database, filesystem, proxy, or Clerk errors during production probes.

- [ ] **Step 6: Confirm rollback remains available**

Verify the old Worker version and D1 database still exist, the pre-cutover DNS/routing values are recorded, and the local export is protected and ignored. Do not delete rollback resources during this migration.

- [ ] **Step 7: Report the final evidence**

Report exact deployment commit, Coolify deployment identifier, database parity counts/checksums, public routes checked, authenticated flow results, cache headers, DNS/TLS state, and whether anything was pushed or posted.
