// Minimal, hand-written Cloudflare binding types for getCloudflareContext().env.
// We deliberately do NOT use `wrangler types` / @cloudflare/workers-types here:
// those globally override DOM types (e.g. Response.json() -> unknown), which
// breaks the browser-typed client code throughout this Next.js app.

interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result<never>>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = Record<string, unknown>>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

interface DurableObjectStub<T = unknown> {
  id: { toString(): string };
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

type TypedDurableObjectStub<T> = DurableObjectStub<T> & T;

interface DurableObjectNamespace<T = unknown> {
  getByName(name: string): TypedDurableObjectStub<T>;
}

interface ExportedHandler<Env = unknown> {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Response | Promise<Response>;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface DurableObjectState {
  id: { toString(): string; name?: string };
  acceptWebSocket(socket: WebSocket, tags?: string[]): void;
  getWebSockets(tag?: string): WebSocket[];
  storage: {
    setAlarm(scheduledTime: number | Date): Promise<void>;
    deleteAlarm(): Promise<void>;
  };
}

interface WebSocket {
  accept(): void;
  serializeAttachment(value: unknown): void;
  deserializeAttachment(): unknown;
}

interface WebSocketPair {
  0: WebSocket;
  1: WebSocket;
}

declare const WebSocketPair: {
  new (): WebSocketPair;
};

interface ResponseInit {
  webSocket?: WebSocket;
}

declare module "cloudflare:workers" {
  const env: CloudflareEnv;
  export { env };

  export class DurableObject<Env = unknown> {
    protected readonly ctx: DurableObjectState;
    protected readonly env: Env;
    constructor(ctx: DurableObjectState, env: Env);
  }
}

// Merged into OpenNext's global CloudflareEnv used by getCloudflareContext().
interface CloudflareEnv {
  DB: D1Database;
  SYNC_HMAC_SECRET: string;
  SYNC_ORIGIN: string;
  TEST_MIGRATIONS: { name: string; queries: string[] }[];
  ACCOUNT_DATA: DurableObjectNamespace<import("./lib/sync/account-do").AccountData>;
  ASSETS: { fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> };
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  CLERK_WEBHOOK_SIGNING_SECRET: string;
}
