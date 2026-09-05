import type { LoroDoc } from "loro-crdt";

type RemoteUpdate = { revision: number; update: string };
type PullResponse = { revision: number; updates: RemoteUpdate[] };

export type LoroTokenProvider = () => Promise<string | null>;
export type LoroFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

function decodeBase64(value: string): Uint8Array {
  if (
    typeof value !== "string" ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)
  ) {
    throw new Error("Loro server update is not base64");
  }
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function assertPullResponse(value: unknown): PullResponse {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Loro pull response is invalid");
  const result = value as Partial<PullResponse>;
  const revision = result.revision;
  if (
    typeof revision !== "number" ||
    !Number.isSafeInteger(revision) ||
    revision < 0 ||
    !Array.isArray(result.updates)
  ) {
    throw new Error("Loro pull response is invalid");
  }
  for (const entry of result.updates) {
    if (
      !entry ||
      !Number.isSafeInteger(entry.revision) ||
      entry.revision < 1 ||
      typeof entry.update !== "string"
    ) {
      throw new Error("Loro pull response is invalid");
    }
  }
  return result as PullResponse;
}

export class LoroRemoteReplica {
  private revision = 0;

  constructor(
    private readonly token: LoroTokenProvider,
    private readonly transport: LoroFetch = fetch,
    private readonly endpoint = "/api/loro-sync"
  ) {}

  async pull(doc: LoroDoc): Promise<number> {
    const token = await this.token();
    if (!token) return this.revision;
    const response = await this.transport(`${this.endpoint}?after=${this.revision}`, {
      method: "POST",
      credentials: "same-origin",
      headers: { Authorization: `Bearer ${token}`, "X-Loro-Pull": "1" },
    });
    if (!response.ok) throw new Error(`Loro pull failed with HTTP ${response.status}`);
    const result = assertPullResponse(await response.json());
    for (const entry of result.updates) doc.import(decodeBase64(entry.update));
    this.revision = result.revision;
    return this.revision;
  }

  async push(doc: LoroDoc, from: ReturnType<LoroDoc["oplogVersion"]>): Promise<number> {
    const token = await this.token();
    if (!token) return this.revision;
    const update = doc.export({ mode: "update", from });
    if (!update.byteLength) return this.revision;
    const response = await this.transport(this.endpoint, {
      method: "POST",
      credentials: "same-origin",
      body: update.slice().buffer,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/octet-stream" },
    });
    if (!response.ok) throw new Error(`Loro push failed with HTTP ${response.status}`);
    const result = (await response.json()) as { revision?: unknown };
    if (!Number.isSafeInteger(result.revision) || (result.revision as number) < 1) {
      throw new Error("Loro push response is invalid");
    }
    this.revision = result.revision as number;
    return this.revision;
  }
}
