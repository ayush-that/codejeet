/**
 * Version-one wire codec for synchronization messages.
 *
 * Mutation and delta batches remain opaque to the framing layer. Shared
 * canonical domain-record encodings live here so browser and Worker storage
 * and snapshot code use the same bytes.
 */

const PROTOCOL_MAGIC = "CJET";
const PROTOCOL_VERSION = 1;
export const MAX_FRAME_BYTES = 64 * 1024;
export const MAX_BATCH_CHANGES = 100;
/** Maximum number of frames in one bootstrap upload, separate from changes/frame. */
export const MAX_PENDING_BATCHES = 4096;
const MAX_NOTE_UTF16_CODE_UNITS = 2_000;
const MAX_NOTE_UTF8_BYTES = 8 * 1024;

const BIGINT_ZERO = BigInt(0);
const BIGINT_ONE = BigInt(1);
const BIGINT_SEVEN = BigInt(7);
const BIGINT_64 = BigInt(64);
const BIGINT_7F = BigInt(0x7f);
export const MAX_UINT64 = (BIGINT_ONE << BIGINT_64) - BIGINT_ONE;

const MAGIC_BYTES = new TextEncoder().encode(PROTOCOL_MAGIC);
const FRAME_OVERHEAD_WITH_ONE_BYTE_LENGTH = MAGIC_BYTES.length + 1 + 1 + 1 + 4;
const MAX_COUNT = 0xffff_ffff;

export enum MessageType {
  HELLO = 1,
  MUTATION_BATCH = 2,
  ACKNOWLEDGEMENT = 3,
  SNAPSHOT_BEGIN = 4,
  SNAPSHOT_CHUNK = 5,
  SNAPSHOT_END = 6,
  DELTA_BATCH = 7,
  REJECTION = 8,
  SNAPSHOT_CONFIRM = 9,
}

export enum RejectionCode {
  INVALID_FRAME = 1,
  INVALID_BATCH = 2,
  INVALID_RECORD = 3,
  UNSUPPORTED_PROTOCOL = 4,
  AUTHENTICATION_REQUIRED = 5,
  TOO_LARGE = 6,
  TRANSIENT_FAILURE = 7,
  ACCOUNT_DELETED = 8,
}

export type Hello = {
  actorId: Uint8Array | ArrayBuffer;
  revocationHandleHash: Uint8Array | ArrayBuffer;
  lastServerRevision: bigint;
  causalSummary: readonly {
    actorId: Uint8Array | ArrayBuffer;
    counter: bigint;
  }[];
  /** Client-owned bootstrap nonce and number of pending batches to upload. */
  bootstrapId?: Uint8Array | ArrayBuffer;
  pendingBatchCount?: number;
};

const HELLO_ACTOR_BYTES = 16;
const HELLO_HASH_BYTES = 32;
const HELLO_MAX_CAUSAL_ENTRIES = 64;

export type Frame = {
  version: typeof PROTOCOL_VERSION;
  type: MessageType;
  payload: Uint8Array;
};

export class CodecError extends Error {
  constructor(
    message: string,
    readonly code:
      | "INVALID_TYPE"
      | "INVALID_VALUE"
      | "INVALID_LENGTH"
      | "TRUNCATED"
      | "TRAILING_BYTES"
      | "UNSUPPORTED_VERSION"
      | "CHECKSUM_MISMATCH"
      | "OVERSIZED"
      | "INVALID_UTF8"
  ) {
    super(message);
    this.name = "CodecError";
  }
}

function bytes(value: Uint8Array | ArrayBuffer): Uint8Array {
  return value instanceof Uint8Array ? value : new Uint8Array(value);
}

function copyBytes(value: Uint8Array | ArrayBuffer): Uint8Array {
  return bytes(value).slice();
}

function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  return left.length === right.length && left.every((byte, index) => byte === right[index]);
}

function concatBytes(...parts: readonly Uint8Array[]): Uint8Array {
  const total = parts.reduce((length, part) => length + part.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

function assertUnsigned64(value: bigint, label: string): void {
  if (typeof value !== "bigint" || value < BIGINT_ZERO || value > MAX_UINT64) {
    throw new CodecError(`${label} must be an unsigned 64-bit integer`, "INVALID_VALUE");
  }
}

function assertCount(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0 || value > MAX_COUNT) {
    throw new CodecError(`${label} is outside its supported range`, "INVALID_VALUE");
  }
}

function assertMessageType(value: number): asserts value is MessageType {
  if (
    !Number.isInteger(value) ||
    value < MessageType.HELLO ||
    value > MessageType.SNAPSHOT_CONFIRM
  ) {
    throw new CodecError(`unknown message type ${value}`, "INVALID_TYPE");
  }
}

function assertRejectionCode(value: number): asserts value is RejectionCode {
  if (
    !Number.isInteger(value) ||
    value < RejectionCode.INVALID_FRAME ||
    value > RejectionCode.ACCOUNT_DELETED
  ) {
    throw new CodecError(`unknown rejection code ${value}`, "INVALID_VALUE");
  }
}

/** Encode a canonical unsigned LEB128 unsigned-64-bit integer. */
export function encodeUnsignedLeb128(value: bigint): Uint8Array {
  assertUnsigned64(value, "value");
  const output: number[] = [];
  let remaining = value;
  do {
    const group = Number(remaining & BIGINT_7F);
    remaining >>= BIGINT_SEVEN;
    output.push(remaining === BIGINT_ZERO ? group : group | 0x80);
  } while (remaining !== BIGINT_ZERO);
  return Uint8Array.from(output);
}

/** Decode one canonical unsigned LEB128 integer without accepting overlong input. */
export function decodeUnsignedLeb128(
  input: Uint8Array | ArrayBuffer,
  offset = 0
): { value: bigint; offset: number } {
  const source = bytes(input);
  if (!Number.isInteger(offset) || offset < 0 || offset >= source.length) {
    throw new CodecError("missing unsigned LEB128 value", "TRUNCATED");
  }

  let value = BIGINT_ZERO;
  let shift = BIGINT_ZERO;
  let position = offset;
  for (let index = 0; index < 10; index++) {
    if (position >= source.length) {
      throw new CodecError("truncated unsigned LEB128 value", "TRUNCATED");
    }
    const byte = source[position++];
    const group = BigInt(byte & 0x7f);
    if (index === 9 && (byte & 0x7e) !== 0) {
      throw new CodecError("unsigned LEB128 value overflows 64 bits", "INVALID_VALUE");
    }
    value |= group << shift;
    if ((byte & 0x80) === 0) {
      const encoded = encodeUnsignedLeb128(value);
      if (encoded.length !== position - offset) {
        throw new CodecError("non-canonical unsigned LEB128 value", "INVALID_VALUE");
      }
      return { value, offset: position };
    }
    shift += BIGINT_SEVEN;
  }
  throw new CodecError("unsigned LEB128 value is too long", "INVALID_VALUE");
}

function asSafeNumber(value: bigint, label: string): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new CodecError(`${label} is not safely representable`, "INVALID_VALUE");
  }
  return Number(value);
}

function readLeb(source: Uint8Array, state: { offset: number }, label: string): bigint {
  const result = decodeUnsignedLeb128(source, state.offset);
  state.offset = result.offset;
  if (result.value < BIGINT_ZERO) throw new CodecError(`${label} is negative`, "INVALID_VALUE");
  return result.value;
}

function requireNoTrailingBytes(source: Uint8Array, offset: number): void {
  if (offset !== source.length) {
    throw new CodecError("trailing bytes after payload", "TRAILING_BYTES");
  }
}

let crcTable: Uint32Array | undefined;

function getCrcTable(): Uint32Array {
  if (crcTable) return crcTable;
  const table = new Uint32Array(256);
  for (let index = 0; index < table.length; index++) {
    let value = index;
    for (let bit = 0; bit < 8; bit++) {
      value = (value & 1) === 0 ? value >>> 1 : (value >>> 1) ^ 0x82f63b78;
    }
    table[index] = value >>> 0;
  }
  crcTable = table;
  return table;
}

/** Incrementally compute CRC32C (Castagnoli), using the protocol's reflected form. */
export class Crc32cAccumulator {
  private crc = 0xffffffff;

  update(chunkValue: Uint8Array | ArrayBuffer): this {
    const chunk = bytes(chunkValue);
    const table = getCrcTable();
    for (const byte of chunk) {
      this.crc = (this.crc >>> 8) ^ table[(this.crc ^ byte) & 0xff];
    }
    return this;
  }

  digest(): number {
    return (this.crc ^ 0xffffffff) >>> 0;
  }
}

/** Compute CRC32C for a sequence of chunks. */
export function crc32c(chunks: Iterable<Uint8Array | ArrayBuffer>): number {
  const accumulator = new Crc32cAccumulator();
  for (const chunkValue of chunks) {
    accumulator.update(chunkValue);
  }
  return accumulator.digest();
}

export function crc32cBytes(input: Uint8Array | ArrayBuffer): number {
  return crc32c([input]);
}

function writeUint32Be(value: number): Uint8Array {
  if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) {
    throw new CodecError("value is not an unsigned 32-bit integer", "INVALID_VALUE");
  }
  return Uint8Array.from([
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ]);
}

function readUint32Be(source: Uint8Array, offset: number): number {
  return (
    (source[offset] * 0x1000000 +
      source[offset + 1] * 0x10000 +
      source[offset + 2] * 0x100 +
      source[offset + 3]) >>>
    0
  );
}

/** Encode one complete version-one frame. */
export function encodeFrame(type: MessageType, payload: Uint8Array | ArrayBuffer): Uint8Array {
  assertMessageType(type);
  const payloadBytes = copyBytes(payload);
  const length = encodeUnsignedLeb128(BigInt(payloadBytes.length));
  const body = concatBytes(
    MAGIC_BYTES,
    Uint8Array.of(PROTOCOL_VERSION, type),
    length,
    payloadBytes
  );
  const frame = concatBytes(body, writeUint32Be(crc32cBytes(body)));
  if (frame.length > MAX_FRAME_BYTES) {
    throw new CodecError("frame exceeds the 64 KiB envelope limit", "OVERSIZED");
  }
  return frame;
}

/** Decode and structurally validate one complete frame. CRC is checked before payload parsing. */
export function decodeFrame(input: Uint8Array | ArrayBuffer): Frame {
  const source = bytes(input);
  if (source.length > MAX_FRAME_BYTES) {
    throw new CodecError("frame exceeds the 64 KiB envelope limit", "OVERSIZED");
  }
  if (source.length < FRAME_OVERHEAD_WITH_ONE_BYTE_LENGTH) {
    throw new CodecError("truncated frame envelope", "TRUNCATED");
  }
  for (let index = 0; index < MAGIC_BYTES.length; index++) {
    if (source[index] !== MAGIC_BYTES[index]) {
      throw new CodecError("invalid frame magic", "INVALID_VALUE");
    }
  }
  if (source[4] !== PROTOCOL_VERSION) {
    throw new CodecError(`unsupported protocol version ${source[4]}`, "UNSUPPORTED_VERSION");
  }
  const type = source[5];
  assertMessageType(type);
  const lengthResult = decodeUnsignedLeb128(source, 6);
  const payloadLength = asSafeNumber(lengthResult.value, "payload length");
  const payloadStart = lengthResult.offset;
  const payloadEnd = payloadStart + payloadLength;
  const crcOffset = payloadEnd;
  if (payloadEnd > source.length - 4) {
    throw new CodecError("frame payload is truncated", "TRUNCATED");
  }
  if (crcOffset + 4 !== source.length) {
    throw new CodecError("frame length does not match its envelope", "INVALID_LENGTH");
  }
  const expectedCrc = readUint32Be(source, crcOffset);
  const actualCrc = crc32cBytes(source.subarray(0, crcOffset));
  if (actualCrc !== expectedCrc) {
    throw new CodecError("frame CRC32C mismatch", "CHECKSUM_MISMATCH");
  }
  return { version: PROTOCOL_VERSION, type, payload: source.slice(payloadStart, payloadEnd) };
}

function helloActor(value: Uint8Array | ArrayBuffer, label: string): Uint8Array {
  const result = copyBytes(value);
  if (result.length !== HELLO_ACTOR_BYTES)
    throw new CodecError(`${label} must be 16 bytes`, "INVALID_VALUE");
  return result;
}

function helloHash(value: Uint8Array | ArrayBuffer): Uint8Array {
  const result = copyBytes(value);
  if (result.length !== HELLO_HASH_BYTES)
    throw new CodecError("Revocation Handle hash must be 32 bytes", "INVALID_VALUE");
  return result;
}

function compareHelloActors(left: Uint8Array, right: Uint8Array): number {
  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

export function encodeHello(value: Hello): Uint8Array {
  assertUnsigned64(value.lastServerRevision, "last server revision");
  if (value.causalSummary.length > HELLO_MAX_CAUSAL_ENTRIES)
    throw new CodecError("too many HELLO causal entries", "OVERSIZED");
  const actorId = helloActor(value.actorId, "HELLO Actor ID");
  const hash = helloHash(value.revocationHandleHash);
  const summary = value.causalSummary.map((entry) => ({
    actorId: helloActor(entry.actorId, "HELLO causal Actor ID"),
    counter: entry.counter,
  }));
  for (const entry of summary) assertUnsigned64(entry.counter, "HELLO causal counter");
  summary.sort((left, right) => compareHelloActors(left.actorId, right.actorId));
  for (let index = 1; index < summary.length; index++) {
    if (compareHelloActors(summary[index - 1].actorId, summary[index].actorId) === 0)
      throw new CodecError("duplicate HELLO causal Actor", "INVALID_VALUE");
  }
  const parts: Uint8Array[] = [
    actorId,
    hash,
    encodeUnsignedLeb128(value.lastServerRevision),
    encodeUnsignedLeb128(BigInt(summary.length)),
  ];
  for (const entry of summary) parts.push(entry.actorId, encodeUnsignedLeb128(entry.counter));
  if (value.bootstrapId !== undefined || value.pendingBatchCount !== undefined) {
    if (value.bootstrapId === undefined)
      throw new CodecError("HELLO bootstrap ID is required", "INVALID_VALUE");
    const bootstrapId = helloActor(value.bootstrapId, "HELLO bootstrap ID");
    const pendingBatchCount = value.pendingBatchCount ?? 0;
    assertCount(pendingBatchCount, "HELLO pending batch count");
    if (pendingBatchCount > MAX_PENDING_BATCHES)
      throw new CodecError("too many HELLO pending batches", "OVERSIZED");
    parts.push(bootstrapId, encodeUnsignedLeb128(BigInt(pendingBatchCount)));
  }
  return concatBytes(...parts);
}

export function encodeHelloFrame(value: Hello): Uint8Array {
  return encodeFrame(MessageType.HELLO, encodeHello(value));
}

function decodeHello(input: Uint8Array | ArrayBuffer): Hello {
  const source = copyBytes(input);
  const state = { offset: 0 };
  if (source.length - state.offset < HELLO_ACTOR_BYTES + HELLO_HASH_BYTES)
    throw new CodecError("truncated HELLO identity", "TRUNCATED");
  const actorId = source.slice(state.offset, state.offset + HELLO_ACTOR_BYTES);
  state.offset += HELLO_ACTOR_BYTES;
  const revocationHandleHash = source.slice(state.offset, state.offset + HELLO_HASH_BYTES);
  state.offset += HELLO_HASH_BYTES;
  const lastServerRevision = readLeb(source, state, "last server revision");
  const count = asSafeNumber(readLeb(source, state, "HELLO causal count"), "HELLO causal count");
  if (count > HELLO_MAX_CAUSAL_ENTRIES)
    throw new CodecError("too many HELLO causal entries", "OVERSIZED");
  const causalSummary: { actorId: Uint8Array; counter: bigint }[] = [];
  for (let index = 0; index < count; index++) {
    if (source.length - state.offset < HELLO_ACTOR_BYTES)
      throw new CodecError("truncated HELLO causal Actor ID", "TRUNCATED");
    const causalActorId = source.slice(state.offset, state.offset + HELLO_ACTOR_BYTES);
    state.offset += HELLO_ACTOR_BYTES;
    causalSummary.push({
      actorId: causalActorId,
      counter: readLeb(source, state, "HELLO causal counter"),
    });
  }
  let bootstrapId: Uint8Array | undefined;
  let pendingBatchCount: number | undefined;
  if (state.offset < source.length) {
    if (source.length - state.offset < HELLO_ACTOR_BYTES)
      throw new CodecError("truncated HELLO bootstrap ID", "TRUNCATED");
    bootstrapId = source.slice(state.offset, state.offset + HELLO_ACTOR_BYTES);
    state.offset += HELLO_ACTOR_BYTES;
    pendingBatchCount = asSafeNumber(
      readLeb(source, state, "HELLO pending batch count"),
      "HELLO pending batch count"
    );
    if (pendingBatchCount > MAX_PENDING_BATCHES)
      throw new CodecError("too many HELLO pending batches", "OVERSIZED");
  }
  requireNoTrailingBytes(source, state.offset);
  const result = {
    actorId,
    revocationHandleHash,
    lastServerRevision,
    causalSummary,
    ...(bootstrapId === undefined ? {} : { bootstrapId, pendingBatchCount }),
  };
  if (!sameBytes(encodeHello(result), source))
    throw new CodecError("HELLO is not canonically encoded", "INVALID_VALUE");
  return result;
}

export function decodeHelloFrame(frame: Uint8Array | ArrayBuffer): Hello {
  const decoded = decodeFrame(frame);
  if (decoded.type !== MessageType.HELLO)
    throw new CodecError("frame is not a HELLO message", "INVALID_TYPE");
  return decodeHello(decoded.payload);
}

/** Strict version-one HELLO decoder. The unextended form is retained only for
 * compatibility helpers and is not accepted by authenticated sync endpoints. */
export function decodeStrictHello(input: Uint8Array | ArrayBuffer): Hello {
  const result = decodeHello(input);
  if (result.bootstrapId === undefined || result.pendingBatchCount === undefined)
    throw new CodecError("HELLO bootstrap metadata is required", "INVALID_VALUE");
  return result;
}

function encodeCountedBytes(
  values: readonly (Uint8Array | ArrayBuffer)[],
  maxCount?: number
): Uint8Array {
  if (maxCount !== undefined && values.length > maxCount) {
    throw new CodecError(`too many entries: ${values.length}`, "OVERSIZED");
  }
  assertCount(values.length, "entry count");
  const parts: Uint8Array[] = [encodeUnsignedLeb128(BigInt(values.length))];
  for (const value of values) {
    const item = copyBytes(value);
    parts.push(encodeUnsignedLeb128(BigInt(item.length)), item);
  }
  return concatBytes(...parts);
}

function decodeCountedBytes(source: Uint8Array, maxCount?: number): Uint8Array[] {
  const state = { offset: 0 };
  const count = asSafeNumber(readLeb(source, state, "entry count"), "entry count");
  if (maxCount !== undefined && count > maxCount) {
    throw new CodecError(`too many entries: ${count}`, "OVERSIZED");
  }
  assertCount(count, "entry count");
  const values: Uint8Array[] = [];
  for (let index = 0; index < count; index++) {
    const length = asSafeNumber(readLeb(source, state, "entry length"), "entry length");
    if (length > source.length - state.offset) {
      throw new CodecError("truncated counted entry", "TRUNCATED");
    }
    values.push(source.slice(state.offset, state.offset + length));
    state.offset += length;
  }
  requireNoTrailingBytes(source, state.offset);
  return values;
}

/** Encode an opaque mutation or delta batch. Domain semantics are intentionally not parsed here. */
export function encodeBatch(changes: readonly (Uint8Array | ArrayBuffer)[]): Uint8Array {
  return encodeCountedBytes(changes, MAX_BATCH_CHANGES);
}

export function decodeBatch(input: Uint8Array | ArrayBuffer): Uint8Array[] {
  return decodeCountedBytes(bytes(input), MAX_BATCH_CHANGES);
}

export function encodeBatchFrame(
  type: MessageType.MUTATION_BATCH | MessageType.DELTA_BATCH,
  changes: readonly (Uint8Array | ArrayBuffer)[]
): Uint8Array {
  if (type === MessageType.DELTA_BATCH)
    throw new CodecError("DELTA_BATCH requires server revisions", "INVALID_VALUE");
  return encodeFrame(type, encodeBatch(changes));
}

export function decodeBatchFrame(frame: Uint8Array | ArrayBuffer): {
  type: MessageType.MUTATION_BATCH | MessageType.DELTA_BATCH;
  changes: Uint8Array[];
} {
  const decoded = decodeFrame(frame);
  if (decoded.type !== MessageType.MUTATION_BATCH && decoded.type !== MessageType.DELTA_BATCH) {
    throw new CodecError("frame is not a batch message", "INVALID_TYPE");
  }
  if (decoded.type === MessageType.DELTA_BATCH)
    return {
      type: decoded.type,
      changes: decodeRevisionedDeltaBatchFrame(frame).changes.map((change) => bytes(change.record)),
    };
  return { type: decoded.type, changes: decodeBatch(decoded.payload) };
}

export type MutationBatchEnvelope = {
  requestId: Uint8Array | ArrayBuffer;
  bootstrapId: Uint8Array | ArrayBuffer;
  batchIndex: number;
  batchCount: number;
  changes: readonly (Uint8Array | ArrayBuffer)[];
};

function fixedEnvelopeId(value: Uint8Array | ArrayBuffer, label: string): Uint8Array {
  const result = copyBytes(value);
  if (result.length !== HELLO_ACTOR_BYTES)
    throw new CodecError(`${label} must be 16 bytes`, "INVALID_VALUE");
  return result;
}

export function encodeMutationBatchEnvelope(value: MutationBatchEnvelope): Uint8Array {
  const requestId = fixedEnvelopeId(value.requestId, "mutation request ID");
  const bootstrapId = fixedEnvelopeId(value.bootstrapId, "mutation bootstrap ID");
  assertCount(value.batchCount, "mutation batch count");
  if (value.batchCount === 0 || value.batchIndex >= value.batchCount)
    throw new CodecError("invalid mutation batch index", "INVALID_VALUE");
  if (value.batchCount > MAX_PENDING_BATCHES)
    throw new CodecError("too many mutation batches", "OVERSIZED");
  if (value.changes.length === 0 || value.changes.length > MAX_BATCH_CHANGES)
    throw new CodecError("invalid mutation batch size", "INVALID_VALUE");
  return encodeFrame(
    MessageType.MUTATION_BATCH,
    concatBytes(
      requestId,
      bootstrapId,
      encodeUnsignedLeb128(BigInt(value.batchIndex)),
      encodeUnsignedLeb128(BigInt(value.batchCount)),
      encodeBatch(value.changes)
    )
  );
}

export function decodeMutationBatchEnvelope(
  frame: Uint8Array | ArrayBuffer
): MutationBatchEnvelope {
  const decoded = decodeFrame(frame);
  if (decoded.type !== MessageType.MUTATION_BATCH)
    throw new CodecError("frame is not a mutation batch", "INVALID_TYPE");
  const source = decoded.payload;
  if (source.length < HELLO_ACTOR_BYTES * 2)
    throw new CodecError("truncated mutation batch envelope", "TRUNCATED");
  const requestId = source.slice(0, HELLO_ACTOR_BYTES);
  const bootstrapId = source.slice(HELLO_ACTOR_BYTES, HELLO_ACTOR_BYTES * 2);
  const state = { offset: HELLO_ACTOR_BYTES * 2 };
  const batchIndex = asSafeNumber(
    readLeb(source, state, "mutation batch index"),
    "mutation batch index"
  );
  const batchCount = asSafeNumber(
    readLeb(source, state, "mutation batch count"),
    "mutation batch count"
  );
  if (batchCount === 0 || batchCount > MAX_PENDING_BATCHES || batchIndex >= batchCount)
    throw new CodecError("invalid mutation batch envelope", "INVALID_VALUE");
  const changes = decodeBatch(source.slice(state.offset));
  const result = { requestId, bootstrapId, batchIndex, batchCount, changes };
  if (!sameBytes(encodeMutationBatchEnvelope(result), bytes(frame)))
    throw new CodecError("mutation batch envelope is not canonical", "INVALID_VALUE");
  return result;
}

export type RevisionedDelta = { serverRevision: bigint; record: Uint8Array | ArrayBuffer };

export function encodeRevisionedDeltaBatchFrame(changes: readonly RevisionedDelta[]): Uint8Array {
  if (changes.length === 0 || changes.length > MAX_BATCH_CHANGES)
    throw new CodecError("invalid delta batch size", "INVALID_VALUE");
  const parts: Uint8Array[] = [encodeUnsignedLeb128(BigInt(changes.length))];
  for (const change of changes) {
    assertUnsigned64(change.serverRevision, "delta server revision");
    const record = copyBytes(change.record);
    decodeMutationRecord(record);
    parts.push(
      encodeUnsignedLeb128(change.serverRevision),
      encodeUnsignedLeb128(BigInt(record.length)),
      record
    );
  }
  return encodeFrame(MessageType.DELTA_BATCH, concatBytes(...parts));
}

export function decodeRevisionedDeltaBatchFrame(frame: Uint8Array | ArrayBuffer): {
  changes: RevisionedDelta[];
} {
  const decoded = decodeFrame(frame);
  if (decoded.type !== MessageType.DELTA_BATCH)
    throw new CodecError("frame is not a delta batch", "INVALID_TYPE");
  const source = decoded.payload;
  const state = { offset: 0 };
  const count = asSafeNumber(readLeb(source, state, "delta batch count"), "delta batch count");
  if (count === 0 || count > MAX_BATCH_CHANGES)
    throw new CodecError("invalid delta batch size", "INVALID_VALUE");
  const changes: RevisionedDelta[] = [];
  let previous: bigint | undefined;
  for (let index = 0; index < count; index++) {
    const serverRevision = readLeb(source, state, "delta server revision");
    if (previous !== undefined && serverRevision !== previous + BigInt(1))
      throw new CodecError("delta revisions are not contiguous", "INVALID_VALUE");
    previous = serverRevision;
    const length = asSafeNumber(
      readLeb(source, state, "delta record length"),
      "delta record length"
    );
    if (length > source.length - state.offset)
      throw new CodecError("truncated delta record", "TRUNCATED");
    const record = source.slice(state.offset, state.offset + length);
    state.offset += length;
    decodeMutationRecord(record);
    changes.push({ serverRevision, record });
  }
  requireNoTrailingBytes(source, state.offset);
  if (!sameBytes(encodeRevisionedDeltaBatchFrame(changes), bytes(frame)))
    throw new CodecError("delta batch is not canonical", "INVALID_VALUE");
  return { changes };
}

export type SnapshotBegin = {
  revision: bigint;
  actorCount: number;
  progressShardCount: number;
  problemNoteCount: number;
  chunkCount: number;
  totalLength: bigint;
};

export function encodeSnapshotBegin(value: SnapshotBegin): Uint8Array {
  assertUnsigned64(value.revision, "snapshot revision");
  assertCount(value.actorCount, "actor count");
  assertCount(value.progressShardCount, "Progress shard count");
  assertCount(value.problemNoteCount, "Problem Note count");
  assertCount(value.chunkCount, "snapshot chunk count");
  assertUnsigned64(value.totalLength, "snapshot total length");
  return concatBytes(
    encodeUnsignedLeb128(value.revision),
    encodeUnsignedLeb128(BigInt(value.actorCount)),
    encodeUnsignedLeb128(BigInt(value.progressShardCount)),
    encodeUnsignedLeb128(BigInt(value.problemNoteCount)),
    encodeUnsignedLeb128(BigInt(value.chunkCount)),
    encodeUnsignedLeb128(value.totalLength)
  );
}

export function decodeSnapshotBegin(input: Uint8Array | ArrayBuffer): SnapshotBegin {
  const source = bytes(input);
  const state = { offset: 0 };
  const value: SnapshotBegin = {
    revision: readLeb(source, state, "snapshot revision"),
    actorCount: asSafeNumber(readLeb(source, state, "actor count"), "actor count"),
    progressShardCount: asSafeNumber(
      readLeb(source, state, "Progress shard count"),
      "Progress shard count"
    ),
    problemNoteCount: asSafeNumber(
      readLeb(source, state, "Problem Note count"),
      "Problem Note count"
    ),
    chunkCount: asSafeNumber(
      readLeb(source, state, "snapshot chunk count"),
      "snapshot chunk count"
    ),
    totalLength: readLeb(source, state, "snapshot total length"),
  };
  assertCount(value.actorCount, "actor count");
  assertCount(value.progressShardCount, "Progress shard count");
  assertCount(value.problemNoteCount, "Problem Note count");
  assertCount(value.chunkCount, "snapshot chunk count");
  requireNoTrailingBytes(source, state.offset);
  return value;
}

export function encodeSnapshotBeginFrame(value: SnapshotBegin): Uint8Array {
  return encodeFrame(MessageType.SNAPSHOT_BEGIN, encodeSnapshotBegin(value));
}

export function decodeSnapshotBeginFrame(frame: Uint8Array | ArrayBuffer): SnapshotBegin {
  const decoded = decodeFrame(frame);
  if (decoded.type !== MessageType.SNAPSHOT_BEGIN) {
    throw new CodecError("frame is not a SNAPSHOT_BEGIN message", "INVALID_TYPE");
  }
  return decodeSnapshotBegin(decoded.payload);
}

export type SnapshotChunk = {
  index: number;
  records: readonly (Uint8Array | ArrayBuffer)[];
};

/** A chunk contains an ordinal and length-delimited opaque canonical records. */
export function encodeSnapshotChunk(value: SnapshotChunk): Uint8Array {
  assertCount(value.index, "snapshot chunk index");
  return concatBytes(encodeUnsignedLeb128(BigInt(value.index)), encodeCountedBytes(value.records));
}

export function decodeSnapshotChunk(input: Uint8Array | ArrayBuffer): {
  index: number;
  records: Uint8Array[];
} {
  const source = bytes(input);
  const state = { offset: 0 };
  const index = asSafeNumber(
    readLeb(source, state, "snapshot chunk index"),
    "snapshot chunk index"
  );
  assertCount(index, "snapshot chunk index");
  const records = decodeCountedBytes(source.subarray(state.offset));
  return { index, records };
}

export function encodeSnapshotChunkFrame(value: SnapshotChunk): Uint8Array {
  return encodeFrame(MessageType.SNAPSHOT_CHUNK, encodeSnapshotChunk(value));
}

export function decodeSnapshotChunkFrame(frame: Uint8Array | ArrayBuffer): {
  index: number;
  records: Uint8Array[];
} {
  const decoded = decodeFrame(frame);
  if (decoded.type !== MessageType.SNAPSHOT_CHUNK) {
    throw new CodecError("frame is not a SNAPSHOT_CHUNK message", "INVALID_TYPE");
  }
  return decodeSnapshotChunk(decoded.payload);
}

export function encodeSnapshotEnd(checksum: number): Uint8Array {
  return writeUint32Be(checksum);
}

export function decodeSnapshotEnd(input: Uint8Array | ArrayBuffer): number {
  const source = bytes(input);
  if (source.length !== 4) throw new CodecError("SNAPSHOT_END requires a CRC32C", "INVALID_LENGTH");
  return readUint32Be(source, 0);
}

export function encodeSnapshotEndFrame(checksum: number): Uint8Array {
  return encodeFrame(MessageType.SNAPSHOT_END, encodeSnapshotEnd(checksum));
}

export function decodeSnapshotEndFrame(frame: Uint8Array | ArrayBuffer): number {
  const decoded = decodeFrame(frame);
  if (decoded.type !== MessageType.SNAPSHOT_END) {
    throw new CodecError("frame is not a SNAPSHOT_END message", "INVALID_TYPE");
  }
  return decodeSnapshotEnd(decoded.payload);
}

/** Checksum canonical record bytes incrementally, independent of chunk boundaries. */
export function snapshotChecksum(records: Iterable<Uint8Array | ArrayBuffer>): number {
  return crc32c(records);
}

type AcknowledgementOutcome = {
  status: "accepted" | "stale";
  serverRevision: bigint;
  record: Uint8Array | ArrayBuffer;
};

function decodeCanonicalRecord(value: Uint8Array): void {
  try {
    decodeMutationRecord(value);
    return;
  } catch (mutationError) {
    try {
      const snapshot = decodeSnapshotRecord(value);
      if (snapshot.kind !== "note") throw mutationError;
    } catch {
      throw mutationError;
    }
  }
}

export type DetailedAcknowledgement = {
  requestId: Uint8Array | ArrayBuffer;
  serverRevision: bigint;
  outcomes: readonly AcknowledgementOutcome[];
};

export function encodeDetailedAcknowledgement(value: DetailedAcknowledgement): Uint8Array {
  const requestId = fixedEnvelopeId(value.requestId, "acknowledgement request ID");
  assertUnsigned64(value.serverRevision, "acknowledgement server revision");
  if (value.outcomes.length > MAX_BATCH_CHANGES)
    throw new CodecError("too many acknowledgement outcomes", "OVERSIZED");
  const parts: Uint8Array[] = [
    requestId,
    encodeUnsignedLeb128(value.serverRevision),
    encodeUnsignedLeb128(BigInt(value.outcomes.length)),
  ];
  for (const outcome of value.outcomes) {
    const record = copyBytes(outcome.record);
    if (outcome.status !== "accepted" && outcome.status !== "stale")
      throw new CodecError("invalid acknowledgement outcome", "INVALID_VALUE");
    assertUnsigned64(outcome.serverRevision, "acknowledgement outcome revision");
    decodeCanonicalRecord(record);
    parts.push(
      Uint8Array.of(outcome.status === "accepted" ? 1 : 2),
      encodeUnsignedLeb128(outcome.serverRevision),
      encodeUnsignedLeb128(BigInt(record.length)),
      record
    );
  }
  return encodeFrame(MessageType.ACKNOWLEDGEMENT, concatBytes(...parts));
}

export function decodeDetailedAcknowledgement(
  frame: Uint8Array | ArrayBuffer
): DetailedAcknowledgement {
  const decoded = decodeFrame(frame);
  if (decoded.type !== MessageType.ACKNOWLEDGEMENT)
    throw new CodecError("frame is not an acknowledgement", "INVALID_TYPE");
  const source = decoded.payload;
  if (source.length < HELLO_ACTOR_BYTES)
    throw new CodecError("truncated acknowledgement request ID", "TRUNCATED");
  const requestId = source.slice(0, HELLO_ACTOR_BYTES);
  const state = { offset: HELLO_ACTOR_BYTES };
  const serverRevision = readLeb(source, state, "acknowledgement server revision");
  const count = asSafeNumber(
    readLeb(source, state, "acknowledgement outcome count"),
    "acknowledgement outcome count"
  );
  if (count > MAX_BATCH_CHANGES)
    throw new CodecError("too many acknowledgement outcomes", "OVERSIZED");
  const outcomes: AcknowledgementOutcome[] = [];
  for (let index = 0; index < count; index++) {
    if (state.offset >= source.length)
      throw new CodecError("truncated acknowledgement outcome", "TRUNCATED");
    const status = source[state.offset++];
    if (status !== 1 && status !== 2)
      throw new CodecError("invalid acknowledgement outcome", "INVALID_VALUE");
    const outcomeRevision = readLeb(source, state, "acknowledgement outcome revision");
    const length = asSafeNumber(
      readLeb(source, state, "acknowledgement record length"),
      "acknowledgement record length"
    );
    if (length > source.length - state.offset)
      throw new CodecError("truncated acknowledgement record", "TRUNCATED");
    const record = source.slice(state.offset, state.offset + length);
    state.offset += length;
    decodeCanonicalRecord(record);
    outcomes.push({
      status: status === 1 ? "accepted" : "stale",
      serverRevision: outcomeRevision,
      record,
    });
  }
  requireNoTrailingBytes(source, state.offset);
  const result = { requestId, serverRevision, outcomes };
  if (!sameBytes(encodeDetailedAcknowledgement(result), bytes(frame)))
    throw new CodecError("acknowledgement is not canonical", "INVALID_VALUE");
  return result;
}

export type Rejection = { code: RejectionCode; itemIndex: number | null };

export function encodeRejection(value: Rejection): Uint8Array {
  assertRejectionCode(value.code);
  if (value.itemIndex !== null) assertCount(value.itemIndex, "rejected item index");
  return value.itemIndex === null
    ? Uint8Array.of(value.code, 0)
    : concatBytes(Uint8Array.of(value.code, 1), encodeUnsignedLeb128(BigInt(value.itemIndex)));
}

export function decodeRejection(input: Uint8Array | ArrayBuffer): Rejection {
  const source = bytes(input);
  if (source.length < 2) throw new CodecError("truncated rejection", "TRUNCATED");
  const code = source[0];
  assertRejectionCode(code);
  const hasIndex = source[1];
  if (hasIndex === 0) {
    requireNoTrailingBytes(source, 2);
    return { code, itemIndex: null };
  }
  if (hasIndex !== 1) throw new CodecError("invalid rejection item-index flag", "INVALID_VALUE");
  const result = decodeUnsignedLeb128(source, 2);
  const itemIndex = asSafeNumber(result.value, "rejected item index");
  assertCount(itemIndex, "rejected item index");
  requireNoTrailingBytes(source, result.offset);
  return { code, itemIndex };
}

export function encodeRejectionFrame(value: Rejection): Uint8Array {
  return encodeFrame(MessageType.REJECTION, encodeRejection(value));
}

export function decodeRejectionFrame(frame: Uint8Array | ArrayBuffer): Rejection {
  const decoded = decodeFrame(frame);
  if (decoded.type !== MessageType.REJECTION) {
    throw new CodecError("frame is not a rejection message", "INVALID_TYPE");
  }
  return decodeRejection(decoded.payload);
}

function assertWellFormedUnicode(text: string): void {
  for (let index = 0; index < text.length; index++) {
    const codeUnit = text.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const next = text.charCodeAt(index + 1);
      if (!Number.isInteger(next) || next < 0xdc00 || next > 0xdfff) {
        throw new CodecError("note contains an unpaired high surrogate", "INVALID_UTF8");
      }
      index++;
    } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      throw new CodecError("note contains an unpaired low surrogate", "INVALID_UTF8");
    }
  }
}

/** Encode exact Problem Note text, preserving whitespace/newlines and rejecting invalid Unicode. */
export function encodeProblemNoteText(text: string): Uint8Array {
  if (typeof text !== "string") throw new CodecError("note must be text", "INVALID_VALUE");
  assertWellFormedUnicode(text);
  if (text.length > MAX_NOTE_UTF16_CODE_UNITS) {
    throw new CodecError("Problem Note exceeds the UTF-16 limit", "OVERSIZED");
  }
  const encoded = new TextEncoder().encode(text);
  if (encoded.length > MAX_NOTE_UTF8_BYTES) {
    throw new CodecError("Problem Note exceeds the UTF-8 wire limit", "OVERSIZED");
  }
  return encoded;
}

/** Decode exact UTF-8 Problem Note text without replacement characters. */
export function decodeProblemNoteText(input: Uint8Array | ArrayBuffer): string {
  const encoded = bytes(input);
  if (encoded.length > MAX_NOTE_UTF8_BYTES) {
    throw new CodecError("Problem Note exceeds the UTF-8 wire limit", "OVERSIZED");
  }
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(encoded);
    if (text.length > MAX_NOTE_UTF16_CODE_UNITS) {
      throw new CodecError("Problem Note exceeds the UTF-16 limit", "OVERSIZED");
    }
    return text;
  } catch (error) {
    if (error instanceof CodecError) throw error;
    throw new CodecError("Problem Note contains invalid UTF-8", "INVALID_UTF8");
  }
}

export function encodeRawMessageFrame(
  type: MessageType,
  payload: Uint8Array | ArrayBuffer
): Uint8Array {
  return encodeFrame(type, payload);
}

type ProgressShardAdd = {
  slug: string;
  actorId: Uint8Array | ArrayBuffer;
  counter: bigint;
};

type ProgressShardRemoval = {
  slug: string;
  summary: readonly {
    actorId: Uint8Array | ArrayBuffer;
    counter: bigint;
  }[];
};

export type ProgressShard = {
  adds: readonly ProgressShardAdd[];
  removed: readonly ProgressShardRemoval[];
};

const PROGRESS_SHARD_ACTOR_BYTES = 16;
const PROGRESS_SHARD_UTF8 = new TextEncoder();
const PROGRESS_SHARD_DECODER = new TextDecoder("utf-8", { fatal: true });

function compareBinary(left: Uint8Array, right: Uint8Array): number {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index++) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return left.length - right.length;
}

function compareProgressShardAdd(left: ProgressShardAdd, right: ProgressShardAdd): number {
  const actor = compareBinary(copyBytes(left.actorId), copyBytes(right.actorId));
  if (actor !== 0) return actor;
  const leftSlug = PROGRESS_SHARD_UTF8.encode(left.slug);
  const rightSlug = PROGRESS_SHARD_UTF8.encode(right.slug);
  const slug = compareBinary(leftSlug, rightSlug);
  if (slug !== 0) return slug;
  return left.counter < right.counter ? -1 : left.counter > right.counter ? 1 : 0;
}

function compareProgressShardRemoval(
  left: ProgressShardRemoval,
  right: ProgressShardRemoval
): number {
  return compareBinary(
    PROGRESS_SHARD_UTF8.encode(left.slug),
    PROGRESS_SHARD_UTF8.encode(right.slug)
  );
}

function progressShardActor(value: Uint8Array | ArrayBuffer): Uint8Array {
  const actorId = copyBytes(value);
  if (actorId.length !== PROGRESS_SHARD_ACTOR_BYTES) {
    throw new CodecError("Progress Actor ID must be 16 bytes", "INVALID_VALUE");
  }
  return actorId;
}

function progressShardSlug(value: string): Uint8Array {
  if (typeof value !== "string" || value.length === 0) {
    throw new CodecError("Progress slug must be non-empty text", "INVALID_VALUE");
  }
  assertWellFormedUnicode(value);
  return PROGRESS_SHARD_UTF8.encode(value);
}

function encodeProgressShardString(value: string): Uint8Array {
  const encoded = progressShardSlug(value);
  return concatBytes(encodeUnsignedLeb128(BigInt(encoded.length)), encoded);
}

function readProgressShardString(source: Uint8Array, state: { offset: number }): string {
  const length = asSafeNumber(
    readLeb(source, state, "Progress slug length"),
    "Progress slug length"
  );
  if (length === 0 || length > source.length - state.offset) {
    throw new CodecError("invalid Progress slug length", "INVALID_LENGTH");
  }
  let result: string;
  try {
    result = PROGRESS_SHARD_DECODER.decode(source.subarray(state.offset, state.offset + length));
  } catch {
    throw new CodecError("Progress slug contains invalid UTF-8", "INVALID_UTF8");
  }
  state.offset += length;
  progressShardSlug(result);
  return result;
}

/** Encode a canonical binary Progress shard for D1 and snapshot records. */
export function encodeProgressShard(value: ProgressShard): Uint8Array {
  const adds = value.adds.map((add) => ({
    slug: add.slug,
    actorId: progressShardActor(add.actorId),
    counter: add.counter,
  }));
  const removed = value.removed.map((entry) => ({
    slug: entry.slug,
    summary: entry.summary.map((item) => ({
      actorId: progressShardActor(item.actorId),
      counter: item.counter,
    })),
  }));
  for (const add of adds) {
    assertUnsigned64(add.counter, "Progress counter");
    progressShardSlug(add.slug);
  }
  for (const entry of removed) {
    progressShardSlug(entry.slug);
    for (const item of entry.summary) assertUnsigned64(item.counter, "Progress removal counter");
  }
  const addDots = new Set<string>();
  for (const add of adds) {
    const key = `${Array.from(add.actorId).join(",")}:${add.counter.toString()}`;
    if (addDots.has(key)) throw new CodecError("duplicate Progress dot", "INVALID_VALUE");
    addDots.add(key);
  }
  const removedSlugs = new Set<string>();
  for (const entry of removed) {
    if (removedSlugs.has(entry.slug))
      throw new CodecError("duplicate Progress removal", "INVALID_VALUE");
    removedSlugs.add(entry.slug);
    const actors = new Set<string>();
    for (const item of entry.summary) {
      const key = Array.from(item.actorId).join(",");
      if (actors.has(key))
        throw new CodecError("duplicate Progress removal Actor", "INVALID_VALUE");
      actors.add(key);
    }
  }
  assertCount(adds.length, "Progress add count");
  assertCount(removed.length, "Progress removal count");
  for (const entry of removed) assertCount(entry.summary.length, "Progress removal summary count");
  adds.sort(compareProgressShardAdd);
  removed.sort(compareProgressShardRemoval);
  const parts: Uint8Array[] = [encodeUnsignedLeb128(BigInt(adds.length))];
  for (const add of adds) {
    parts.push(encodeProgressShardString(add.slug), add.actorId, encodeUnsignedLeb128(add.counter));
  }
  parts.push(encodeUnsignedLeb128(BigInt(removed.length)));
  for (const entry of removed) {
    const summary = entry.summary
      .map((item) => ({ actorId: item.actorId, counter: item.counter }))
      .sort((left, right) => compareBinary(left.actorId, right.actorId));
    parts.push(encodeProgressShardString(entry.slug), encodeUnsignedLeb128(BigInt(summary.length)));
    for (const item of summary) parts.push(item.actorId, encodeUnsignedLeb128(item.counter));
  }
  return concatBytes(...parts);
}

/** Decode and require canonical ordering and uniqueness for a Progress shard. */
export function decodeProgressShard(input: Uint8Array | ArrayBuffer): ProgressShard {
  const source = copyBytes(input);
  const state = { offset: 0 };
  const addCount = asSafeNumber(readLeb(source, state, "Progress add count"), "Progress add count");
  assertCount(addCount, "Progress add count");
  const adds: ProgressShardAdd[] = [];
  for (let index = 0; index < addCount; index++) {
    const slug = readProgressShardString(source, state);
    if (source.length - state.offset < PROGRESS_SHARD_ACTOR_BYTES) {
      throw new CodecError("truncated Progress Actor ID", "TRUNCATED");
    }
    const actorId = source.slice(state.offset, state.offset + PROGRESS_SHARD_ACTOR_BYTES);
    state.offset += PROGRESS_SHARD_ACTOR_BYTES;
    adds.push({ slug, actorId, counter: readLeb(source, state, "Progress counter") });
  }
  const removalCount = asSafeNumber(
    readLeb(source, state, "Progress removal count"),
    "Progress removal count"
  );
  assertCount(removalCount, "Progress removal count");
  const removed: ProgressShardRemoval[] = [];
  for (let index = 0; index < removalCount; index++) {
    const slug = readProgressShardString(source, state);
    const summaryCount = asSafeNumber(
      readLeb(source, state, "Progress removal summary count"),
      "Progress removal summary count"
    );
    assertCount(summaryCount, "Progress removal summary count");
    const summary: { actorId: Uint8Array; counter: bigint }[] = [];
    for (let summaryIndex = 0; summaryIndex < summaryCount; summaryIndex++) {
      if (source.length - state.offset < PROGRESS_SHARD_ACTOR_BYTES) {
        throw new CodecError("truncated Progress removal Actor ID", "TRUNCATED");
      }
      const actorId = source.slice(state.offset, state.offset + PROGRESS_SHARD_ACTOR_BYTES);
      state.offset += PROGRESS_SHARD_ACTOR_BYTES;
      summary.push({ actorId, counter: readLeb(source, state, "Progress removal counter") });
    }
    removed.push({ slug, summary });
  }
  requireNoTrailingBytes(source, state.offset);
  const result = { adds, removed };
  const canonical = encodeProgressShard(result);
  if (
    canonical.length !== source.length ||
    !canonical.every((byte, index) => byte === source[index])
  ) {
    throw new CodecError("Progress shard is not canonically encoded", "INVALID_VALUE");
  }
  return result;
}

type ProgressMutationRecord = {
  kind: "add" | "remove";
  slug: string;
  actorId: Uint8Array | ArrayBuffer;
  counter: bigint;
};

/** A state-based Progress delta. Causal context makes this safe to deliver
 * out of order or after compaction, unlike a sequence of operation records. */
export type ProgressDeltaRecord = {
  kind: "progress-delta";
  adds: readonly ProgressShardAdd[];
  causalSummary: readonly { actorId: Uint8Array | ArrayBuffer; counter: bigint }[];
  removed: readonly ProgressShardRemoval[];
};

type ProblemNoteMutationRecord = {
  kind: "note";
  slug: string;
  actorId: Uint8Array | ArrayBuffer;
  localRevision: bigint;
  operation: { kind: "value"; bytes: Uint8Array | ArrayBuffer } | { kind: "delete" };
};

export type MutationRecord =
  | ProgressMutationRecord
  | ProgressDeltaRecord
  | ProblemNoteMutationRecord;

function encodeProgressDeltaValue(value: ProgressDeltaRecord): Uint8Array {
  const causal = value.causalSummary.map((entry) => ({
    actorId: progressShardActor(entry.actorId),
    counter: entry.counter,
  }));
  for (const entry of causal) assertUnsigned64(entry.counter, "Progress causal counter");
  causal.sort((left, right) => compareBinary(left.actorId, right.actorId));
  for (let index = 1; index < causal.length; index++) {
    if (compareBinary(causal[index - 1].actorId, causal[index].actorId) === 0)
      throw new CodecError("duplicate Progress causal Actor", "INVALID_VALUE");
  }
  const adds = value.adds.map((add) => ({
    slug: add.slug,
    actorId: progressShardActor(add.actorId),
    counter: add.counter,
  }));
  const removed = value.removed.map((entry) => ({
    slug: entry.slug,
    summary: entry.summary.map((item) => ({
      actorId: progressShardActor(item.actorId),
      counter: item.counter,
    })),
  }));
  for (const add of adds) {
    progressShardSlug(add.slug);
    assertUnsigned64(add.counter, "Progress counter");
  }
  for (const entry of removed) {
    progressShardSlug(entry.slug);
    for (const item of entry.summary) assertUnsigned64(item.counter, "Progress removal counter");
  }
  adds.sort(compareProgressShardAdd);
  removed.sort(compareProgressShardRemoval);
  const dotKeys = new Set<string>();
  for (const add of adds) {
    const key = `${Array.from(add.actorId).join(",")}:${add.counter.toString()}`;
    if (dotKeys.has(key)) throw new CodecError("duplicate Progress dot", "INVALID_VALUE");
    dotKeys.add(key);
  }
  const removedSlugs = new Set<string>();
  for (const entry of removed) {
    if (removedSlugs.has(entry.slug))
      throw new CodecError("duplicate Progress removal", "INVALID_VALUE");
    removedSlugs.add(entry.slug);
    const actors = new Set<string>();
    for (const item of entry.summary) {
      const key = Array.from(item.actorId).join(",");
      if (actors.has(key))
        throw new CodecError("duplicate Progress removal Actor", "INVALID_VALUE");
      actors.add(key);
    }
    entry.summary.sort((left, right) => compareBinary(left.actorId, right.actorId));
  }
  assertCount(causal.length, "Progress causal count");
  assertCount(adds.length, "Progress add count");
  assertCount(removed.length, "Progress removal count");
  const parts: Uint8Array[] = [encodeUnsignedLeb128(BigInt(causal.length))];
  for (const entry of causal) parts.push(entry.actorId, encodeUnsignedLeb128(entry.counter));
  parts.push(encodeUnsignedLeb128(BigInt(adds.length)));
  for (const add of adds)
    parts.push(encodeProgressShardString(add.slug), add.actorId, encodeUnsignedLeb128(add.counter));
  parts.push(encodeUnsignedLeb128(BigInt(removed.length)));
  for (const entry of removed) {
    assertCount(entry.summary.length, "Progress removal summary count");
    parts.push(
      encodeProgressShardString(entry.slug),
      encodeUnsignedLeb128(BigInt(entry.summary.length))
    );
    for (const item of entry.summary) parts.push(item.actorId, encodeUnsignedLeb128(item.counter));
  }
  return concatBytes(...parts);
}

/** Encode a canonical aggregate Progress delta without a mutation envelope. */
export function encodeProgressDeltaRecord(value: ProgressDeltaRecord): Uint8Array {
  return encodeProgressDeltaValue(value);
}

function encodeMutationRecordValue(value: MutationRecord): Uint8Array {
  if (value.kind === "progress-delta") {
    return concatBytes(Uint8Array.of(4), encodeProgressDeltaValue(value));
  }
  const actorId = progressShardActor(value.actorId);
  const slug = encodeProgressShardString(value.slug);
  if (value.kind === "add" || value.kind === "remove") {
    assertUnsigned64(value.counter, "Progress counter");
    return concatBytes(
      Uint8Array.of(value.kind === "add" ? 1 : 2),
      slug,
      actorId,
      encodeUnsignedLeb128(value.counter)
    );
  }
  if (value.kind !== "note") throw new CodecError("invalid mutation record kind", "INVALID_VALUE");
  assertUnsigned64(value.localRevision, "Problem Note local revision");
  const operation =
    value.operation.kind === "delete"
      ? Uint8Array.of(0)
      : concatBytes(
          Uint8Array.of(1),
          encodeUnsignedLeb128(BigInt(copyBytes(value.operation.bytes).length)),
          copyBytes(value.operation.bytes)
        );
  if (value.operation.kind === "value") decodeProblemNoteText(value.operation.bytes);
  return concatBytes(
    Uint8Array.of(3),
    slug,
    actorId,
    encodeUnsignedLeb128(value.localRevision),
    operation
  );
}

/** Encode one canonical mutation record carried inside a CJET mutation batch. */
export function encodeMutationRecord(value: MutationRecord): Uint8Array {
  return encodeMutationRecordValue(value);
}

/** Decode one canonical mutation record, rejecting non-canonical bytes. */
export function decodeMutationRecord(input: Uint8Array | ArrayBuffer): MutationRecord {
  const source = copyBytes(input);
  const state = { offset: 0 };
  if (source.length === 0) throw new CodecError("missing mutation record kind", "TRUNCATED");
  const kind = source[state.offset++];
  if (kind !== 1 && kind !== 2 && kind !== 3 && kind !== 4) {
    throw new CodecError("invalid mutation record kind", "INVALID_VALUE");
  }
  if (kind === 4) {
    const causalCount = asSafeNumber(
      readLeb(source, state, "Progress causal count"),
      "Progress causal count"
    );
    assertCount(causalCount, "Progress causal count");
    const causalSummary: { actorId: Uint8Array; counter: bigint }[] = [];
    for (let index = 0; index < causalCount; index++) {
      if (source.length - state.offset < PROGRESS_SHARD_ACTOR_BYTES)
        throw new CodecError("truncated Progress causal Actor ID", "TRUNCATED");
      const actorId = source.slice(state.offset, state.offset + PROGRESS_SHARD_ACTOR_BYTES);
      state.offset += PROGRESS_SHARD_ACTOR_BYTES;
      causalSummary.push({ actorId, counter: readLeb(source, state, "Progress causal counter") });
    }
    const addCount = asSafeNumber(
      readLeb(source, state, "Progress add count"),
      "Progress add count"
    );
    assertCount(addCount, "Progress add count");
    const adds: ProgressShardAdd[] = [];
    for (let index = 0; index < addCount; index++) {
      const slug = readProgressShardString(source, state);
      if (source.length - state.offset < PROGRESS_SHARD_ACTOR_BYTES)
        throw new CodecError("truncated Progress Actor ID", "TRUNCATED");
      const actorId = source.slice(state.offset, state.offset + PROGRESS_SHARD_ACTOR_BYTES);
      state.offset += PROGRESS_SHARD_ACTOR_BYTES;
      adds.push({ slug, actorId, counter: readLeb(source, state, "Progress counter") });
    }
    const removalCount = asSafeNumber(
      readLeb(source, state, "Progress removal count"),
      "Progress removal count"
    );
    assertCount(removalCount, "Progress removal count");
    const removed: ProgressShardRemoval[] = [];
    for (let index = 0; index < removalCount; index++) {
      const slug = readProgressShardString(source, state);
      const summaryCount = asSafeNumber(
        readLeb(source, state, "Progress removal summary count"),
        "Progress removal summary count"
      );
      assertCount(summaryCount, "Progress removal summary count");
      const summary: { actorId: Uint8Array; counter: bigint }[] = [];
      for (let itemIndex = 0; itemIndex < summaryCount; itemIndex++) {
        if (source.length - state.offset < PROGRESS_SHARD_ACTOR_BYTES)
          throw new CodecError("truncated Progress removal Actor ID", "TRUNCATED");
        const actorId = source.slice(state.offset, state.offset + PROGRESS_SHARD_ACTOR_BYTES);
        state.offset += PROGRESS_SHARD_ACTOR_BYTES;
        summary.push({ actorId, counter: readLeb(source, state, "Progress removal counter") });
      }
      removed.push({ slug, summary });
    }
    const result: ProgressDeltaRecord = { kind: "progress-delta", adds, causalSummary, removed };
    requireNoTrailingBytes(source, state.offset);
    if (!sameBytes(encodeMutationRecordValue(result), source))
      throw new CodecError("Progress delta is not canonically encoded", "INVALID_VALUE");
    return result;
  }
  const slug = readProgressShardString(source, state);
  if (source.length - state.offset < PROGRESS_SHARD_ACTOR_BYTES) {
    throw new CodecError("truncated mutation Actor ID", "TRUNCATED");
  }
  const actorId = source.slice(state.offset, state.offset + PROGRESS_SHARD_ACTOR_BYTES);
  state.offset += PROGRESS_SHARD_ACTOR_BYTES;
  if (kind === 1 || kind === 2) {
    const result: MutationRecord = {
      kind: kind === 1 ? "add" : "remove",
      slug,
      actorId,
      counter: readLeb(source, state, "Progress counter"),
    };
    requireNoTrailingBytes(source, state.offset);
    if (!sameBytes(encodeMutationRecordValue(result), source)) {
      throw new CodecError("mutation record is not canonically encoded", "INVALID_VALUE");
    }
    return result;
  }
  const localRevision = readLeb(source, state, "Problem Note local revision");
  if (state.offset >= source.length)
    throw new CodecError("truncated Problem Note operation", "TRUNCATED");
  const operationKind = source[state.offset++];
  let operation: ProblemNoteMutationRecord["operation"];
  if (operationKind === 0) {
    operation = { kind: "delete" };
  } else if (operationKind === 1) {
    const length = asSafeNumber(
      readLeb(source, state, "Problem Note value length"),
      "Problem Note value length"
    );
    if (length > source.length - state.offset)
      throw new CodecError("truncated Problem Note value", "TRUNCATED");
    const bytes = source.slice(state.offset, state.offset + length);
    state.offset += length;
    decodeProblemNoteText(bytes);
    operation = { kind: "value", bytes };
  } else {
    throw new CodecError("invalid Problem Note operation kind", "INVALID_VALUE");
  }
  const result: ProblemNoteMutationRecord = {
    kind: "note",
    slug,
    actorId,
    localRevision,
    operation,
  };
  requireNoTrailingBytes(source, state.offset);
  if (!sameBytes(encodeMutationRecordValue(result), source)) {
    throw new CodecError("mutation record is not canonically encoded", "INVALID_VALUE");
  }
  return result;
}

type SnapshotActorRecord = {
  kind: "actor";
  actorId: Uint8Array | ArrayBuffer;
  revocationHandleHash: Uint8Array | ArrayBuffer;
  isLegacy: boolean;
};

type SnapshotCausalRecord = {
  kind: "causal";
  actorId: Uint8Array | ArrayBuffer;
  counter: bigint;
};

type SnapshotShardRecord = {
  kind: "shard";
  prefix: string;
  depth: number;
  encoded: Uint8Array | ArrayBuffer;
};

type SnapshotNoteRecord = {
  kind: "note";
  slug: string;
  actorId: Uint8Array | ArrayBuffer;
  localRevision: bigint;
  serverRevision: bigint;
  operation: { kind: "value"; bytes: Uint8Array | ArrayBuffer } | { kind: "delete" };
};

export type SnapshotRecord =
  | SnapshotActorRecord
  | SnapshotCausalRecord
  | SnapshotShardRecord
  | SnapshotNoteRecord;

/** Encode one canonical deterministic snapshot record. */
export function encodeSnapshotRecord(value: SnapshotRecord): Uint8Array {
  if (value.kind === "actor") {
    const actorId = progressShardActor(value.actorId);
    const hash = copyBytes(value.revocationHandleHash);
    if (hash.length !== 32)
      throw new CodecError("Revocation Handle hash must be 32 bytes", "INVALID_VALUE");
    return concatBytes(Uint8Array.of(1), actorId, hash, Uint8Array.of(value.isLegacy ? 1 : 0));
  }
  if (value.kind === "causal") {
    return concatBytes(
      Uint8Array.of(2),
      progressShardActor(value.actorId),
      encodeUnsignedLeb128(value.counter)
    );
  }
  if (value.kind === "shard") {
    if (!/^[0-9a-f]*$/.test(value.prefix) || value.depth !== value.prefix.length * 4) {
      throw new CodecError("invalid snapshot shard metadata", "INVALID_VALUE");
    }
    const encoded = copyBytes(value.encoded);
    decodeProgressShard(encoded);
    return concatBytes(
      Uint8Array.of(3),
      encodeProgressShardString(value.prefix),
      encodeUnsignedLeb128(BigInt(value.depth)),
      encodeUnsignedLeb128(BigInt(encoded.length)),
      encoded
    );
  }
  const actorId = progressShardActor(value.actorId);
  assertUnsigned64(value.localRevision, "Problem Note local revision");
  assertUnsigned64(value.serverRevision, "Problem Note server revision");
  const operation =
    value.operation.kind === "delete"
      ? Uint8Array.of(0)
      : concatBytes(
          Uint8Array.of(1),
          encodeUnsignedLeb128(BigInt(copyBytes(value.operation.bytes).length)),
          copyBytes(value.operation.bytes)
        );
  if (value.operation.kind === "value") decodeProblemNoteText(value.operation.bytes);
  return concatBytes(
    Uint8Array.of(4),
    encodeProgressShardString(value.slug),
    actorId,
    encodeUnsignedLeb128(value.localRevision),
    encodeUnsignedLeb128(value.serverRevision),
    operation
  );
}

/** Decode one canonical deterministic snapshot record. */
export function decodeSnapshotRecord(input: Uint8Array | ArrayBuffer): SnapshotRecord {
  const source = copyBytes(input);
  const state = { offset: 0 };
  if (source.length === 0) throw new CodecError("missing snapshot record kind", "TRUNCATED");
  const kind = source[state.offset++];
  let result: SnapshotRecord;
  if (kind === 1) {
    if (source.length - state.offset < 16 + 32 + 1)
      throw new CodecError("truncated Actor snapshot record", "TRUNCATED");
    const actorId = source.slice(state.offset, state.offset + 16);
    state.offset += 16;
    const revocationHandleHash = source.slice(state.offset, state.offset + 32);
    state.offset += 32;
    const isLegacy = source[state.offset++];
    if (isLegacy !== 0 && isLegacy !== 1)
      throw new CodecError("invalid Actor legacy flag", "INVALID_VALUE");
    result = { kind: "actor", actorId, revocationHandleHash, isLegacy: isLegacy === 1 };
  } else if (kind === 2) {
    if (source.length - state.offset < 16)
      throw new CodecError("truncated causal Actor ID", "TRUNCATED");
    const actorId = source.slice(state.offset, state.offset + 16);
    state.offset += 16;
    result = { kind: "causal", actorId, counter: readLeb(source, state, "causal counter") };
  } else if (kind === 3) {
    const prefix = readProgressShardString(source, state);
    const depth = asSafeNumber(
      readLeb(source, state, "snapshot shard depth"),
      "snapshot shard depth"
    );
    const length = asSafeNumber(
      readLeb(source, state, "snapshot shard length"),
      "snapshot shard length"
    );
    if (length > source.length - state.offset)
      throw new CodecError("truncated snapshot shard", "TRUNCATED");
    const encoded = source.slice(state.offset, state.offset + length);
    state.offset += length;
    result = { kind: "shard", prefix, depth, encoded };
  } else if (kind === 4) {
    const slug = readProgressShardString(source, state);
    if (source.length - state.offset < 16)
      throw new CodecError("truncated note Actor ID", "TRUNCATED");
    const actorId = source.slice(state.offset, state.offset + 16);
    state.offset += 16;
    const localRevision = readLeb(source, state, "Problem Note local revision");
    const serverRevision = readLeb(source, state, "Problem Note server revision");
    if (state.offset >= source.length)
      throw new CodecError("truncated Problem Note operation", "TRUNCATED");
    const operationKind = source[state.offset++];
    let operation: SnapshotNoteRecord["operation"];
    if (operationKind === 0) operation = { kind: "delete" };
    else if (operationKind === 1) {
      const length = asSafeNumber(
        readLeb(source, state, "Problem Note value length"),
        "Problem Note value length"
      );
      if (length > source.length - state.offset)
        throw new CodecError("truncated Problem Note value", "TRUNCATED");
      const bytes = source.slice(state.offset, state.offset + length);
      state.offset += length;
      decodeProblemNoteText(bytes);
      operation = { kind: "value", bytes };
    } else throw new CodecError("invalid Problem Note operation kind", "INVALID_VALUE");
    result = { kind: "note", slug, actorId, localRevision, serverRevision, operation };
  } else {
    throw new CodecError("invalid snapshot record kind", "INVALID_VALUE");
  }
  requireNoTrailingBytes(source, state.offset);
  const canonical = encodeSnapshotRecord(result);
  if (!sameBytes(canonical, source))
    throw new CodecError("snapshot record is not canonically encoded", "INVALID_VALUE");
  return result;
}
