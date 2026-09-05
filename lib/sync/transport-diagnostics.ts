import { CodecError, RejectionCode } from "./codec";
import { DomainError } from "./domain";
import { PersistenceError } from "./account-data";
import {
  classifyFailure,
  createDiagnostic,
  type DiagnosticEventCode,
  type DiagnosticInput,
  type FailureCode,
} from "./failure-policy";

/** Convert internal failures to the stable machine-level synchronization policy. */
function classifyTransportFailure(error: unknown): FailureCode {
  if (error instanceof CodecError) {
    switch (error.code) {
      case "UNSUPPORTED_VERSION":
        return "unsupported_protocol";
      case "OVERSIZED":
        return "frame_too_large";
      case "TRUNCATED":
        return "truncated_frame";
      case "CHECKSUM_MISMATCH":
        return "checksum_invalid";
      case "INVALID_VALUE":
      case "INVALID_UTF8":
        return "rejected_item";
      default:
        return "malformed_frame";
    }
  }
  if (error instanceof DomainError) {
    switch (error.code) {
      case "INVALID_ACTOR":
        return "invalid_actor";
      case "INVALID_COUNTER":
      case "COUNTER_REUSE":
      case "COUNTER_GAP":
      case "COUNTER_EXHAUSTED":
        return "invalid_dot";
      case "INVALID_SLUG":
        return "unknown_slug";
      case "INVALID_OPERATION":
        return "invalid_note";
      case "SERVER_REVISION":
      case "INVALID_STATE":
        return "rejected_item";
    }
  }
  if (error instanceof PersistenceError) {
    const message = error.message;
    if (message === "Account has been deleted") return "account_deleted";
    if (message.includes("bootstrap") || message.includes("snapshot")) {
      return "session_incompatible";
    }
    if (message.includes("Actor limit") || message.includes("reserved legacy Actor")) {
      return "actor_limit";
    }
    if (message.includes("Problem Registry slug")) return "unknown_slug";
    if (message.includes("Problem Note")) return "invalid_note";
    return "canonical_corrupt";
  }
  if (error instanceof Error) {
    if (error.message === "Durable Object account route mismatch") {
      return "authentication_invalid";
    }
    if (error.message === "sync route secret is unavailable") {
      return "authentication_invalid";
    }
  }
  return "d1_transaction_failed";
}

export function rejectionForFailure(code: FailureCode): RejectionCode {
  switch (code) {
    case "unsupported_protocol":
      return RejectionCode.UNSUPPORTED_PROTOCOL;
    case "frame_too_large":
      return RejectionCode.TOO_LARGE;
    case "batch_too_large":
    case "vector_too_large":
      return RejectionCode.INVALID_BATCH;
    case "authentication_required":
    case "authentication_expired":
    case "authentication_invalid":
    case "wrong_origin":
      return RejectionCode.AUTHENTICATION_REQUIRED;
    case "account_deleted":
      return RejectionCode.ACCOUNT_DELETED;
    case "d1_unavailable":
    case "d1_transaction_failed":
    case "transport_timeout":
    case "transport_disconnected":
    case "bootstrap_overflow":
    case "session_incompatible":
      return RejectionCode.TRANSIENT_FAILURE;
    case "malformed_frame":
    case "truncated_frame":
    case "checksum_invalid":
    case "stream_invalid":
    case "abusive_connection":
      return RejectionCode.INVALID_FRAME;
    default:
      return RejectionCode.INVALID_RECORD;
  }
}

export function failureForRejection(code: RejectionCode): FailureCode {
  switch (code) {
    case RejectionCode.INVALID_FRAME:
      return "malformed_frame";
    case RejectionCode.INVALID_BATCH:
      return "batch_too_large";
    case RejectionCode.INVALID_RECORD:
      return "rejected_item";
    case RejectionCode.UNSUPPORTED_PROTOCOL:
      return "unsupported_protocol";
    case RejectionCode.AUTHENTICATION_REQUIRED:
      return "authentication_required";
    case RejectionCode.TOO_LARGE:
      return "frame_too_large";
    case RejectionCode.ACCOUNT_DELETED:
      return "account_deleted";
    case RejectionCode.TRANSIENT_FAILURE:
      return "d1_transaction_failed";
  }
}

export async function recordTransportDiagnostic(
  input: DiagnosticInput & { eventCode: DiagnosticEventCode }
): Promise<void> {
  try {
    const diagnostic = await createDiagnostic(input);
    console.warn(JSON.stringify(diagnostic));
  } catch {
    // Diagnostics must never turn a protocol failure into a transport failure.
  }
}

export function transportFailure(error: unknown, itemIndex?: number) {
  return classifyFailure(classifyTransportFailure(error), itemIndex);
}
