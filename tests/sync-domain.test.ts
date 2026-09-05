import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { type ProblemRegistry } from "../lib/problem-registry";
import {
  ACTOR_ID_BYTES,
  DomainError,
  acceptProblemNoteMutation,
  addProgress,
  actorIdKey,
  applyProblemNoteMutation,
  createProblemNoteDeleteMutation,
  createProblemNoteMutation,
  emptyProblemNoteState,
  emptyProgressState,
  joinProgress,
  problemNoteText,
  progressHas,
  progressSolvedSlugs,
  removeProgress,
  type ProblemNoteState,
  type ProgressState,
} from "../lib/sync/domain";
import { CodecError, MAX_UINT64 } from "../lib/sync/codec";

const registry: ProblemRegistry = {
  version: 1,
  problems: [
    { slug: "alpha", active: true },
    { slug: "retired", active: false },
  ],
};

function actor(seed: number): Uint8Array {
  const result = new Uint8Array(ACTOR_ID_BYTES);
  result.fill(seed);
  return result;
}

function assertDomainError(action: () => unknown, code?: DomainError["code"]): void {
  assert.throws(action, (error: unknown) => {
    assert.ok(error instanceof DomainError);
    if (code !== undefined) assert.equal(error.code, code);
    return true;
  });
}

function assertStatesEqual(left: ProgressState, right: ProgressState): void {
  assert.deepEqual(left, right);
}

describe("Progress Observed-Remove Set", () => {
  it("retains add dots and removes only dots observed for one slug", () => {
    const firstActor = actor(1);
    const secondActor = actor(2);
    const base = emptyProgressState();
    const first = addProgress(base, registry, firstActor, BigInt(0), "alpha");
    assert.equal(progressHas(first, "alpha"), true);
    assert.equal(first.adds[0].dot.counter, BigInt(0));
    const removed = removeProgress(first, registry, firstActor, BigInt(1), "alpha");
    assert.equal(progressHas(removed, "alpha"), false);
    assert.equal(removed.removed.get("alpha")?.get("01010101010101010101010101010101"), BigInt(0));

    const unseen = addProgress(base, registry, secondActor, BigInt(0), "alpha");
    const joined = joinProgress(removed, unseen, registry);
    assert.equal(progressHas(joined, "alpha"), true);
    assert.deepEqual(progressSolvedSlugs(joined), ["alpha"]);
  });

  it("keeps a concurrent unseen add alive and isolates removal contexts by slug", () => {
    const firstActor = actor(3);
    const secondActor = actor(4);
    const first = addProgress(emptyProgressState(), registry, firstActor, BigInt(0), "alpha");
    const otherSlug = addProgress(
      emptyProgressState(),
      registry,
      secondActor,
      BigInt(0),
      "retired"
    );
    const removed = removeProgress(first, registry, firstActor, BigInt(1), "alpha");
    const joined = joinProgress(removed, otherSlug, registry);
    assert.equal(progressHas(joined, "alpha"), false);
    assert.equal(progressHas(joined, "retired"), true);
  });

  it("does not resurrect a stale pre-removal add during a later join", () => {
    const firstActor = actor(9);
    const beforeRemoval = addProgress(
      emptyProgressState(),
      registry,
      firstActor,
      BigInt(0),
      "alpha"
    );
    const afterRemoval = removeProgress(beforeRemoval, registry, firstActor, BigInt(1), "alpha");
    const joined = joinProgress(beforeRemoval, afterRemoval, registry);
    assert.equal(progressHas(joined, "alpha"), false);
    assert.equal(joined.adds.length, 0);
  });

  it("preserves a remover's observed causal dots when the add arrives later", () => {
    const addActor = actor(14);
    const removeActor = actor(15);
    const added = addProgress(emptyProgressState(), registry, addActor, BigInt(0), "alpha");
    const removal = removeProgress(
      emptyProgressState(),
      registry,
      removeActor,
      BigInt(0),
      "alpha",
      [{ actorId: addActor, counter: BigInt(0) }]
    );
    const joined = joinProgress(removal, added, registry);
    assert.equal(progressHas(joined, "alpha"), false);
    assert.equal(joined.removed.get("alpha")?.get(actorIdKey(addActor)), BigInt(0));
  });

  it("is idempotent, commutative, and associative under delta joins", () => {
    const a = actor(5);
    const b = actor(6);
    const c = actor(7);
    const base = emptyProgressState();
    const left = addProgress(base, registry, a, BigInt(0), "alpha");
    const right = addProgress(base, registry, b, BigInt(0), "retired");
    const later = addProgress(left, registry, a, BigInt(1), "alpha");
    const ab = joinProgress(left, right, registry);
    assertStatesEqual(ab, joinProgress(right, left, registry));
    assertStatesEqual(ab, joinProgress(ab, ab, registry));
    const third = addProgress(emptyProgressState(), registry, c, BigInt(0), "alpha");
    assertStatesEqual(
      joinProgress(joinProgress(left, right, registry), third, registry),
      joinProgress(left, joinProgress(right, third, registry), registry)
    );
    assert.equal(progressHas(joinProgress(later, right, registry), "alpha"), true);
  });

  it("checks the join laws over many deterministic generated states", () => {
    for (let simulation = 0; simulation < 100; simulation++) {
      let seed = (0x13579bdf + simulation) >>> 0;
      const nextRandom = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed;
      };
      const generated = [1, 2, 3].map((actorSeed) => {
        const id = actor(actorSeed + simulation);
        let state = emptyProgressState();
        for (let counter = 0; counter < 12; counter++) {
          const slug = nextRandom() % 2 === 0 ? "alpha" : "retired";
          state =
            nextRandom() % 3 === 0
              ? removeProgress(state, registry, id, BigInt(counter), slug)
              : addProgress(state, registry, id, BigInt(counter), slug);
        }
        return state;
      });
      const [first, second, third] = generated;
      const left = joinProgress(first, second, registry);
      assertStatesEqual(left, joinProgress(second, first, registry));
      assertStatesEqual(left, joinProgress(left, left, registry));
      assertStatesEqual(
        joinProgress(left, third, registry),
        joinProgress(first, joinProgress(second, third, registry), registry)
      );
    }
  });

  it("rejects counter reuse, malformed actors, and unknown slugs", () => {
    const firstActor = actor(8);
    const state = addProgress(emptyProgressState(), registry, firstActor, BigInt(0), "alpha");
    assertDomainError(
      () => addProgress(state, registry, firstActor, BigInt(0), "retired"),
      "COUNTER_REUSE"
    );
    assertDomainError(
      () => addProgress(state, registry, firstActor, BigInt(2), "retired"),
      "COUNTER_GAP"
    );
    assertDomainError(
      () => addProgress(emptyProgressState(), registry, firstActor, BigInt(1), "retired"),
      "COUNTER_GAP"
    );
    assertDomainError(
      () => addProgress(emptyProgressState(), registry, new Uint8Array(15), BigInt(0), "alpha"),
      "INVALID_ACTOR"
    );
    assertDomainError(
      () => addProgress(emptyProgressState(), registry, firstActor, BigInt(0), "unknown"),
      "INVALID_SLUG"
    );
    assertDomainError(
      () =>
        joinProgress(
          {
            adds: [],
            causalSummary: new Map(),
            removed: new Map([["unknown", new Map()]]),
          },
          emptyProgressState(),
          registry
        ),
      "INVALID_SLUG"
    );
    assertDomainError(
      () =>
        addProgress(emptyProgressState(), registry, firstActor, MAX_UINT64 + BigInt(1), "alpha"),
      "INVALID_COUNTER"
    );
    const exhausted = {
      adds: [],
      causalSummary: new Map([["08080808080808080808080808080808", MAX_UINT64]]),
      removed: new Map(),
    };
    assertDomainError(
      () => addProgress(exhausted, registry, firstActor, BigInt(0), "alpha"),
      "COUNTER_EXHAUSTED"
    );
  });

  it("converges a seeded multi-actor partition and duplicate-delivery simulation", () => {
    const actors = [actor(11), actor(12), actor(13)];
    const replicas = actors.map(() => emptyProgressState());
    const messages: ProgressState[] = [];
    const counters = [BigInt(0), BigInt(0), BigInt(0)];
    let seed = 0x9e3779b9;
    const nextRandom = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed;
    };

    for (let round = 0; round < 60; round++) {
      const replicaIndex = round % replicas.length;
      const slug = round % 3 === 0 ? "alpha" : "retired";
      const counter = counters[replicaIndex];
      const mutation = round % 4 === 3 ? "remove" : "add";
      replicas[replicaIndex] =
        mutation === "add"
          ? addProgress(replicas[replicaIndex], registry, actors[replicaIndex], counter, slug)
          : removeProgress(replicas[replicaIndex], registry, actors[replicaIndex], counter, slug);
      counters[replicaIndex] += BigInt(1);
      messages.push(replicas[replicaIndex]);

      for (let delivery = 0; delivery < 3; delivery++) {
        const message = messages[nextRandom() % messages.length];
        const target = nextRandom() % replicas.length;
        replicas[target] = joinProgress(replicas[target], message, registry);
      }
      if (round % 10 === 0) {
        const snapshot = replicas.reduce(
          (combined, current) => joinProgress(combined, current, registry),
          emptyProgressState()
        );
        replicas[round % replicas.length] = snapshot;
      }
    }

    for (const message of messages) {
      for (let index = 0; index < replicas.length; index++) {
        replicas[index] = joinProgress(replicas[index], message, registry);
      }
    }
    const converged = replicas.reduce(
      (combined, current) => joinProgress(combined, current, registry),
      emptyProgressState()
    );
    for (const replica of replicas) {
      assertStatesEqual(joinProgress(replica, converged, registry), converged);
    }
  });

  it("converges reordered duplicate snapshot delivery across many seeds", () => {
    for (let simulation = 0; simulation < 24; simulation++) {
      const actors = [actor(40 + simulation), actor(70 + simulation), actor(100 + simulation)];
      const replicas = actors.map(() => emptyProgressState());
      const messages: ProgressState[] = [];
      const counters = [BigInt(0), BigInt(0), BigInt(0)];
      let seed = (0x2468ace0 + simulation) >>> 0;
      const nextRandom = () => {
        seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
        return seed;
      };
      for (let round = 0; round < 36; round++) {
        const index = round % replicas.length;
        const slug = nextRandom() % 2 === 0 ? "alpha" : "retired";
        const operation = nextRandom() % 2 === 0 ? "add" : "remove";
        replicas[index] =
          operation === "add"
            ? addProgress(replicas[index], registry, actors[index], counters[index], slug)
            : removeProgress(replicas[index], registry, actors[index], counters[index], slug);
        counters[index] += BigInt(1);
        messages.push(replicas[index]);
        for (let delivery = 0; delivery < 4; delivery++) {
          const message = messages[nextRandom() % messages.length];
          const target = nextRandom() % replicas.length;
          replicas[target] = joinProgress(replicas[target], message, registry);
        }
      }
      for (let index = messages.length - 1; index >= 0; index--) {
        for (let target = 0; target < replicas.length; target++) {
          replicas[target] = joinProgress(replicas[target], messages[index], registry);
        }
      }
      const snapshot = replicas.reduce(
        (combined, current) => joinProgress(combined, current, registry),
        emptyProgressState()
      );
      for (const replica of replicas)
        assertStatesEqual(joinProgress(replica, snapshot, registry), snapshot);
    }
  });
});

describe("server-sequenced Problem Note register", () => {
  it("preserves exact values, supports explicit delete, and accepts retired slugs", () => {
    const noteActor = actor(20);
    const value = createProblemNoteMutation(
      registry,
      noteActor,
      BigInt(0),
      "retired",
      "  a\n\n b  "
    );
    const first = acceptProblemNoteMutation(emptyProblemNoteState(), registry, value, BigInt(1));
    assert.equal(first.accepted, true);
    assert.equal(problemNoteText(first.current), "  a\n\n b  ");
    const deletion = createProblemNoteDeleteMutation(registry, noteActor, BigInt(1), "retired");
    const second = acceptProblemNoteMutation(first.state, registry, deletion, BigInt(2));
    assert.equal(second.accepted, true);
    assert.equal(second.current?.operation.kind, "delete");
    assert.equal(problemNoteText(second.current), "");
  });

  it("deduplicates local revisions per Actor and problem without advancing the server revision", () => {
    const noteActor = actor(21);
    const mutation = createProblemNoteMutation(registry, noteActor, BigInt(4), "alpha", "first");
    const first = acceptProblemNoteMutation(emptyProblemNoteState(), registry, mutation, BigInt(7));
    const repeated = applyProblemNoteMutation(first.state, registry, mutation, BigInt(8));
    assert.equal(repeated.accepted, false);
    assert.equal(repeated.state.serverRevision, BigInt(7));
    assert.equal(problemNoteText(repeated.current), "first");
    const returnedRecord = repeated.state.notes.get("alpha");
    if (returnedRecord?.operation.kind === "value") returnedRecord.operation.bytes[0] = 0;
    assert.equal(problemNoteText(first.current), "first");

    const otherProblem = createProblemNoteMutation(
      registry,
      noteActor,
      BigInt(4),
      "retired",
      "other"
    );
    const independent = acceptProblemNoteMutation(first.state, registry, otherProblem, BigInt(8));
    assert.equal(independent.accepted, true);
    assert.equal(problemNoteText(independent.current), "other");
  });

  it("uses account server order for the winning register and isolates Actors", () => {
    const first = createProblemNoteMutation(registry, actor(22), BigInt(0), "alpha", "first");
    const second = createProblemNoteMutation(registry, actor(23), BigInt(0), "alpha", "second");
    const state1 = acceptProblemNoteMutation(
      emptyProblemNoteState(),
      registry,
      first,
      BigInt(1)
    ).state;
    const state2 = acceptProblemNoteMutation(state1, registry, second, BigInt(2));
    assert.equal(problemNoteText(state2.current), "second");
    assert.equal(state2.state.highestLocalRevisions.get("alpha")?.size, 2);
    const delayed = createProblemNoteMutation(registry, actor(24), BigInt(0), "alpha", "delayed");
    const delayedResult = applyProblemNoteMutation(state2.state, registry, delayed, BigInt(1));
    assert.equal(delayedResult.accepted, true);
    assert.equal(problemNoteText(delayedResult.current), "second");

    const alphaOld = createProblemNoteMutation(registry, actor(25), BigInt(0), "alpha", "old");
    const retired = createProblemNoteMutation(registry, actor(26), BigInt(0), "retired", "retired");
    const highWater = acceptProblemNoteMutation(
      acceptProblemNoteMutation(emptyProblemNoteState(), registry, alphaOld, BigInt(5)).state,
      registry,
      retired,
      BigInt(10)
    ).state;
    const alphaNew = createProblemNoteMutation(registry, actor(27), BigInt(0), "alpha", "new");
    const reordered = applyProblemNoteMutation(highWater, registry, alphaNew, BigInt(7));
    assert.equal(problemNoteText(reordered.current), "new");
    assert.equal(reordered.state.serverRevision, BigInt(10));
  });

  it("rejects invalid note operations, Unicode, revisions, and unknown slugs", () => {
    const noteActor = actor(24);
    assertDomainError(
      () => createProblemNoteMutation(registry, noteActor, BigInt(0), "unknown", "text"),
      "INVALID_SLUG"
    );
    assert.throws(
      () =>
        createProblemNoteMutation(
          registry,
          noteActor,
          BigInt(0),
          "alpha",
          String.fromCharCode(0xd800)
        ),
      (error: unknown) => error instanceof CodecError
    );
    assertDomainError(
      () =>
        applyProblemNoteMutation(
          emptyProblemNoteState(),
          registry,
          {
            slug: "alpha",
            actorId: noteActor,
            localRevision: BigInt(0),
            operation: { kind: "value", bytes: new Uint8Array() },
          },
          BigInt(1)
        ),
      "INVALID_OPERATION"
    );
    const validMutation = createProblemNoteMutation(
      registry,
      noteActor,
      BigInt(0),
      "alpha",
      "text"
    );
    assertDomainError(
      () =>
        applyProblemNoteMutation(
          {
            serverRevision: BigInt(0),
            notes: new Map(),
            highestLocalRevisions: new Map([["unknown", new Map()]]),
          },
          registry,
          validMutation,
          BigInt(1)
        ),
      "INVALID_SLUG"
    );
    assertDomainError(
      () =>
        applyProblemNoteMutation(
          {
            serverRevision: BigInt(0),
            notes: new Map([
              [
                "unknown",
                {
                  slug: "unknown",
                  actorId: noteActor,
                  localRevision: BigInt(0),
                  serverRevision: BigInt(0),
                  operation: { kind: "delete" },
                },
              ],
            ]),
            highestLocalRevisions: new Map(),
          },
          registry,
          validMutation,
          BigInt(1)
        ),
      "INVALID_SLUG"
    );
    assertDomainError(
      () => createProblemNoteMutation(registry, noteActor, MAX_UINT64 + BigInt(1), "alpha", "text"),
      "INVALID_COUNTER"
    );
  });

  it("keeps seeded note delivery deterministic across Actors and duplicates", () => {
    const mutations = [
      createProblemNoteMutation(registry, actor(30), BigInt(0), "alpha", "a"),
      createProblemNoteMutation(registry, actor(31), BigInt(0), "alpha", "b"),
      createProblemNoteDeleteMutation(registry, actor(30), BigInt(1), "alpha"),
    ];
    const orders = [
      [0, 1, 2, 1, 0],
      [2, 0, 1, 2, 0],
    ];
    const states: ProblemNoteState[] = orders.map((order) => {
      let state = emptyProblemNoteState();
      for (const index of order) {
        const result = applyProblemNoteMutation(
          state,
          registry,
          mutations[index],
          BigInt(index + 1)
        );
        if (result.accepted) state = result.state;
      }
      return state;
    });
    assert.deepEqual(states[0], states[1]);
    assert.equal(problemNoteText(states[0].notes.get("alpha")), "");
  });
});
