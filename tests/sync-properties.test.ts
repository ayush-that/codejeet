import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fc from "fast-check";
import {
  addProgress,
  emptyProgressState,
  joinProgress,
  progressHas,
  removeProgress,
  type ProgressState,
} from "../lib/sync/domain";
import type { ProblemRegistry } from "../lib/problem-registry";

const registry: ProblemRegistry = {
  version: 1,
  problems: [
    { slug: "alpha", active: true },
    { slug: "beta", active: true },
    { slug: "gamma", active: true },
  ],
};
const slugs = ["alpha", "beta", "gamma"] as const;

type Operation = { completed: boolean; slug: string };

function actor(seed: number): Uint8Array {
  const result = new Uint8Array(16);
  result.fill((seed % 250) + 1);
  return result;
}

function stateKey(state: ProgressState): string {
  return JSON.stringify({
    adds: state.adds.map(({ slug, dot }) => ({
      slug,
      actor: Array.from(dot.actorId),
      counter: dot.counter.toString(),
    })),
    causalSummary: [...state.causalSummary.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([actorId, counter]) => [actorId, counter.toString()]),
    removed: [...state.removed.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([slug, summary]) => [
        slug,
        [...summary.entries()]
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([actorId, counter]) => [actorId, counter.toString()]),
      ]),
  });
}

function operationsToState(baseActor: number, operations: readonly Operation[]): ProgressState {
  let state = emptyProgressState();
  operations.forEach((operation, counter) => {
    const replicaActor = actor(baseActor * 16 + counter);
    state = operation.completed
      ? addProgress(state, registry, replicaActor, BigInt(0), operation.slug)
      : removeProgress(state, registry, replicaActor, BigInt(0), operation.slug);
  });
  return state;
}

const operationArbitrary = fc.record({
  completed: fc.boolean(),
  slug: fc.constantFrom(...slugs),
});

function stateArbitrary(baseActor: number) {
  return fc
    .array(operationArbitrary, { maxLength: 8 })
    .map((operations) => operationsToState(baseActor, operations));
}

function joinAll(states: readonly ProgressState[]): ProgressState {
  return states.reduce(
    (joined, state) => joinProgress(joined, state, registry),
    emptyProgressState()
  );
}

describe("Progress replica algebra", () => {
  it("is idempotent, commutative, and associative for independently generated replicas", () => {
    fc.assert(
      fc.property(stateArbitrary(1), stateArbitrary(2), stateArbitrary(3), (left, right, third) => {
        assert.equal(stateKey(joinProgress(left, left, registry)), stateKey(left));
        assert.equal(
          stateKey(joinProgress(left, right, registry)),
          stateKey(joinProgress(right, left, registry))
        );
        assert.equal(
          stateKey(joinProgress(joinProgress(left, right, registry), third, registry)),
          stateKey(joinProgress(left, joinProgress(right, third, registry), registry))
        );
      }),
      { seed: 7201001, numRuns: 250 }
    );
  });

  it("preserves an unseen concurrent add across an observed removal", () => {
    const firstReplica = addProgress(emptyProgressState(), registry, actor(10), BigInt(0), "alpha");
    const removalReplica = removeProgress(firstReplica, registry, actor(20), BigInt(0), "alpha");
    const unseenAdd = addProgress(firstReplica, registry, actor(10), BigInt(1), "alpha");
    const converged = joinAll([removalReplica, unseenAdd]);
    assert.equal(progressHas(converged, "alpha"), true);
    assert.equal(
      converged.adds.some(({ dot }) => dot.counter === BigInt(1)),
      true
    );
    assert.equal(
      converged.adds.some(({ dot }) => dot.counter === BigInt(0)),
      false
    );
  });

  it("joins arbitrary delta partitions with duplication and reordering", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 12 }), { minLength: 1, maxLength: 12 }),
        (seeds) => {
          const deltas = seeds.map((seed) =>
            operationsToState(seed, [
              { completed: true, slug: slugs[seed % slugs.length] },
              { completed: false, slug: slugs[(seed + 1) % slugs.length] },
            ])
          );
          const duplicated = [
            ...deltas,
            ...deltas.slice(0, Math.floor(deltas.length / 2)),
          ].reverse();
          const expected = joinAll(deltas);
          assert.equal(stateKey(joinAll(duplicated)), stateKey(expected));
          assert.equal(
            stateKey(
              joinAll(deltas.map((delta) => joinProgress(emptyProgressState(), delta, registry)))
            ),
            stateKey(expected)
          );
        }
      ),
      { seed: 7201002, numRuns: 150 }
    );
  });

  it("retains causal summaries for every observed actor and counter", () => {
    let firstReplica = addProgress(emptyProgressState(), registry, actor(30), BigInt(0), "alpha");
    firstReplica = removeProgress(firstReplica, registry, actor(30), BigInt(1), "beta");
    const replicas = [
      firstReplica,
      addProgress(emptyProgressState(), registry, actor(31), BigInt(0), "gamma"),
    ];
    const joined = joinAll(replicas);
    assert.equal(
      joined.causalSummary.get(
        Array.from(actor(30), (byte) => byte.toString(16).padStart(2, "0")).join("")
      ),
      BigInt(1)
    );
    assert.equal(
      joined.causalSummary.get(
        Array.from(actor(31), (byte) => byte.toString(16).padStart(2, "0")).join("")
      ),
      BigInt(0)
    );
  });

  it("replaces a canonical snapshot while retaining each replica's pending overlay", () => {
    fc.assert(
      fc.property(
        stateArbitrary(50),
        stateArbitrary(51),
        stateArbitrary(52),
        (canonical, left, right) => {
          const snapshot = joinProgress(canonical, right, registry);
          const localView = joinProgress(snapshot, left, registry);
          assert.equal(stateKey(localView), stateKey(joinAll([canonical, right, left])));
        }
      ),
      { seed: 7201003, numRuns: 150 }
    );
  });
});
