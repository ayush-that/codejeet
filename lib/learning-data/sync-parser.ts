import {
  CodecError,
  MAX_FRAME_BYTES,
  decodeFrame,
  decodeUnsignedLeb128,
  type Frame,
} from "../sync/codec";

/**
 * Incremental CJET envelope parser. It retains at most one incomplete frame,
 * emits complete frames as soon as they arrive, and never buffers a response.
 */
export class SyncFrameParser {
  private buffered = new Uint8Array();
  private ended = false;

  constructor(private readonly onFrame: (frame: Frame) => void) {}

  push(input: ArrayBuffer | Uint8Array): void {
    if (this.ended) throw new CodecError("parser already ended", "INVALID_VALUE");
    const chunk = input instanceof Uint8Array ? input : new Uint8Array(input);
    if (!chunk.length) return;
    if (this.buffered.length + chunk.length > MAX_FRAME_BYTES * 2) {
      throw new CodecError("stream contains an oversized buffered frame", "OVERSIZED");
    }
    const combined = new Uint8Array(this.buffered.length + chunk.length);
    combined.set(this.buffered);
    combined.set(chunk, this.buffered.length);
    this.buffered = combined;

    while (this.buffered.length) {
      if (this.buffered.length < 7) return;
      let payloadLength: number;
      let lengthEnd: number;
      try {
        const decoded = decodeUnsignedLeb128(this.buffered, 6);
        if (decoded.value > BigInt(MAX_FRAME_BYTES)) {
          throw new CodecError("frame exceeds the 64 KiB envelope limit", "OVERSIZED");
        }
        payloadLength = Number(decoded.value);
        lengthEnd = decoded.offset;
      } catch (error) {
        if (error instanceof CodecError && error.code === "TRUNCATED") return;
        throw error;
      }
      const frameLength = lengthEnd + payloadLength + 4;
      if (frameLength > MAX_FRAME_BYTES) {
        throw new CodecError("frame exceeds the 64 KiB envelope limit", "OVERSIZED");
      }
      if (this.buffered.length < frameLength) return;
      const frame = this.buffered.slice(0, frameLength);
      this.buffered = this.buffered.slice(frameLength);
      this.onFrame(decodeFrame(frame));
    }
  }

  finish(): void {
    this.ended = true;
    if (this.buffered.length) {
      throw new CodecError("truncated sync response", "TRUNCATED");
    }
  }
}

export function parseSyncFrames(chunks: Iterable<ArrayBuffer | Uint8Array>): Frame[] {
  const frames: Frame[] = [];
  const parser = new SyncFrameParser((frame) => frames.push(frame));
  for (const chunk of chunks) parser.push(chunk);
  parser.finish();
  return frames;
}
