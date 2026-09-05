import type { WebhookEvent } from "@clerk/nextjs/server";
import { assertAccountRouteName } from "./account-route";

const HANDLE_BYTES = 32;
const HANDLE_HASH_BYTES = 32;
const ACCOUNT_ID_PATTERN = /^[^\u0000\u0009\u000a\u000d]{1,255}$/;
const REVOCATION_WINDOW_MS = 60_000;
const REVOCATION_MAX_REQUESTS = 30;

export type RevocationHandleStatus = { deleted: boolean };

export type AccountDeletionResult = {
  deleted: boolean;
  tombstonedHandleCount: number;
};

export type AccountDeletionEnvironment = { DB: D1Database };

export type VerifyClerkWebhook = (request: Request) => Promise<WebhookEvent>;

export type DeleteAccount = (accountId: string) => Promise<unknown>;

function copyBytes(value: Uint8Array | ArrayBuffer): Uint8Array {
  return value instanceof Uint8Array ? value.slice() : new Uint8Array(value).slice();
}

function bytes(value: unknown, label: string, expected: number): Uint8Array {
  let result: Uint8Array;
  if (value instanceof Uint8Array) result = value.slice();
  else if (value instanceof ArrayBuffer) result = new Uint8Array(value).slice();
  else if (ArrayBuffer.isView(value)) {
    result = new Uint8Array(value.buffer, value.byteOffset, value.byteLength).slice();
  } else if (Object.prototype.toString.call(value) === "[object ArrayBuffer]") {
    result = new Uint8Array(value as ArrayBuffer).slice();
  } else if (
    Array.isArray(value) &&
    value.every((byte): byte is number => Number.isInteger(byte) && byte >= 0 && byte <= 255)
  ) {
    result = Uint8Array.from(value);
  } else {
    throw new Error(`${label} must be binary`);
  }
  if (result.length !== expected) throw new Error(`${label} must be ${expected} bytes`);
  return result;
}

function accountId(value: string): string {
  if (!ACCOUNT_ID_PATTERN.test(value)) throw new Error("account ID is invalid");
  return value;
}

function routeKey(value: string): string {
  return assertAccountRouteName(value);
}

function handle(value: Uint8Array | ArrayBuffer): Uint8Array {
  return bytes(value, "Revocation Handle", HANDLE_BYTES);
}

function handleHash(value: Uint8Array | ArrayBuffer): Uint8Array {
  return bytes(value, "Revocation Handle hash", HANDLE_HASH_BYTES);
}

function blob(value: Uint8Array): ArrayBuffer {
  return copyBytes(value).buffer as ArrayBuffer;
}

async function sha256(value: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", value as BufferSource));
}

async function hmac(secret: string, value: string): Promise<Uint8Array> {
  if (secret.length === 0) throw new Error("sync secret is unavailable");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

/**
 * Atomically rate-limit anonymous status checks with an opaque HMAC key.
 * Expired windows are removed as part of every request, so storage is bounded
 * by the number of active client windows rather than raw address history.
 */
export async function consumeRevocationRateLimit(
  environment: AccountDeletionEnvironment,
  secret: string,
  clientAddress: string,
  now = Date.now()
): Promise<boolean> {
  if (!Number.isFinite(now) || clientAddress.length > 128) return false;
  const windowStarted = Math.floor(now / REVOCATION_WINDOW_MS) * REVOCATION_WINDOW_MS;
  const key = await hmac(secret, clientAddress);
  const result = await environment.DB.batch([
    environment.DB.prepare("DELETE FROM sync_revocation_rate_limits WHERE window_started < ?").bind(
      windowStarted
    ),
    environment.DB.prepare(
      `INSERT INTO sync_revocation_rate_limits (bucket_key, window_started, request_count) VALUES (?, ?, 1)
       ON CONFLICT(bucket_key) DO UPDATE SET
       window_started = excluded.window_started,
       request_count = CASE WHEN sync_revocation_rate_limits.window_started = excluded.window_started
         THEN MIN(sync_revocation_rate_limits.request_count + 1, ?)
         ELSE 1 END`
    ).bind(blob(key), windowStarted, REVOCATION_MAX_REQUESTS + 1),
    environment.DB.prepare(
      "SELECT request_count FROM sync_revocation_rate_limits WHERE bucket_key = ?"
    ).bind(blob(key)),
  ]);
  const count = Number(
    (result[2]?.results[0] as { request_count?: unknown } | undefined)?.request_count
  );
  return Number.isInteger(count) && count <= REVOCATION_MAX_REQUESTS;
}

/** Hash a raw Revocation Handle before it crosses the persistence boundary. */
export async function hashRevocationHandle(value: Uint8Array | ArrayBuffer): Promise<Uint8Array> {
  return sha256(handle(value));
}

function deletedAt(now: () => number): string {
  const value = now();
  if (!Number.isFinite(value)) throw new Error("deletion clock is invalid");
  return new Date(value).toISOString();
}

function validateAccountId(value: string): string {
  return accountId(value);
}

/**
 * Check one installation's hashed handle before actor registration. Active
 * handles remain in sync_actors, while this service retains only deleted handle
 * tombstones and never stores an account identifier with either state.
 */
async function registerRevocationHandleHash(
  environment: AccountDeletionEnvironment,
  accountRouteKey: string,
  value: Uint8Array | ArrayBuffer
): Promise<void> {
  const key = routeKey(accountRouteKey);
  const hash = handleHash(value);
  const existing = await environment.DB.prepare(
    "SELECT handle_hash FROM sync_revocation_handles WHERE handle_hash = ?"
  )
    .bind(blob(hash))
    .first<{ handle_hash: unknown }>();
  if (existing) throw new Error("Revocation Handle is already revoked");
  const deleted = await environment.DB.prepare(
    "SELECT account_route_key FROM sync_account_deletions WHERE account_route_key = ?"
  )
    .bind(key)
    .first<{ account_route_key: unknown }>();
  if (deleted) throw new Error("Account has been deleted");
}

/** Register a raw 32-byte handle, retaining only its SHA-256 digest. */
export async function registerRevocationHandle(
  environment: AccountDeletionEnvironment,
  accountRouteKey: string,
  value: Uint8Array | ArrayBuffer
): Promise<void> {
  await registerRevocationHandleHash(
    environment,
    accountRouteKey,
    await hashRevocationHandle(value)
  );
}

/**
 * Return the only public status shape. Unknown and active handles both perform
 * the same indexed lookup and return `{ deleted: false }`.
 */
export async function checkRevocationHandle(
  environment: AccountDeletionEnvironment,
  value: Uint8Array | ArrayBuffer
): Promise<RevocationHandleStatus> {
  const hash = await hashRevocationHandle(value);
  const row = await environment.DB.prepare(
    "SELECT handle_hash FROM sync_revocation_handles WHERE handle_hash = ?"
  )
    .bind(blob(hash))
    .first<{ handle_hash: unknown }>();
  return { deleted: row !== null };
}

/** Read the retained deletion marker for stale authenticated sessions. */
export async function isAccountDeleted(
  environment: AccountDeletionEnvironment,
  accountRouteKey: string
): Promise<boolean> {
  const key = routeKey(accountRouteKey);
  const row = await environment.DB.prepare(
    "SELECT account_route_key FROM sync_account_deletions WHERE account_route_key = ?"
  )
    .bind(key)
    .first<{ account_route_key: unknown }>();
  return row !== null;
}

/**
 * Delete all server-readable account state in one D1 batch. The account and
 * handle tombstones are written first in that batch, then all canonical and
 * compatibility state is removed. D1 batch failure therefore leaves all of it
 * unchanged.
 */
export async function deleteAccountData(
  environment: AccountDeletionEnvironment,
  account: string,
  accountRouteKey: string,
  now: () => number = () => Date.now()
): Promise<AccountDeletionResult> {
  const accountIdValue = validateAccountId(account);
  const routeKeyValue = routeKey(accountRouteKey);
  const actorRows = await environment.DB.prepare(
    "SELECT revocation_handle_hash FROM sync_actors WHERE account_id = ?"
  )
    .bind(accountIdValue)
    .all<{ revocation_handle_hash: unknown }>();

  const hashes = new Map<string, Uint8Array>();
  for (const row of actorRows.results) {
    const value = bytes(row.revocation_handle_hash, "Revocation Handle hash", HANDLE_HASH_BYTES);
    hashes.set(Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join(""), value);
  }

  const timestamp = deletedAt(now);
  const statements: D1PreparedStatement[] = [
    environment.DB.prepare(
      "INSERT INTO sync_account_deletions (account_route_key, deleted_at) VALUES (?, ?) ON CONFLICT(account_route_key) DO NOTHING"
    ).bind(routeKeyValue, timestamp),
    environment.DB.prepare(
      "INSERT INTO sync_revocation_handles (handle_hash, deleted_at) SELECT revocation_handle_hash, ? FROM sync_actors WHERE account_id = ? ON CONFLICT(handle_hash) DO NOTHING"
    ).bind(timestamp, accountIdValue),
    environment.DB.prepare("DELETE FROM progress WHERE user_id = ?").bind(accountIdValue),
    environment.DB.prepare("DELETE FROM notes WHERE user_id = ?").bind(accountIdValue),
    environment.DB.prepare("DELETE FROM sync_progress_directory WHERE account_id = ?").bind(
      accountIdValue
    ),
    environment.DB.prepare("DELETE FROM sync_progress_shards WHERE account_id = ?").bind(
      accountIdValue
    ),
    environment.DB.prepare("DELETE FROM sync_problem_notes WHERE account_id = ?").bind(
      accountIdValue
    ),
    environment.DB.prepare("DELETE FROM sync_note_actor_bounds WHERE account_id = ?").bind(
      accountIdValue
    ),
    environment.DB.prepare("DELETE FROM sync_causal_summaries WHERE account_id = ?").bind(
      accountIdValue
    ),
    environment.DB.prepare("DELETE FROM sync_actors WHERE account_id = ?").bind(accountIdValue),
    environment.DB.prepare("DELETE FROM sync_legacy_migrations WHERE account_id = ?").bind(
      accountIdValue
    ),
    environment.DB.prepare("DELETE FROM sync_accounts WHERE account_id = ?").bind(accountIdValue),
  ];
  await environment.DB.batch(statements);
  return { deleted: true, tombstonedHandleCount: hashes.size };
}

/**
 * Verify a Clerk webhook and dispatch only verified `user.deleted` events. The
 * deletion callback is supplied by the route so it can target the account DO
 * and preserve its FIFO and socket-closing responsibilities.
 */
export async function handleClerkUserDeletedWebhook(
  request: Request,
  deleteAccount: DeleteAccount,
  verify: VerifyClerkWebhook
): Promise<Response> {
  let event: WebhookEvent;
  try {
    event = await verify(request);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (event.type !== "user.deleted") return new Response(null, { status: 204 });
  const userId = event.data.id;
  if (typeof userId !== "string" || !userId) return new Response(null, { status: 400 });
  try {
    await deleteAccount(userId);
  } catch {
    return new Response(null, { status: 500 });
  }
  return new Response(null, { status: 204 });
}
