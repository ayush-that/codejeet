import { MAX_UINT64 } from "./codec";

type FailureCategory = "protocol" | "authentication" | "domain" | "persistence" | "transport";

type ProtocolFailureCode =
  | "unsupported_protocol"
  | "malformed_frame"
  | "truncated_frame"
  | "checksum_invalid"
  | "frame_too_large"
  | "batch_too_large"
  | "vector_too_large"
  | "unknown_server_state";

type AuthenticationFailureCode =
  | "authentication_required"
  | "authentication_expired"
  | "authentication_invalid"
  | "wrong_origin"
  | "account_deleted";

type DomainFailureCode =
  | "invalid_actor"
  | "invalid_dot"
  | "unsafe_counter"
  | "unknown_slug"
  | "oversized_note"
  | "invalid_note"
  | "actor_limit"
  | "rejected_item"
  | "session_incompatible";

type PersistenceFailureCode =
  | "d1_unavailable"
  | "d1_transaction_failed"
  | "schema_unavailable"
  | "canonical_corrupt";

type TransportFailureCode =
  | "transport_timeout"
  | "transport_disconnected"
  | "bootstrap_overflow"
  | "stream_invalid"
  | "abusive_connection";

export type FailureCode =
  | ProtocolFailureCode
  | AuthenticationFailureCode
  | DomainFailureCode
  | PersistenceFailureCode
  | TransportFailureCode;

type FailureDisposition = "permanent" | "transient" | "confirmed_deletion";
type RetryAction = "stop" | "backoff" | "restart_bootstrap" | "clear_account";
type ConnectionAction = "none" | "retry" | "restart_bootstrap" | "close";
type RecoveryAction =
  | "preserve_all"
  | "replace_invalid_record"
  | "restart_bootstrap"
  | "clear_account";

export type FailurePolicy = Readonly<{
  category: FailureCategory;
  disposition: FailureDisposition;
  retry: RetryAction;
  connection: ConnectionAction;
  recovery: RecoveryAction;
  preserveAccountData: boolean;
  forbidPartialApply: boolean;
}>;

export type SyncFailure = Readonly<{
  code: FailureCode;
  policy: FailurePolicy;
  itemIndex?: number;
}>;

const permanentRecord: FailurePolicy = {
  category: "domain",
  disposition: "permanent",
  retry: "stop",
  connection: "none",
  recovery: "replace_invalid_record",
  preserveAccountData: true,
  forbidPartialApply: true,
};

const permanentProtocol: FailurePolicy = {
  ...permanentRecord,
  category: "protocol",
  recovery: "preserve_all",
};

const permanentAuthentication: FailurePolicy = {
  ...permanentRecord,
  category: "authentication",
  recovery: "preserve_all",
};

const transientPersistence: FailurePolicy = {
  category: "persistence",
  disposition: "transient",
  retry: "backoff",
  connection: "retry",
  recovery: "preserve_all",
  preserveAccountData: true,
  forbidPartialApply: true,
};

const transientAuthentication: FailurePolicy = {
  category: "authentication",
  disposition: "transient",
  retry: "backoff",
  connection: "retry",
  recovery: "preserve_all",
  preserveAccountData: true,
  forbidPartialApply: true,
};

const restartBootstrap: FailurePolicy = {
  category: "transport",
  disposition: "transient",
  retry: "restart_bootstrap",
  connection: "restart_bootstrap",
  recovery: "restart_bootstrap",
  preserveAccountData: true,
  forbidPartialApply: true,
};

const confirmedDeletion: FailurePolicy = {
  category: "authentication",
  disposition: "confirmed_deletion",
  retry: "clear_account",
  connection: "close",
  recovery: "clear_account",
  preserveAccountData: false,
  forbidPartialApply: true,
};

const abusiveConnection: FailurePolicy = {
  category: "transport",
  disposition: "permanent",
  retry: "stop",
  connection: "close",
  recovery: "preserve_all",
  preserveAccountData: true,
  forbidPartialApply: true,
};

/** The complete policy table is intentionally exhaustive over machine failure codes. */
export const FAILURE_POLICIES: Readonly<Record<FailureCode, FailurePolicy>> = {
  unsupported_protocol: permanentProtocol,
  malformed_frame: permanentProtocol,
  truncated_frame: permanentProtocol,
  checksum_invalid: permanentProtocol,
  frame_too_large: permanentProtocol,
  batch_too_large: permanentProtocol,
  vector_too_large: permanentProtocol,
  unknown_server_state: permanentProtocol,

  authentication_required: permanentAuthentication,
  authentication_expired: transientAuthentication,
  authentication_invalid: permanentAuthentication,
  wrong_origin: permanentAuthentication,
  account_deleted: confirmedDeletion,

  invalid_actor: permanentRecord,
  invalid_dot: permanentRecord,
  unsafe_counter: permanentRecord,
  unknown_slug: permanentRecord,
  oversized_note: permanentRecord,
  invalid_note: permanentRecord,
  actor_limit: permanentRecord,
  rejected_item: permanentRecord,
  session_incompatible: {
    ...restartBootstrap,
    category: "domain",
  },

  d1_unavailable: transientPersistence,
  d1_transaction_failed: transientPersistence,
  schema_unavailable: {
    ...permanentRecord,
    category: "persistence",
    recovery: "preserve_all",
  },
  canonical_corrupt: {
    ...permanentRecord,
    category: "persistence",
    recovery: "preserve_all",
  },

  transport_timeout: {
    ...transientAuthentication,
    category: "transport",
  },
  transport_disconnected: {
    ...transientAuthentication,
    category: "transport",
  },
  bootstrap_overflow: restartBootstrap,
  stream_invalid: permanentProtocol,
  abusive_connection: abusiveConnection,
};

export function classifyFailure(code: FailureCode, itemIndex?: number): SyncFailure {
  if (!Object.prototype.hasOwnProperty.call(FAILURE_POLICIES, code)) {
    throw new RangeError("unknown synchronization failure code");
  }
  const policy = FAILURE_POLICIES[code];
  if (itemIndex !== undefined && (!Number.isSafeInteger(itemIndex) || itemIndex < 0)) {
    throw new RangeError("failure item index must be a non-negative safe integer");
  }
  return itemIndex === undefined ? { code, policy } : { code, policy, itemIndex };
}

export function preservesAccountData(failure: SyncFailure): boolean {
  return failure.policy.preserveAccountData;
}

export function mayClearAccountData(failure: SyncFailure): boolean {
  return failure.policy.disposition === "confirmed_deletion";
}

export function retryDelayMs(failure: SyncFailure, attempt: number): number | null {
  if (failure.policy.retry !== "backoff") return null;
  if (!Number.isSafeInteger(attempt) || attempt < 0) {
    throw new RangeError("retry attempt must be a non-negative safe integer");
  }
  const exponent = Math.min(attempt, 10);
  return Math.min(30_000, 250 * 2 ** exponent);
}

const DIAGNOSTIC_EVENTS = [
  "request_rejected",
  "mutation_accepted",
  "persistence_failed",
  "bootstrap_restarted",
  "connection_closed",
] as const;

export type DiagnosticEventCode = (typeof DIAGNOSTIC_EVENTS)[number];

export type DiagnosticInput = Readonly<{
  eventCode: DiagnosticEventCode;
  failureCode?: FailureCode;
  protocolVersion?: number;
  messageType?: number;
  byteCount?: number;
  itemCount?: number;
  itemIndex?: number;
  retryClass?: FailureDisposition;
  serverRevision?: bigint;
  accountId?: string;
  actorId?: Uint8Array | ArrayBuffer;
}>;

export type RedactedDiagnostic = Readonly<{
  eventCode: DiagnosticEventCode;
  failureCode?: FailureCode;
  failureCategory?: FailureCategory;
  protocolVersion?: number;
  messageType?: number;
  byteCount?: number;
  itemCount?: number;
  itemIndex?: number;
  retryClass?: FailureDisposition;
  serverRevision?: string;
  accountHash?: string;
  actorHash?: string;
}>;

const UTF8 = new TextEncoder();
const CORRELATION_HASH_HEX_LENGTH = 16;
const MAX_DIAGNOSTIC_NUMBER = 1_000_000;

function boundedNumber(value: number | undefined): number | undefined {
  return value !== undefined &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= MAX_DIAGNOSTIC_NUMBER
    ? value
    : undefined;
}

function boundedByte(value: number | undefined): number | undefined {
  return value !== undefined && Number.isInteger(value) && value >= 0 && value <= 255
    ? value
    : undefined;
}

function bytes(value: Uint8Array | ArrayBuffer): Uint8Array {
  return value instanceof Uint8Array ? value.slice() : new Uint8Array(value).slice();
}

async function correlationHash(domain: string, value: string | Uint8Array): Promise<string> {
  const source = typeof value === "string" ? UTF8.encode(value) : value;
  const input = new Uint8Array(
    UTF8.encode(`codejeet-diagnostic/${domain}\0`).length + source.length
  );
  const prefix = UTF8.encode(`codejeet-diagnostic/${domain}\0`);
  input.set(prefix);
  input.set(source, prefix.length);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", input));
  return Array.from(digest.slice(0, CORRELATION_HASH_HEX_LENGTH / 2), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

/**
 * Build an allowlisted diagnostic. Raw account and Actor identifiers are only
 * accepted to derive short correlation hashes; all other input is discarded.
 */
export async function createDiagnostic(input: DiagnosticInput): Promise<RedactedDiagnostic> {
  const diagnostic: {
    eventCode: DiagnosticEventCode;
    failureCode?: FailureCode;
    failureCategory?: FailureCategory;
    protocolVersion?: number;
    messageType?: number;
    byteCount?: number;
    itemCount?: number;
    itemIndex?: number;
    retryClass?: FailureDisposition;
    serverRevision?: string;
    accountHash?: string;
    actorHash?: string;
  } = {
    eventCode: DIAGNOSTIC_EVENTS.includes(input.eventCode) ? input.eventCode : "request_rejected",
  };

  if (
    input.failureCode !== undefined &&
    Object.prototype.hasOwnProperty.call(FAILURE_POLICIES, input.failureCode)
  ) {
    diagnostic.failureCode = input.failureCode;
    diagnostic.failureCategory = FAILURE_POLICIES[input.failureCode].category;
    diagnostic.retryClass = FAILURE_POLICIES[input.failureCode].disposition;
  } else if (
    input.retryClass === "permanent" ||
    input.retryClass === "transient" ||
    input.retryClass === "confirmed_deletion"
  ) {
    diagnostic.retryClass = input.retryClass;
  }
  const protocolVersion = boundedByte(input.protocolVersion);
  if (protocolVersion !== undefined) diagnostic.protocolVersion = protocolVersion;
  const messageType = boundedByte(input.messageType);
  if (messageType !== undefined) diagnostic.messageType = messageType;
  const byteCount = boundedNumber(input.byteCount);
  if (byteCount !== undefined) diagnostic.byteCount = byteCount;
  const itemCount = boundedNumber(input.itemCount);
  if (itemCount !== undefined) diagnostic.itemCount = itemCount;
  const itemIndex = boundedNumber(input.itemIndex);
  if (itemIndex !== undefined) diagnostic.itemIndex = itemIndex;
  if (
    input.serverRevision !== undefined &&
    input.serverRevision >= BigInt(0) &&
    input.serverRevision <= MAX_UINT64
  ) {
    diagnostic.serverRevision = input.serverRevision.toString(10);
  }
  if (input.accountId !== undefined)
    diagnostic.accountHash = await correlationHash("account", input.accountId);
  if (input.actorId !== undefined)
    diagnostic.actorHash = await correlationHash("actor", bytes(input.actorId));
  return diagnostic;
}
