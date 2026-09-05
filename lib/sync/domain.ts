import { CodecError, MAX_UINT64, decodeProblemNoteText, encodeProblemNoteText } from "./codec";
import {
  isRegisteredProblemSlug,
  validateProblemRegistry,
  type ProblemRegistry,
} from "../problem-registry";

export const ACTOR_ID_BYTES = 16;

export class DomainError extends Error {
  constructor(
    message: string,
    readonly code:
      | "INVALID_ACTOR"
      | "INVALID_COUNTER"
      | "INVALID_SLUG"
      | "INVALID_STATE"
      | "INVALID_OPERATION"
      | "COUNTER_REUSE"
      | "COUNTER_GAP"
      | "COUNTER_EXHAUSTED"
      | "SERVER_REVISION"
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export type ActorId = Uint8Array;
type CausalSummary = Map<string, bigint>;

export type ProgressDot = {
  actorId: ActorId;
  counter: bigint;
};

type ProgressAdd = {
  slug: string;
  dot: ProgressDot;
};

/**
 * A state-based delta-state OR-Set. `removed` is scoped by slug so removing
 * one Progress value cannot accidentally remove a dot for another value.
 */
export type ProgressState = {
  adds: ProgressAdd[];
  causalSummary: CausalSummary;
  removed: Map<string, CausalSummary>;
};

export type ProgressMutation =
  | {
      kind: "add" | "remove";
      actorId: ActorId | ArrayBuffer;
      counter: bigint;
      slug: string;
    }
  | { kind: "delta"; state: ProgressState };

type NoteOperation = { kind: "value"; bytes: Uint8Array } | { kind: "delete" };

export type ProblemNoteMutation = {
  slug: string;
  actorId: ActorId | ArrayBuffer;
  localRevision: bigint;
  operation: NoteOperation;
};

export type ProblemNoteRecord = {
  slug: string;
  actorId: ActorId;
  localRevision: bigint;
  serverRevision: bigint;
  operation: NoteOperation;
};

export type ProblemNoteState = {
  serverRevision: bigint;
  notes: Map<string, ProblemNoteRecord>;
  highestLocalRevisions: Map<string, CausalSummary>;
};

const UTF8 = new TextEncoder();

function compareBytes(left: Uint8Array, right: Uint8Array): number {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index++) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return left.length - right.length;
}

function compareStrings(left: string, right: string): number {
  return compareBytes(UTF8.encode(left), UTF8.encode(right));
}

function copyBytes(value: Uint8Array | ArrayBuffer): Uint8Array {
  return (value instanceof Uint8Array ? value : new Uint8Array(value)).slice();
}

function actorBytes(value: ActorId | ArrayBuffer): ActorId {
  const result = copyBytes(value);
  if (result.length !== ACTOR_ID_BYTES) {
    throw new DomainError(`Actor ID must contain ${ACTOR_ID_BYTES} bytes`, "INVALID_ACTOR");
  }
  return result;
}

export function actorIdKey(value: ActorId | ArrayBuffer): string {
  return Array.from(actorBytes(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function actorIdFromKey(key: string): ActorId {
  if (!/^[0-9a-f]{32}$/.test(key)) {
    throw new DomainError("invalid Actor ID key", "INVALID_ACTOR");
  }
  return Uint8Array.from(key.match(/../g) ?? [], (byte) => Number.parseInt(byte, 16));
}

function assertU64(value: bigint, label: string): void {
  if (typeof value !== "bigint" || value < BigInt(0) || value > MAX_UINT64) {
    throw new DomainError(`${label} must be an unsigned 64-bit integer`, "INVALID_COUNTER");
  }
}

function assertSlug(registry: ProblemRegistry, slug: string): void {
  validateProblemRegistry(registry);
  if (typeof slug !== "string" || !isRegisteredProblemSlug(registry, slug)) {
    throw new DomainError(`unknown Problem Registry slug: ${String(slug)}`, "INVALID_SLUG");
  }
}

function maxCounter(target: CausalSummary, actor: string, counter: bigint): void {
  const previous = target.get(actor);
  if (previous === undefined || counter > previous) target.set(actor, counter);
}

function cloneSummary(summary: CausalSummary): CausalSummary {
  const result = new Map<string, bigint>();
  for (const [actor, counter] of summary) {
    actorIdFromKey(actor);
    assertU64(counter, "causal counter");
    result.set(actor, counter);
  }
  return new Map(
    Array.from(result.entries()).sort(([left], [right]) => compareStrings(left, right))
  );
}

function cloneOperation(operation: NoteOperation): NoteOperation {
  if (operation.kind === "delete") return { kind: "delete" };
  if (operation.kind !== "value") {
    throw new DomainError("unknown Problem Note operation", "INVALID_OPERATION");
  }
  const bytes = copyBytes(operation.bytes);
  if (bytes.length === 0) {
    throw new DomainError("empty Problem Note values must use delete", "INVALID_OPERATION");
  }
  try {
    decodeProblemNoteText(bytes);
  } catch (error) {
    if (error instanceof CodecError) throw error;
    throw new DomainError("invalid Problem Note value", "INVALID_OPERATION");
  }
  return { kind: "value", bytes };
}

function cloneProgressState(state: ProgressState, registry?: ProblemRegistry): ProgressState {
  if (!state || !Array.isArray(state.adds) || !(state.causalSummary instanceof Map)) {
    throw new DomainError("invalid Progress state", "INVALID_STATE");
  }
  if (!(state.removed instanceof Map)) {
    throw new DomainError("invalid Progress removal state", "INVALID_STATE");
  }

  const adds: ProgressAdd[] = [];
  const seenDots = new Map<string, string>();
  for (const add of state.adds) {
    if (!add || typeof add.slug !== "string") {
      throw new DomainError("invalid Progress add", "INVALID_STATE");
    }
    if (registry) assertSlug(registry, add.slug);
    const actorId = actorBytes(add.dot.actorId);
    assertU64(add.dot.counter, "Progress counter");
    const dotKey = `${actorIdKey(actorId)}:${add.dot.counter.toString()}`;
    const previousSlug = seenDots.get(dotKey);
    if (previousSlug !== undefined && previousSlug !== add.slug) {
      throw new DomainError("one Progress dot names multiple slugs", "INVALID_STATE");
    }
    if (previousSlug === undefined) {
      seenDots.set(dotKey, add.slug);
      adds.push({ slug: add.slug, dot: { actorId, counter: add.dot.counter } });
    }
  }

  const causalSummary = cloneSummary(state.causalSummary);
  const removed = new Map<string, CausalSummary>();
  for (const [slug, summary] of state.removed) {
    if (typeof slug !== "string" || !(summary instanceof Map)) {
      throw new DomainError("invalid Progress removal summary", "INVALID_STATE");
    }
    if (registry) assertSlug(registry, slug);
    removed.set(slug, cloneSummary(summary));
  }

  for (const add of adds) {
    const actor = actorIdKey(add.dot.actorId);
    const observed = causalSummary.get(actor);
    if (observed === undefined || observed < add.dot.counter)
      causalSummary.set(actor, add.dot.counter);
  }
  for (const summary of removed.values()) {
    for (const [actor, counter] of summary) maxCounter(causalSummary, actor, counter);
  }

  const visibleAdds = adds.filter((add) => {
    const summary = removed.get(add.slug);
    return (
      summary?.get(actorIdKey(add.dot.actorId)) === undefined ||
      (summary.get(actorIdKey(add.dot.actorId)) as bigint) < add.dot.counter
    );
  });
  return canonicalProgressState({ adds: visibleAdds, causalSummary, removed });
}

function canonicalProgressState(state: ProgressState): ProgressState {
  const adds = state.adds
    .filter((add) => {
      const summary = state.removed.get(add.slug);
      const removedCounter = summary?.get(actorIdKey(add.dot.actorId));
      return removedCounter === undefined || removedCounter < add.dot.counter;
    })
    .map((add) => ({
      slug: add.slug,
      dot: { actorId: add.dot.actorId.slice(), counter: add.dot.counter },
    }))
    .sort((left, right) => {
      const actorOrder = compareBytes(left.dot.actorId, right.dot.actorId);
      if (actorOrder !== 0) return actorOrder;
      const slugOrder = compareStrings(left.slug, right.slug);
      if (slugOrder !== 0) return slugOrder;
      return left.dot.counter < right.dot.counter
        ? -1
        : left.dot.counter > right.dot.counter
          ? 1
          : 0;
    });
  const causalSummary = new Map(
    Array.from(state.causalSummary.entries()).sort(([left], [right]) => compareStrings(left, right))
  );
  const removed = new Map(
    Array.from(state.removed.entries())
      .sort(([left], [right]) => compareStrings(left, right))
      .map(([slug, summary]) => [slug, cloneSummary(summary)] as const)
  );
  return { adds, causalSummary, removed };
}

export function emptyProgressState(): ProgressState {
  return { adds: [], causalSummary: new Map(), removed: new Map() };
}

export function progressHas(state: ProgressState, slug: string): boolean {
  return state.adds.some((add) => add.slug === slug);
}

export function progressSolvedSlugs(state: ProgressState): string[] {
  return Array.from(new Set(state.adds.map((add) => add.slug))).sort(compareStrings);
}

export function addProgress(
  state: ProgressState,
  registry: ProblemRegistry,
  actorIdInput: ActorId | ArrayBuffer,
  counter: bigint,
  slug: string
): ProgressState {
  assertSlug(registry, slug);
  const actorId = actorBytes(actorIdInput);
  assertU64(counter, "Progress counter");
  const next = cloneProgressState(state, registry);
  const actor = actorIdKey(actorId);
  const previous = next.causalSummary.get(actor);
  if (previous === undefined) {
    if (counter !== BigInt(0)) {
      throw new DomainError("the first Progress counter must be zero", "COUNTER_GAP");
    }
  } else if (previous === MAX_UINT64) {
    throw new DomainError("Progress actor counter is exhausted", "COUNTER_EXHAUSTED");
  } else {
    const expected = previous + BigInt(1);
    if (counter < expected) {
      throw new DomainError("Progress counter was already observed", "COUNTER_REUSE");
    }
    if (counter > expected) {
      throw new DomainError("Progress counter has a gap", "COUNTER_GAP");
    }
  }
  next.causalSummary.set(actor, counter);
  next.adds.push({ slug, dot: { actorId, counter } });
  return canonicalProgressState(next);
}

export function removeProgress(
  state: ProgressState,
  registry: ProblemRegistry,
  actorIdInput: ActorId | ArrayBuffer,
  counter: bigint,
  slug: string,
  observedInput?: readonly ProgressDot[]
): ProgressState {
  assertSlug(registry, slug);
  const actorId = actorBytes(actorIdInput);
  assertU64(counter, "Progress counter");
  const next = cloneProgressState(state, registry);
  const actor = actorIdKey(actorId);
  const previous = next.causalSummary.get(actor);
  if (previous === undefined) {
    if (counter !== BigInt(0)) {
      throw new DomainError("the first Progress counter must be zero", "COUNTER_GAP");
    }
  } else if (previous === MAX_UINT64) {
    throw new DomainError("Progress actor counter is exhausted", "COUNTER_EXHAUSTED");
  } else {
    const expected = previous + BigInt(1);
    if (counter < expected) {
      throw new DomainError("Progress counter was already observed", "COUNTER_REUSE");
    }
    if (counter > expected) {
      throw new DomainError("Progress counter has a gap", "COUNTER_GAP");
    }
  }

  const removedForSlug = cloneSummary(next.removed.get(slug) ?? new Map());
  const observed =
    observedInput ?? next.adds.filter((add) => add.slug === slug).map((add) => add.dot);
  for (const dot of observed) {
    const observedActor = actorBytes(dot.actorId);
    assertU64(dot.counter, "observed Progress counter");
    const observedKey = actorIdKey(observedActor);
    maxCounter(removedForSlug, observedKey, dot.counter);
    maxCounter(next.causalSummary, observedKey, dot.counter);
  }
  if (removedForSlug.size > 0) next.removed.set(slug, removedForSlug);
  next.adds = next.adds.filter((add) => add.slug !== slug);
  next.causalSummary.set(actor, counter);
  return canonicalProgressState(next);
}

export function applyProgressMutation(
  state: ProgressState,
  registry: ProblemRegistry,
  mutation: ProgressMutation
): ProgressState {
  if (mutation.kind === "delta") {
    return joinProgress(state, mutation.state, registry);
  }
  if (mutation.kind === "add") {
    return addProgress(state, registry, mutation.actorId, mutation.counter, mutation.slug);
  }
  if (mutation.kind === "remove") {
    return removeProgress(state, registry, mutation.actorId, mutation.counter, mutation.slug);
  }
  throw new DomainError("unknown Progress mutation", "INVALID_OPERATION");
}

export function joinProgress(
  leftInput: ProgressState,
  rightInput: ProgressState,
  registry: ProblemRegistry
): ProgressState {
  validateProblemRegistry(registry);
  const left = cloneProgressState(leftInput, registry);
  const right = cloneProgressState(rightInput, registry);
  const adds = new Map<string, ProgressAdd>();
  for (const add of [...left.adds, ...right.adds]) {
    const key = `${actorIdKey(add.dot.actorId)}:${add.dot.counter.toString()}`;
    const previous = adds.get(key);
    if (previous && previous.slug !== add.slug) {
      throw new DomainError("one Progress dot names multiple slugs", "INVALID_STATE");
    }
    if (!previous) adds.set(key, add);
  }

  const causalSummary = cloneSummary(left.causalSummary);
  for (const [actor, counter] of right.causalSummary) maxCounter(causalSummary, actor, counter);
  const removed = new Map<string, CausalSummary>();
  for (const [slug, summary] of [...left.removed, ...right.removed]) {
    const target = removed.get(slug) ?? new Map<string, bigint>();
    for (const [actor, counter] of summary) maxCounter(target, actor, counter);
    removed.set(slug, target);
  }
  return canonicalProgressState({ adds: Array.from(adds.values()), causalSummary, removed });
}

function cloneNoteRecord(record: ProblemNoteRecord): ProblemNoteRecord {
  return {
    slug: record.slug,
    actorId: actorBytes(record.actorId),
    localRevision: record.localRevision,
    serverRevision: record.serverRevision,
    operation: cloneOperation(record.operation),
  };
}

function cloneNoteState(state: ProblemNoteState, registry?: ProblemRegistry): ProblemNoteState {
  if (!state || !(state.notes instanceof Map) || !(state.highestLocalRevisions instanceof Map)) {
    throw new DomainError("invalid Problem Note state", "INVALID_STATE");
  }
  assertU64(state.serverRevision, "server revision");
  const notes = new Map<string, ProblemNoteRecord>();
  for (const [slug, record] of state.notes) {
    if (!record || typeof slug !== "string" || slug !== record.slug) {
      throw new DomainError("Problem Note key mismatch", "INVALID_STATE");
    }
    if (registry) assertSlug(registry, slug);
    assertU64(record.localRevision, "note local revision");
    assertU64(record.serverRevision, "note server revision");
    if (record.serverRevision > state.serverRevision) {
      throw new DomainError(
        "Problem Note server revision exceeds account revision",
        "INVALID_STATE"
      );
    }
    notes.set(slug, cloneNoteRecord(record));
  }
  const highestLocalRevisions = new Map<string, CausalSummary>();
  for (const [slug, summary] of state.highestLocalRevisions) {
    if (typeof slug !== "string") {
      throw new DomainError("invalid Problem Note revision key", "INVALID_STATE");
    }
    if (registry) assertSlug(registry, slug);
    highestLocalRevisions.set(slug, cloneSummary(summary));
  }
  for (const [slug, record] of notes) {
    const highest = highestLocalRevisions.get(slug)?.get(actorIdKey(record.actorId));
    if (highest === undefined || highest < record.localRevision) {
      throw new DomainError("Problem Note revision summary is incomplete", "INVALID_STATE");
    }
  }
  return {
    serverRevision: state.serverRevision,
    notes: new Map(
      Array.from(notes.entries()).sort(([left], [right]) => compareStrings(left, right))
    ),
    highestLocalRevisions: new Map(
      Array.from(highestLocalRevisions.entries()).sort(([left], [right]) =>
        compareStrings(left, right)
      )
    ),
  };
}

function validateNoteMutation(registry: ProblemRegistry, mutation: ProblemNoteMutation): ActorId {
  assertSlug(registry, mutation.slug);
  const actorId = actorBytes(mutation.actorId);
  assertU64(mutation.localRevision, "note local revision");
  cloneOperation(mutation.operation);
  return actorId;
}

export function emptyProblemNoteState(): ProblemNoteState {
  return { serverRevision: BigInt(0), notes: new Map(), highestLocalRevisions: new Map() };
}

export function validateProblemNoteState(
  state: ProblemNoteState,
  registry: ProblemRegistry
): ProblemNoteState {
  return cloneNoteState(state, registry);
}

export function createProblemNoteMutation(
  registry: ProblemRegistry,
  actorIdInput: ActorId | ArrayBuffer,
  localRevision: bigint,
  slug: string,
  text: string | null
): ProblemNoteMutation {
  assertSlug(registry, slug);
  const actorId = actorBytes(actorIdInput);
  assertU64(localRevision, "note local revision");
  if (text === null || text === "") {
    return { slug, actorId, localRevision, operation: { kind: "delete" } };
  }
  if (typeof text !== "string") {
    throw new DomainError("Problem Note text must be a string or null", "INVALID_OPERATION");
  }
  return {
    slug,
    actorId,
    localRevision,
    operation: { kind: "value", bytes: encodeProblemNoteText(text) },
  };
}

export function createProblemNoteDeleteMutation(
  registry: ProblemRegistry,
  actorId: ActorId | ArrayBuffer,
  localRevision: bigint,
  slug: string
): ProblemNoteMutation {
  return createProblemNoteMutation(registry, actorId, localRevision, slug, null);
}

export function problemNoteText(record: ProblemNoteRecord | undefined): string {
  if (!record || record.operation.kind === "delete") return "";
  return decodeProblemNoteText(record.operation.bytes);
}

function getProblemNote(state: ProblemNoteState, slug: string): ProblemNoteRecord | undefined {
  const record = state.notes.get(slug);
  return record ? cloneNoteRecord(record) : undefined;
}

export type NoteApplyResult = {
  state: ProblemNoteState;
  accepted: boolean;
  current: ProblemNoteRecord | undefined;
};

/** Accept a fresh mutation at the server's next account revision. */
export function acceptProblemNoteMutation(
  state: ProblemNoteState,
  registry: ProblemRegistry,
  mutation: ProblemNoteMutation,
  serverRevision: bigint
): NoteApplyResult {
  const actorId = validateNoteMutation(registry, mutation);
  assertU64(serverRevision, "server revision");
  const currentState = cloneNoteState(state, registry);
  const actor = actorIdKey(actorId);
  const highestForSlug = currentState.highestLocalRevisions.get(mutation.slug) ?? new Map();
  const highest = highestForSlug.get(actor);
  if (highest !== undefined && mutation.localRevision <= highest) {
    const staleState = cloneNoteState(state, registry);
    return {
      state: staleState,
      accepted: false,
      current: getProblemNote(staleState, mutation.slug),
    };
  }
  if (serverRevision <= currentState.serverRevision) {
    throw new DomainError("accepted server revision must advance", "SERVER_REVISION");
  }
  highestForSlug.set(actor, mutation.localRevision);
  currentState.highestLocalRevisions.set(mutation.slug, cloneSummary(highestForSlug));
  currentState.notes.set(mutation.slug, {
    slug: mutation.slug,
    actorId,
    localRevision: mutation.localRevision,
    serverRevision,
    operation: cloneOperation(mutation.operation),
  });
  currentState.serverRevision = serverRevision;
  const canonical = cloneNoteState(currentState, registry);
  return { state: canonical, accepted: true, current: getProblemNote(canonical, mutation.slug) };
}

/** Apply a canonical record delivered out of order to a replica. */
export function applyProblemNoteMutation(
  state: ProblemNoteState,
  registry: ProblemRegistry,
  mutation: ProblemNoteMutation,
  serverRevision: bigint
): NoteApplyResult {
  const actorId = validateNoteMutation(registry, mutation);
  assertU64(serverRevision, "server revision");
  const currentState = cloneNoteState(state, registry);
  const actor = actorIdKey(actorId);
  const highestForSlug = currentState.highestLocalRevisions.get(mutation.slug) ?? new Map();
  const highest = highestForSlug.get(actor);
  if (highest !== undefined && mutation.localRevision <= highest) {
    const staleState = cloneNoteState(state, registry);
    return {
      state: staleState,
      accepted: false,
      current: getProblemNote(staleState, mutation.slug),
    };
  }
  const conflictingRecord = Array.from(currentState.notes.values()).find(
    (record) => record.serverRevision === serverRevision && record.slug !== mutation.slug
  );
  if (conflictingRecord) {
    throw new DomainError("duplicate Problem Note server revision", "SERVER_REVISION");
  }
  highestForSlug.set(actor, mutation.localRevision);
  currentState.highestLocalRevisions.set(mutation.slug, cloneSummary(highestForSlug));
  const currentRecord = currentState.notes.get(mutation.slug);
  if (currentRecord && serverRevision === currentRecord.serverRevision) {
    throw new DomainError("duplicate Problem Note server revision", "SERVER_REVISION");
  }
  if (currentRecord && serverRevision < currentRecord.serverRevision) {
    const canonical = cloneNoteState(currentState, registry);
    return {
      state: canonical,
      accepted: true,
      current: getProblemNote(canonical, mutation.slug),
    };
  }
  const record: ProblemNoteRecord = {
    slug: mutation.slug,
    actorId,
    localRevision: mutation.localRevision,
    serverRevision,
    operation: cloneOperation(mutation.operation),
  };
  currentState.notes.set(mutation.slug, record);
  if (serverRevision > currentState.serverRevision) currentState.serverRevision = serverRevision;
  const canonical = cloneNoteState(currentState, registry);
  return { state: canonical, accepted: true, current: getProblemNote(canonical, mutation.slug) };
}
