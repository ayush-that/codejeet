/// <reference types="@cloudflare/vitest-plugin/types" />

import { env } from "cloudflare:workers";
import { evictDurableObject, runInDurableObject } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { committedProblemRegistry } from "../../lib/problem-registry";
import {
  applyLegacyNote,
  applyLegacyProgress,
  getLegacyNotes,
  getLegacyProgress,
} from "../../lib/sync/legacy-adapters";
import { accountRouteName } from "../../lib/sync/account-route";
import { MAX_PROGRESS_SHARD_BYTES } from "../../lib/sync/account-data";
import type { AccountData } from "../../lib/sync/account-do";
import { encodeProgressShard } from "../../lib/sync/codec";
import { ACTOR_ID_BYTES } from "../../lib/sync/domain";

const namespace = env.ACCOUNT_DATA as unknown as DurableObjectNamespace<AccountData>;

function actor(seed: number): Uint8Array {
  const value = new Uint8Array(ACTOR_ID_BYTES);
  value.fill(seed);
  return value;
}

function hash(seed: number): Uint8Array {
  const value = new Uint8Array(32);
  value.fill(seed);
  return value;
}

function progressMutation(
  actorId: Uint8Array,
  counter: number,
  slug: string,
  kind: "add" | "remove" = "add"
) {
  return {
    type: "progress" as const,
    mutation: { kind, actorId, counter: BigInt(counter), slug },
  };
}

function noteMutation(actorId: Uint8Array, slug: string, localRevision: number, text: string) {
  return {
    type: "note" as const,
    mutation: {
      slug,
      actorId,
      localRevision: BigInt(localRevision),
      operation: { kind: "value" as const, bytes: new TextEncoder().encode(text) },
    },
  };
}

async function seedProgressRoot(
  accountId: string,
  actorId: Uint8Array,
  slugs: readonly string[]
): Promise<void> {
  const encoded = encodeProgressShard({
    adds: slugs.map((slug, counter) => ({ slug, actorId, counter: BigInt(counter) })),
    removed: [],
  });
  expect(encoded.length).toBeLessThanOrEqual(MAX_PROGRESS_SHARD_BYTES);
  await env.DB.batch([
    env.DB.prepare("INSERT INTO sync_accounts (account_id, server_revision) VALUES (?, ?)").bind(
      accountId,
      "0"
    ),
    env.DB.prepare(
      "INSERT INTO sync_actors (account_id, actor_id, revocation_handle_hash, is_legacy) VALUES (?, ?, ?, 0)"
    ).bind(accountId, actorId, hash(31)),
    env.DB.prepare(
      "INSERT INTO sync_causal_summaries (account_id, actor_id, counter) VALUES (?, ?, ?)"
    ).bind(accountId, actorId, String(slugs.length - 1)),
    env.DB.prepare(
      "INSERT INTO sync_progress_shards (account_id, shard_prefix, prefix_depth, encoded_state, byte_length) VALUES (?, ?, ?, ?, ?)"
    ).bind(accountId, "", 0, encoded, encoded.length),
  ]);

  for (let offset = 0; offset < slugs.length; offset += 25) {
    const statements = slugs
      .slice(offset, offset + 25)
      .map((slug) =>
        env.DB.prepare(
          "INSERT INTO sync_progress_directory (account_id, slug, shard_prefix) VALUES (?, ?, ?)"
        ).bind(accountId, slug, "")
      );
    await env.DB.batch(statements);
  }
}

describe("Account Data Workers runtime", () => {
  it("reconstructs from D1 after eviction and preserves state after rejected work", async () => {
    const accountId = "workers-runtime-account";
    const routeName = await accountRouteName(env.SYNC_HMAC_SECRET, accountId);
    const stub = namespace.getByName(routeName);
    await stub.registerActor(accountId, actor(1), hash(1));
    const mutation = {
      type: "progress" as const,
      mutation: {
        kind: "add" as const,
        actorId: actor(1),
        counter: BigInt(0),
        slug: "01-matrix",
      },
    };
    const accepted = await stub.applyMutations(accountId, [mutation]);
    expect(accepted.serverRevision).toBe(BigInt(1));

    await evictDurableObject(stub);
    const reconstructed = await namespace.getByName(routeName).getCanonical(accountId);
    expect(reconstructed.serverRevision).toBe(BigInt(1));
    expect(reconstructed.progress.adds).toHaveLength(1);

    await env.DB.prepare(
      "CREATE TRIGGER sync_test_failure AFTER INSERT ON sync_progress_shards WHEN NEW.account_id = 'workers-runtime-account' BEGIN SELECT RAISE(ABORT, 'injected D1 failure'); END"
    ).run();
    let persistenceError: unknown;
    await runInDurableObject(stub, async (instance) => {
      try {
        await instance.applyMutations(accountId, [
          {
            ...mutation,
            mutation: {
              ...mutation.mutation,
              counter: BigInt(1),
              slug: "add-two-numbers",
            },
          },
        ]);
      } catch (error) {
        persistenceError = error;
      }
    });
    await env.DB.prepare("DROP TRIGGER sync_test_failure").run();
    expect(persistenceError).toBeDefined();
    const afterRollback = await namespace.getByName(routeName).getCanonical(accountId);
    expect(afterRollback.serverRevision).toBe(BigInt(1));
    expect(afterRollback.progress.adds).toHaveLength(1);

    let rejection: unknown;
    await runInDurableObject(stub, async (instance) => {
      try {
        await instance.applyMutations(accountId, [
          {
            ...mutation,
            mutation: { ...mutation.mutation, counter: BigInt(2) },
          },
        ]);
      } catch (error) {
        rejection = error;
      }
    });
    expect(String(rejection)).toContain("gap");
    const afterRejected = await namespace.getByName(routeName).getCanonical(accountId);
    expect(afterRejected.serverRevision).toBe(BigInt(1));
    expect(afterRejected.progress.adds).toHaveLength(1);
  });

  it("serializes concurrent mutations with contiguous revisions", async () => {
    const accountId = "workers-runtime-fifo";
    const routeName = await accountRouteName(env.SYNC_HMAC_SECRET, accountId);
    const stub = namespace.getByName(routeName);
    await stub.registerActor(accountId, actor(11), hash(11));
    await stub.registerActor(accountId, actor(12), hash(12));

    const results = await Promise.all([
      stub.applyMutations(accountId, [progressMutation(actor(11), 0, "01-matrix")]),
      stub.applyMutations(accountId, [progressMutation(actor(12), 0, "add-two-numbers")]),
    ]);
    expect(results.map((result) => result.serverRevision).sort()).toEqual([BigInt(1), BigInt(2)]);
    const canonical = await stub.getCanonical(accountId);
    expect(canonical.serverRevision).toBe(BigInt(2));
    expect(canonical.progress.adds).toHaveLength(2);
  });

  it("keeps a fresh batch in compact bounded shards", async () => {
    const accountId = "workers-runtime-fresh-shards";
    const routeName = await accountRouteName(env.SYNC_HMAC_SECRET, accountId);
    const stub = namespace.getByName(routeName);
    const actorId = actor(13);
    await stub.registerActor(accountId, actorId, hash(13));
    const slugs = committedProblemRegistry.problems.slice(0, 100).map((entry) => entry.slug);
    const result = await stub.applyMutations(
      accountId,
      slugs.map((slug, counter) => progressMutation(actorId, counter, slug))
    );
    expect(result.serverRevision).toBe(BigInt(slugs.length));
    expect(result.current.shards.size).toBeLessThanOrEqual(16);
    expect(result.current.directory.size).toBe(slugs.length);
    for (const shard of result.current.shards.values()) {
      expect(shard.encoded.length).toBeLessThanOrEqual(MAX_PROGRESS_SHARD_BYTES);
    }

    await evictDurableObject(stub);
    const reconstructed = await namespace.getByName(routeName).getCanonical(accountId);
    expect(reconstructed.progress.adds).toHaveLength(slugs.length);
    expect(reconstructed.shards.size).toBe(result.current.shards.size);
  });

  it("returns the final canonical state for stale and repeated items", async () => {
    const accountId = "workers-runtime-idempotency";
    const routeName = await accountRouteName(env.SYNC_HMAC_SECRET, accountId);
    const stub = namespace.getByName(routeName);
    const actorId = actor(21);
    await stub.registerActor(accountId, actorId, hash(21));

    const first = await stub.applyMutations(accountId, [progressMutation(actorId, 0, "01-matrix")]);
    expect(first.serverRevision).toBe(BigInt(1));

    const mixed = await stub.applyMutations(accountId, [
      progressMutation(actorId, 0, "01-matrix"),
      progressMutation(actorId, 1, "add-two-numbers"),
    ]);
    expect(mixed.acceptedCount).toBe(1);
    expect(mixed.serverRevision).toBe(BigInt(2));
    expect(mixed.results[0].accepted).toBe(false);
    expect(mixed.results[0].serverRevision).toBe(BigInt(2));
    expect(mixed.results[0].current?.serverRevision).toBe(BigInt(2));
    expect(mixed.results[0].current?.progress.adds).toHaveLength(2);

    const note = noteMutation(actorId, "01-matrix", 0, "private");
    const noteAccepted = await stub.applyMutations(accountId, [note]);
    const noteRepeated = await stub.applyMutations(accountId, [note]);
    expect(noteAccepted.serverRevision).toBe(BigInt(3));
    expect(noteRepeated.acceptedCount).toBe(0);
    expect(noteRepeated.serverRevision).toBe(BigInt(3));
    expect(noteRepeated.results[0].serverRevision).toBe(BigInt(3));
    expect(noteRepeated.results[0].current?.serverRevision).toBe(BigInt(3));
  });

  it("rejects every stale RPC after durable account deletion", async () => {
    const accountId = "workers-runtime-deleted-rpc";
    const routeName = await accountRouteName(env.SYNC_HMAC_SECRET, accountId);
    const stub = namespace.getByName(routeName);
    await stub.registerActor(accountId, actor(22), hash(22));
    await stub.deleteAccount(accountId, routeName);
    await runInDurableObject(stub, async (instance) => {
      await expect(instance.getCanonical(accountId)).rejects.toThrow(/deleted/);
      await expect(
        instance.applyMutations(accountId, [progressMutation(actor(22), 0, "01-matrix")])
      ).rejects.toThrow(/deleted/);
      await expect(instance.bootstrapStatus(accountId, "missing-session")).rejects.toThrow(
        /deleted/
      );
    });
  });

  it("imports legacy rows once and preserves the legacy endpoint response shapes", async () => {
    const accountId = "workers-runtime-legacy-import";
    const routeName = await accountRouteName(env.SYNC_HMAC_SECRET, accountId);
    const stub = namespace.getByName(routeName);
    await env.DB.batch([
      env.DB.prepare("INSERT INTO progress (user_id, slug, solved_at) VALUES (?, ?, ?)").bind(
        accountId,
        "add-two-numbers",
        "2026-01-02T00:00:00.000Z"
      ),
      env.DB.prepare("INSERT INTO progress (user_id, slug, solved_at) VALUES (?, ?, ?)").bind(
        accountId,
        "01-matrix",
        "2026-01-01T00:00:00.000Z"
      ),
      env.DB.prepare(
        "INSERT INTO notes (user_id, slug, note, updated_at) VALUES (?, ?, ?, ?)"
      ).bind(accountId, "add-two-numbers", "legacy note", "2026-01-03T00:00:00.000Z"),
    ]);

    const [progress, repeatedProgress, notes] = await Promise.all([
      getLegacyProgress(env, accountId),
      getLegacyProgress(env, accountId),
      getLegacyNotes(env, accountId),
    ]);
    expect(progress).toEqual({
      progress: {
        "01-matrix": "2026-01-01T00:00:00.000Z",
        "add-two-numbers": "2026-01-02T00:00:00.000Z",
      },
    });
    expect(repeatedProgress).toEqual(progress);
    expect(notes).toEqual({
      notes: { "add-two-numbers": "legacy note" },
      updatedAt: { "add-two-numbers": "2026-01-03T00:00:00.000Z" },
    });
    expect((await stub.getCanonical(accountId)).serverRevision).toBe(BigInt(3));

    await env.DB.prepare(
      "CREATE TRIGGER sync_test_legacy_failure AFTER INSERT ON progress WHEN NEW.user_id = 'workers-runtime-legacy-import' BEGIN SELECT RAISE(ABORT, 'injected mirror failure'); END"
    ).run();
    let mirrorFailure: unknown;
    await runInDurableObject(stub, async (instance) => {
      try {
        await instance.applyLegacyProgress(accountId, "two-sum", true);
      } catch (error) {
        mirrorFailure = error;
      }
    });
    expect(mirrorFailure).toBeDefined();
    await env.DB.prepare("DROP TRIGGER sync_test_legacy_failure").run();
    expect(await getLegacyProgress(env, accountId)).toEqual(progress);
    expect((await stub.getCanonical(accountId)).serverRevision).toBe(BigInt(3));

    await applyLegacyProgress(env, accountId, "01-matrix", false);
    await applyLegacyNote(env, accountId, "add-two-numbers", "");
    const after = await Promise.all([
      getLegacyProgress(env, accountId),
      getLegacyNotes(env, accountId),
    ]);
    expect(after[0]).toEqual({
      progress: { "add-two-numbers": "2026-01-02T00:00:00.000Z" },
    });
    expect(after[1]).toEqual({ notes: {}, updatedAt: {} });

    await stub.registerActor(accountId, actor(41), hash(41));
    await stub.applyMutations(accountId, [
      progressMutation(actor(41), 0, "add-two-numbers", "remove"),
    ]);
    expect(await getLegacyProgress(env, accountId)).toEqual({ progress: {} });

    await evictDurableObject(stub);
    expect((await namespace.getByName(routeName).getCanonical(accountId)).serverRevision).toBe(
      BigInt(6)
    );
  });

  it("splits a near-limit shard and reconstructs the split state after eviction", async () => {
    const accountId = "workers-runtime-shard-split";
    const routeName = await accountRouteName(env.SYNC_HMAC_SECRET, accountId);
    const stub = namespace.getByName(routeName);
    const actorId = actor(31);
    const seedSlugs = committedProblemRegistry.problems.slice(0, 950).map((entry) => entry.slug);
    const newSlugs = committedProblemRegistry.problems.slice(950, 1000).map((entry) => entry.slug);
    const seedEncoded = encodeProgressShard({
      adds: seedSlugs.map((slug, counter) => ({ slug, actorId, counter: BigInt(counter) })),
      removed: [],
    });
    const expandedEncoded = encodeProgressShard({
      adds: [...seedSlugs, ...newSlugs].map((slug, counter) => ({
        slug,
        actorId,
        counter: BigInt(counter),
      })),
      removed: [],
    });
    expect(seedEncoded.length).toBeLessThanOrEqual(MAX_PROGRESS_SHARD_BYTES);
    expect(expandedEncoded.length).toBeGreaterThan(MAX_PROGRESS_SHARD_BYTES);
    await seedProgressRoot(accountId, actorId, seedSlugs);

    const result = await stub.applyMutations(
      accountId,
      newSlugs.map((slug, index) => progressMutation(actorId, 950 + index, slug))
    );
    expect(result.acceptedCount).toBe(newSlugs.length);
    expect(result.current.shards.size).toBeGreaterThan(1);
    for (const shard of result.current.shards.values()) {
      expect(shard.encoded.length).toBeLessThanOrEqual(MAX_PROGRESS_SHARD_BYTES);
    }

    await evictDurableObject(stub);
    const reconstructed = await namespace.getByName(routeName).getCanonical(accountId);
    expect(reconstructed.serverRevision).toBe(BigInt(newSlugs.length));
    expect(reconstructed.progress.adds).toHaveLength(seedSlugs.length + newSlugs.length);
    expect(Array.from(reconstructed.shards.keys())).toEqual(
      Array.from(result.current.shards.keys())
    );
    const sortedEntries = (directory: Map<string, string>) =>
      Array.from(directory.entries()).sort(([left], [right]) => left.localeCompare(right));
    expect(sortedEntries(reconstructed.directory)).toEqual(sortedEntries(result.current.directory));
  }, 30_000);
});
