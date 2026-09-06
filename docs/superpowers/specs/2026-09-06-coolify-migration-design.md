# CodeJeet Coolify Migration Design

## Objective

Move `codejeet.com` from Cloudflare Workers to the existing Coolify installation at `coolify.ayushworks.com`, while preserving signed-in progress and notes. Keep Cloudflare only as the authoritative DNS, TLS proxy, and edge cache in front of the Coolify origin.

## Current State

- Production runs the Next.js 16 application through OpenNext on a Cloudflare Worker named `codejeet`.
- Cloudflare D1 database `codejeet-progress` stores 2,221 progress rows and 24 note rows at the start of migration work.
- R2 bucket `codejeet-next-cache` stores OpenNext incremental-cache data. It is disposable cache data, not user data.
- Clerk supplies authentication. The public hostname remains `https://codejeet.com`, so production Clerk origins and callbacks do not change.
- Cloudflare currently proxies the public hostname and returns cacheable HTML with `s-maxage=31536000, stale-while-revalidate=2592000`.

## Target Architecture

Coolify builds and runs one Node.js Next.js application from this repository using a multi-stage Dockerfile and Next.js standalone output. A Coolify-managed PostgreSQL service stores progress and notes. The application receives `DATABASE_URL`, Clerk variables, and other runtime configuration through Coolify secrets.

Cloudflare remains in front of the application with proxied DNS. Coolify terminates a valid origin certificate for the production hostname, and Cloudflare uses Full (strict) SSL mode. Cloudflare may cache public GET and HEAD responses, but it must bypass `/api/*`, Clerk/authentication paths, responses with `Set-Cookie`, and any request carrying authentication cookies.

## Application Changes

1. Enable Next.js standalone output and remove production reliance on `@opennextjs/cloudflare`.
2. Add a small PostgreSQL data-access module with parameterized queries for progress and notes.
3. Keep existing API contracts unchanged:
   - `GET /api/progress` returns `{ progress: Record<string, string> }`.
   - `POST /api/progress` inserts the first solve timestamp or deletes the row.
   - `GET /api/notes` returns `{ notes, updatedAt }`.
   - `POST /api/notes` upserts a non-empty note or deletes an empty note.
4. Preserve Clerk-derived `userId` as the only source of database identity.
5. Read generated JSON data from the packaged filesystem. Remove the Cloudflare `ASSETS` fallback after the standalone image proves those files are included.
6. Add a health endpoint that proves the Node process is responsive without exposing secrets or depending on an authenticated session.
7. Add a multi-stage Dockerfile, `.dockerignore`, and deployment documentation for Coolify.

## PostgreSQL Schema

Use the existing logical keys and ISO-8601 timestamp strings so migration does not change behavior:

```sql
CREATE TABLE progress (
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  solved_at TEXT NOT NULL,
  PRIMARY KEY (user_id, slug)
);

CREATE TABLE notes (
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  note TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, slug)
);
```

The application runs idempotent schema creation at deployment startup or through a one-shot migration command before receiving traffic. PostgreSQL credentials remain in Coolify and are never committed.

## Data Migration

1. Export D1 to a local ignored artifact and record table counts and checksums.
2. Create the Coolify PostgreSQL database and schema.
3. Import the exported progress and notes rows with conflict-safe inserts.
4. Compare source and destination row counts and deterministic checksums.
5. Before DNS cutover, perform a short write freeze for authenticated progress/note mutations, take a final delta export, import it, and re-run parity checks.
6. Keep the D1 database unchanged until the Coolify deployment has passed the rollback window.

The initial export is a rehearsal and backup. Only the final synchronized import is authoritative for cutover.

## Deployment and Cutover

1. Build and test the standalone container locally.
2. Create the Coolify PostgreSQL service and application without attaching the production hostname.
3. Configure secrets and deploy the exact approved Git commit.
4. Validate through the Coolify preview hostname or a temporary migration hostname.
5. Attach `codejeet.com` and `www.codejeet.com` to the Coolify application and confirm origin TLS is ready.
6. Update Cloudflare DNS to the Coolify origin while keeping proxying enabled.
7. Purge affected Cloudflare cache entries after the origin switch.
8. Verify the public hostname from multiple fresh requests and a headed browser.

DNS changes happen only after the replacement origin passes health, representative page, API, authentication, persistence, and TLS checks.

## Cloudflare Cache Policy

- Cache immutable `/_next/static/*` assets and versioned public assets for a long edge TTL.
- Respect application cache headers for public HTML and other generated public content.
- Bypass cache for `/api/*`, Clerk authentication routes, non-GET/HEAD methods, requests with authentication/session cookies, and responses containing `Set-Cookie` or marked private/no-store.
- Do not use Cache Everything on authenticated or mutation-capable paths.
- Confirm caching with repeated requests showing a Cloudflare cache status transition or HIT, while API responses consistently show bypassed/dynamic behavior.

## Verification

Before cutover:

- Unit tests cover database reads, first-solve preservation, deletion, note upsert, validation, and unauthorized behavior.
- Lint, format check, TypeScript/build, and the full test suite pass.
- The container starts from a clean build and its health endpoint succeeds.
- Coolify preview checks cover the home page, representative company/topic/problem/blog/system-design routes, static data, images, robots, sitemap, and canonical URLs.
- A real Clerk browser session can read and persist progress and notes across a hard refresh.
- PostgreSQL row counts and checksums match the final D1 export.

After cutover:

- `codejeet.com` and `www.codejeet.com` resolve through Cloudflare to the Coolify origin and serve valid TLS.
- Public and authenticated browser flows work on the production hostname.
- Repeated public requests demonstrate Cloudflare edge caching.
- API/authenticated responses demonstrate cache bypass.
- Coolify health and application logs show no migration-related errors.

## Rollback

Keep the existing Worker deployment, D1 database, DNS record values, exported data, and Cloudflare configuration until production verification succeeds. If verification fails, restore the prior Cloudflare Worker route/DNS target, purge affected edge cache entries, and verify the old Worker and D1-backed flows. PostgreSQL remains available for diagnosis and reconciliation; it is not treated as authoritative until the successful cutover.

## Completion Criteria

The migration is complete only when Coolify serves the production hostname, all D1 user data is present in PostgreSQL, signed-in writes persist on the production hostname, Cloudflare caches only safe public responses, the prior Worker no longer receives production traffic, and rollback artifacts are retained for the agreed observation window.
