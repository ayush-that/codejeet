import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  Crc32cAccumulator,
  CodecError,
  MAX_BATCH_CHANGES,
  MAX_PENDING_BATCHES,
  MAX_FRAME_BYTES,
  MAX_UINT64,
  MessageType,
  RejectionCode,
  decodeBatch,
  decodeBatchFrame,
  decodeFrame,
  decodeDetailedAcknowledgement,
  decodeMutationBatchEnvelope,
  decodeStrictHello,
  decodeMutationRecord,
  decodeProblemNoteText,
  decodeProgressShard,
  decodeRevisionedDeltaBatchFrame,
  decodeRejection,
  decodeSnapshotBegin,
  decodeSnapshotChunk,
  decodeSnapshotEnd,
  decodeUnsignedLeb128,
  encodeBatch,
  encodeDetailedAcknowledgement,
  encodeFrame,
  encodeHello,
  encodeProblemNoteText,
  encodeMutationRecord,
  encodeMutationBatchEnvelope,
  encodeProgressShard,
  encodeHelloFrame,
  encodeRevisionedDeltaBatchFrame,
  encodeRejection,
  encodeRejectionFrame,
  encodeSnapshotBegin,
  encodeSnapshotBeginFrame,
  encodeSnapshotChunk,
  encodeSnapshotChunkFrame,
  encodeSnapshotEnd,
  encodeSnapshotEndFrame,
  encodeUnsignedLeb128,
  crc32cBytes,
  snapshotChecksum,
} from "../lib/sync/codec";

const textEncoder = new TextEncoder();

function hex(value: Uint8Array): string {
  return Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function bytesFromHex(value: string): Uint8Array {
  return Uint8Array.from(value.match(/../g) ?? [], (byte) => Number.parseInt(byte, 16));
}

function assertCodecError(action: () => unknown, code?: CodecError["code"]): void {
  assert.throws(action, (error: unknown) => {
    assert.ok(error instanceof CodecError);
    if (code !== undefined) assert.equal(error.code, code);
    return true;
  });
}

describe("CJET codec", () => {
  it("matches the CRC32C Castagnoli known vector", () => {
    assert.equal(crc32cBytes(textEncoder.encode("123456789")), 0xe3069283);
  });

  it("uses canonical unsigned LEB128 through the full u64 range", () => {
    const values = [BigInt(0), BigInt(127), BigInt(128), BigInt(2) ** BigInt(32), MAX_UINT64];
    for (const value of values) {
      const encoded = encodeUnsignedLeb128(value);
      const decoded = decodeUnsignedLeb128(encoded);
      assert.equal(decoded.value, value);
      assert.equal(decoded.offset, encoded.length);
    }
    assert.equal(hex(encodeUnsignedLeb128(BigInt(128))), "8001");
    assertCodecError(() => encodeUnsignedLeb128(MAX_UINT64 + BigInt(1)), "INVALID_VALUE");
    assertCodecError(() => decodeUnsignedLeb128(Uint8Array.of(0x80, 0)), "INVALID_VALUE");
    assertCodecError(() => decodeUnsignedLeb128(Uint8Array.of(0x80)), "TRUNCATED");
    assertCodecError(
      () =>
        decodeUnsignedLeb128(
          Uint8Array.of(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x02)
        ),
      "INVALID_VALUE"
    );
  });

  it("has stable golden frames for every version-one message type", () => {
    const addRecord = encodeMutationRecord({
      kind: "add",
      slug: "01-matrix",
      actorId: new Uint8Array(16),
      counter: BigInt(0),
    });
    const fixtures: Array<[MessageType, Uint8Array, string]> = [
      [
        MessageType.HELLO,
        encodeHelloFrame({
          actorId: Uint8Array.from({ length: 16 }, () => 1),
          revocationHandleHash: Uint8Array.from({ length: 32 }, () => 2),
          lastServerRevision: BigInt(258),
          causalSummary: [
            { actorId: Uint8Array.from({ length: 16 }, () => 3), counter: BigInt(4) },
          ],
          bootstrapId: Uint8Array.from({ length: 16 }, () => 4),
          pendingBatchCount: 2,
        }),
        "434a4554010155" +
          "01010101010101010101010101010101" +
          "0202020202020202020202020202020202020202020202020202020202020202" +
          "820201" +
          "03030303030303030303030303030303" +
          "04" +
          "04040404040404040404040404040404" +
          "02" +
          "27d228a5",
      ],
      [
        MessageType.MUTATION_BATCH,
        encodeMutationBatchEnvelope({
          requestId: Uint8Array.from({ length: 16 }, () => 5),
          bootstrapId: Uint8Array.from({ length: 16 }, () => 6),
          batchIndex: 0,
          batchCount: 2,
          changes: [addRecord],
        }),
        "434a455401024005050505050505050505050505050505060606060606060606060606060606060002011c010930312d6d617472697800000000000000000000000000000000004b2cb628",
      ],
      [
        MessageType.ACKNOWLEDGEMENT,
        encodeDetailedAcknowledgement({
          requestId: Uint8Array.from({ length: 16 }, () => 7),
          serverRevision: BigInt(258),
          outcomes: [{ status: "accepted", serverRevision: BigInt(258), record: addRecord }],
        }),
        "434a4554010333070707070707070707070707070707078202010182021c010930312d6d61747269780000000000000000000000000000000000f4beea4e",
      ],
      [
        MessageType.SNAPSHOT_BEGIN,
        encodeSnapshotBeginFrame({
          revision: BigInt(258),
          actorCount: 2,
          progressShardCount: 3,
          problemNoteCount: 4,
          chunkCount: 5,
          totalLength: BigInt(500),
        }),
        "434a4554010408820202030405f403d514e93e",
      ],
      [
        MessageType.SNAPSHOT_CHUNK,
        encodeSnapshotChunkFrame({
          index: 2,
          records: [Uint8Array.of(0xaa), Uint8Array.of(0xbb, 0xcc)],
        }),
        "434a4554010507020201aa02bbccf6845a53",
      ],
      [
        MessageType.SNAPSHOT_END,
        encodeSnapshotEndFrame(0xe3069283),
        "434a4554010604e3069283c7a6e28e",
      ],
      [
        MessageType.DELTA_BATCH,
        encodeRevisionedDeltaBatchFrame([
          {
            serverRevision: BigInt(1),
            record: addRecord,
          },
        ]),
        "434a455401071f01011c010930312d6d61747269780000000000000000000000000000000000fd7d6a4f",
      ],
      [
        MessageType.REJECTION,
        encodeRejectionFrame({ code: RejectionCode.INVALID_RECORD, itemIndex: 3 }),
        "434a45540108030301039160e0a8",
      ],
      [
        MessageType.SNAPSHOT_CONFIRM,
        encodeFrame(MessageType.SNAPSHOT_CONFIRM, new Uint8Array(80).fill(9)),
        "434a455401095009090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909090909092ef9cf85",
      ],
    ];

    for (const [type, frame, expectedFixture] of fixtures) {
      const encoded = frame;
      const expected = expectedFixture;
      assert.equal(hex(encoded), expected);
      const decoded = decodeFrame(bytesFromHex(expected));
      assert.equal(decoded.type, type);
      assert.deepEqual(decoded.payload, encoded.slice(7, -4));
    }
  });

  it("round-trips typed batches, snapshots, acknowledgements, and rejections", () => {
    const changes = [
      encodeMutationRecord({
        kind: "add",
        slug: "01-matrix",
        actorId: new Uint8Array(16),
        counter: BigInt(0),
      }),
      encodeMutationRecord({
        kind: "add",
        slug: "02-add-two-numbers",
        actorId: new Uint8Array(16),
        counter: BigInt(1),
      }),
      encodeMutationRecord({
        kind: "remove",
        slug: "03-classify-string",
        actorId: new Uint8Array(16),
        counter: BigInt(2),
      }),
    ];
    const envelope = {
      requestId: new Uint8Array(16).fill(8),
      bootstrapId: new Uint8Array(16).fill(9),
      batchIndex: 0,
      batchCount: 1,
      changes,
    };
    assert.deepEqual(decodeMutationBatchEnvelope(encodeMutationBatchEnvelope(envelope)), envelope);
    const revisioned = changes.map((record, index) => ({
      serverRevision: BigInt(index + 1),
      record,
    }));
    assert.deepEqual(decodeBatchFrame(encodeRevisionedDeltaBatchFrame(revisioned)), {
      type: MessageType.DELTA_BATCH,
      changes,
    });
    assert.deepEqual(decodeRevisionedDeltaBatchFrame(encodeRevisionedDeltaBatchFrame(revisioned)), {
      changes: revisioned,
    });

    const begin = {
      revision: MAX_UINT64,
      actorCount: 4,
      progressShardCount: 5,
      problemNoteCount: 6,
      chunkCount: 7,
      totalLength: BigInt(8),
    };
    assert.deepEqual(decodeSnapshotBegin(encodeSnapshotBegin(begin)), begin);
    assert.deepEqual(decodeSnapshotChunk(encodeSnapshotChunk({ index: 8, records: changes })), {
      index: 8,
      records: changes,
    });
    assert.equal(decodeSnapshotEnd(encodeSnapshotEnd(0x01020304)), 0x01020304);
    const acknowledgement = {
      requestId: new Uint8Array(16).fill(10),
      serverRevision: MAX_UINT64,
      outcomes: [{ status: "accepted" as const, serverRevision: MAX_UINT64, record: changes[0] }],
    };
    assert.deepEqual(
      decodeDetailedAcknowledgement(encodeDetailedAcknowledgement(acknowledgement)),
      acknowledgement
    );
    for (const itemIndex of [null, 0, 10]) {
      const rejection = { code: RejectionCode.INVALID_RECORD, itemIndex };
      assert.deepEqual(decodeRejection(encodeRejection(rejection)), rejection);
    }
    assert.deepEqual(decodeSnapshotBegin(encodeSnapshotBeginFrame(begin).slice(7, -4)), begin);
    assert.deepEqual(
      decodeSnapshotChunk(encodeSnapshotChunkFrame({ index: 8, records: changes }).slice(7, -4)),
      { index: 8, records: changes }
    );
    assert.equal(decodeSnapshotEnd(encodeSnapshotEndFrame(0x01020304).slice(7, -4)), 0x01020304);
    assert.deepEqual(
      decodeRejection(
        encodeRejectionFrame({ code: RejectionCode.INVALID_RECORD, itemIndex: 10 }).slice(7, -4)
      ),
      { code: RejectionCode.INVALID_RECORD, itemIndex: 10 }
    );
  });

  it("rejects invalid framing, noncanonical payloads, and size violations", () => {
    const valid = encodeFrame(MessageType.HELLO, Uint8Array.of(1));
    const wrongMagic = valid.slice();
    wrongMagic[0] = 0;
    assertCodecError(() => decodeFrame(wrongMagic), "INVALID_VALUE");
    const wrongVersion = valid.slice();
    wrongVersion[4] = 2;
    assertCodecError(() => decodeFrame(wrongVersion), "UNSUPPORTED_VERSION");
    const wrongType = valid.slice();
    wrongType[5] = 0;
    assertCodecError(() => decodeFrame(wrongType), "INVALID_TYPE");
    assertCodecError(() => decodeFrame(valid.slice(0, -1)), "TRUNCATED");
    assertCodecError(() => decodeFrame(Uint8Array.from([...valid, 0])), "INVALID_LENGTH");
    const badCrc = valid.slice();
    badCrc[badCrc.length - 1] ^= 1;
    assertCodecError(() => decodeFrame(badCrc), "CHECKSUM_MISMATCH");

    const nonminimalLengthBody = Uint8Array.from([
      0x43,
      0x4a,
      0x45,
      0x54,
      1,
      MessageType.HELLO,
      0x80,
      0,
      0,
      0,
      0,
    ]);
    assertCodecError(() => decodeFrame(nonminimalLengthBody), "INVALID_VALUE");
    assertCodecError(() => decodeBatch(Uint8Array.of(1, 2, 0xaa)), "TRUNCATED");
    assertCodecError(() => decodeBatch(Uint8Array.of(0, 0)), "TRAILING_BYTES");
    assertCodecError(
      () =>
        decodeDetailedAcknowledgement(encodeFrame(MessageType.ACKNOWLEDGEMENT, new Uint8Array(16))),
      "TRUNCATED"
    );
    assertCodecError(
      () =>
        decodeStrictHello(
          encodeHello({
            actorId: new Uint8Array(16),
            revocationHandleHash: new Uint8Array(32),
            lastServerRevision: BigInt(0),
            causalSummary: [],
          })
        ),
      "INVALID_VALUE"
    );
    const strictHello = encodeHello({
      actorId: new Uint8Array(16),
      revocationHandleHash: new Uint8Array(32),
      lastServerRevision: BigInt(0),
      causalSummary: [],
      bootstrapId: new Uint8Array(16).fill(1),
      pendingBatchCount: 1,
    });
    assertCodecError(() => decodeStrictHello(strictHello.slice(0, -1)), "TRUNCATED");
    assertCodecError(
      () => decodeStrictHello(Uint8Array.from([...strictHello, 0])),
      "TRAILING_BYTES"
    );
    assertCodecError(
      () => decodeStrictHello(Uint8Array.from([...strictHello.slice(0, -1), 0x81, 0])),
      "INVALID_VALUE"
    );
    const envelope = encodeMutationBatchEnvelope({
      requestId: new Uint8Array(16),
      bootstrapId: new Uint8Array(16),
      batchIndex: 0,
      batchCount: 1,
      changes: [Uint8Array.of(0xaa)],
    });
    assertCodecError(() => decodeMutationBatchEnvelope(envelope.slice(0, -1)), "TRUNCATED");
    assertCodecError(
      () => decodeMutationBatchEnvelope(Uint8Array.from([...envelope, 0])),
      "INVALID_LENGTH"
    );
    assertCodecError(
      () =>
        decodeMutationBatchEnvelope(
          encodeFrame(
            MessageType.MUTATION_BATCH,
            Uint8Array.from([...new Uint8Array(16), ...new Uint8Array(16), 0x80, 0, 1, 1, 1, 0xaa])
          )
        ),
      "INVALID_VALUE"
    );
    assertCodecError(() => decodeSnapshotBegin(Uint8Array.of(0, 0, 0, 0)), "TRUNCATED");
    assertCodecError(() => decodeSnapshotBegin(Uint8Array.of(0, 0, 0, 0, 0)), "TRUNCATED");
    assertCodecError(() => decodeSnapshotChunk(Uint8Array.of(0, 0, 0)), "TRAILING_BYTES");
    assertCodecError(() => decodeSnapshotEnd(Uint8Array.of(0, 0, 0)), "INVALID_LENGTH");
    assertCodecError(
      () => decodeRejection(Uint8Array.of(RejectionCode.INVALID_RECORD, 2)),
      "INVALID_VALUE"
    );
    assertCodecError(
      () => encodeBatch(Array.from({ length: MAX_BATCH_CHANGES + 1 }, () => new Uint8Array())),
      "OVERSIZED"
    );
    assertCodecError(
      () =>
        encodeMutationBatchEnvelope({
          requestId: new Uint8Array(16),
          bootstrapId: new Uint8Array(16),
          batchIndex: 0,
          batchCount: MAX_PENDING_BATCHES + 1,
          changes: [Uint8Array.of(1)],
        }),
      "OVERSIZED"
    );
    assertCodecError(
      () => encodeFrame(MessageType.HELLO, new Uint8Array(MAX_FRAME_BYTES)),
      "OVERSIZED"
    );
  });

  it("preserves exact Problem Note text and enforces both text limits", () => {
    const note = "  first\n\nsecond  \u{1f600}";
    assert.equal(decodeProblemNoteText(encodeProblemNoteText(note)), note);
    assertCodecError(() => encodeProblemNoteText(String.fromCharCode(0xd800)), "INVALID_UTF8");
    assertCodecError(() => decodeProblemNoteText(Uint8Array.of(0xc3, 0x28)), "INVALID_UTF8");
    assertCodecError(() => encodeProblemNoteText("a".repeat(2001)), "OVERSIZED");
    assertCodecError(() => decodeProblemNoteText(new Uint8Array(8 * 1024 + 1)), "OVERSIZED");
    assertCodecError(() => encodeProblemNoteText("€".repeat(3000)), "OVERSIZED");
  });

  it("uses a canonical binary Progress shard record", () => {
    const shard = {
      adds: [
        {
          slug: "01-matrix",
          actorId: Uint8Array.from({ length: 16 }, () => 1),
          counter: BigInt(0),
        },
      ],
      removed: [
        {
          slug: "02-add-two-numbers",
          summary: [{ actorId: Uint8Array.from({ length: 16 }, () => 2), counter: BigInt(3) }],
        },
      ],
    };
    const encoded = encodeProgressShard(shard);
    assert.equal(
      hex(encoded),
      "010930312d6d61747269780101010101010101010101010101010100011230322d6164642d74776f2d6e756d62657273010202020202020202020202020202020203"
    );
    assert.deepEqual(decodeProgressShard(encoded), shard);
    assert.deepEqual(decodeProgressShard(encoded.buffer as ArrayBuffer), shard);
    assertCodecError(() => decodeProgressShard(encoded.slice(0, -1)), "TRUNCATED");
    assertCodecError(() => decodeProgressShard(Uint8Array.from([...encoded, 0])), "TRAILING_BYTES");
    assertCodecError(
      () =>
        decodeProgressShard(
          Uint8Array.from([2, 1, 97, ...new Uint8Array(16), 0, 1, 98, ...new Uint8Array(16), 0, 0])
        ),
      "INVALID_VALUE"
    );
  });

  it("round-trips a canonical aggregate Progress delta for arbitrary delivery", () => {
    const delta = {
      kind: "progress-delta" as const,
      causalSummary: [
        { actorId: Uint8Array.from({ length: 16 }, () => 2), counter: BigInt(4) },
        { actorId: Uint8Array.from({ length: 16 }, () => 1), counter: BigInt(7) },
      ],
      adds: [
        {
          slug: "01-matrix",
          actorId: Uint8Array.from({ length: 16 }, () => 1),
          counter: BigInt(7),
        },
      ],
      removed: [
        {
          slug: "02-add-two-numbers",
          summary: [{ actorId: Uint8Array.from({ length: 16 }, () => 2), counter: BigInt(4) }],
        },
      ],
    };
    const encoded = encodeMutationRecord(delta);
    assert.deepEqual(decodeMutationRecord(encoded), {
      ...delta,
      causalSummary: [
        { actorId: Uint8Array.from({ length: 16 }, () => 1), counter: BigInt(7) },
        { actorId: Uint8Array.from({ length: 16 }, () => 2), counter: BigInt(4) },
      ],
    });
    assertCodecError(
      () => decodeMutationRecord(Uint8Array.from([...encoded, 0])),
      "TRAILING_BYTES"
    );
  });

  it("checks snapshots over canonical records independently of chunk boundaries", () => {
    const first = Uint8Array.of(1, 2);
    const second = Uint8Array.of(3, 4, 5);
    const accumulator = new Crc32cAccumulator();
    accumulator.update(first).update(second);
    assert.equal(accumulator.digest(), snapshotChecksum([first, second]));
    assert.equal(accumulator.digest(), snapshotChecksum([Uint8Array.of(1, 2, 3, 4, 5)]));
    assert.equal(snapshotChecksum([]), 0);
  });

  it("keeps malformed seeded decoder input bounded and domain-free", () => {
    const domain = { appliedRecords: ["unchanged"] };
    let seed = 0x12345678;
    for (let iteration = 0; iteration < 2_000; iteration++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const length = seed % 256;
      const input = new Uint8Array(length);
      for (let index = 0; index < input.length; index++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        input[index] = seed & 0xff;
      }
      try {
        const frame = decodeFrame(input);
        assert.ok(frame.payload.length <= MAX_FRAME_BYTES);
      } catch (error) {
        assert.ok(error instanceof CodecError);
      }
      assert.deepEqual(domain, { appliedRecords: ["unchanged"] });
    }
  });
});
