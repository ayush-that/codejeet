/// <reference types="@cloudflare/vitest-plugin/types" />

import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import {
  checkRevocationHandle,
  consumeRevocationRateLimit,
  deleteAccountData,
  hashRevocationHandle,
} from "../../lib/sync/account-deletion";
import { accountRouteName } from "../../lib/sync/account-route";

function bytes(seed: number): Uint8Array {
  const value = new Uint8Array(32);
  value.fill(seed);
  return value;
}

describe("Revocation Handle Workers runtime", () => {
  it("commits deletion atomically and retains only deletion evidence", async () => {
    const account = `workers-delete-${crypto.randomUUID()}`;
    const raw = bytes(7);
    const hash = await hashRevocationHandle(raw);
    await env.DB.batch([
      env.DB.prepare("INSERT INTO sync_accounts (account_id, server_revision) VALUES (?, ?)").bind(
        account,
        "4"
      ),
      env.DB.prepare(
        "INSERT INTO sync_actors (account_id, actor_id, revocation_handle_hash, is_legacy) VALUES (?, ?, ?, 0)"
      ).bind(account, bytes(1).slice(0, 16), hash),
      env.DB.prepare("INSERT INTO progress (user_id, slug, solved_at) VALUES (?, ?, ?)").bind(
        account,
        "01-matrix",
        "2026-01-01T00:00:00.000Z"
      ),
      env.DB.prepare(
        "INSERT INTO notes (user_id, slug, note, updated_at) VALUES (?, ?, ?, ?)"
      ).bind(account, "01-matrix", "private", "2026-01-01T00:00:00.000Z"),
    ]);
    const routeKey = await accountRouteName(env.SYNC_HMAC_SECRET, account);
    await deleteAccountData({ DB: env.DB }, account, routeKey, () => 1_700_000_000_000);
    expect(await checkRevocationHandle({ DB: env.DB }, raw)).toEqual({ deleted: true });
    const tombstone = await env.DB.prepare(
      "SELECT * FROM sync_revocation_handles WHERE handle_hash = ?"
    )
      .bind(hash)
      .first<Record<string, unknown>>();
    expect(tombstone).not.toHaveProperty("account_id");
    expect(
      await env.DB.prepare("SELECT account_id FROM sync_accounts WHERE account_id = ?")
        .bind(account)
        .first()
    ).toBeNull();
    expect(
      await env.DB.prepare("SELECT account_id FROM sync_actors WHERE account_id = ?")
        .bind(account)
        .first()
    ).toBeNull();
    expect(
      await env.DB.prepare("SELECT user_id FROM progress WHERE user_id = ?").bind(account).first()
    ).toBeNull();
    expect(
      await env.DB.prepare("SELECT user_id FROM notes WHERE user_id = ?").bind(account).first()
    ).toBeNull();
  });

  it("is idempotent and keeps unknown handles indistinguishable from active handles", async () => {
    const account = `workers-delete-repeat-${crypto.randomUUID()}`;
    const routeKey = await accountRouteName(env.SYNC_HMAC_SECRET, account);
    await deleteAccountData({ DB: env.DB }, account, routeKey, () => 1_700_000_000_000);
    await deleteAccountData({ DB: env.DB }, account, routeKey, () => 1_700_000_000_001);
    expect(await checkRevocationHandle({ DB: env.DB }, bytes(8))).toEqual({ deleted: false });
  });

  it("rate-limits opaque anonymous status keys per window", async () => {
    const now = 1_700_000_000_000;
    for (let request = 0; request < 30; request++) {
      expect(
        await consumeRevocationRateLimit({ DB: env.DB }, env.SYNC_HMAC_SECRET, "198.51.100.10", now)
      ).toBe(true);
    }
    expect(
      await consumeRevocationRateLimit({ DB: env.DB }, env.SYNC_HMAC_SECRET, "198.51.100.10", now)
    ).toBe(false);
    expect(
      await consumeRevocationRateLimit({ DB: env.DB }, env.SYNC_HMAC_SECRET, "198.51.100.11", now)
    ).toBe(true);
    expect(
      await consumeRevocationRateLimit(
        { DB: env.DB },
        env.SYNC_HMAC_SECRET,
        "198.51.100.10",
        now + 60_000
      )
    ).toBe(true);
  });
});
