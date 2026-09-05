import { accountRouteName } from "./account-route";
import { isAccountDeleted } from "./account-deletion";

const MAX_UPDATE_BYTES = 512 * 1024;

type LoroEnvironment = CloudflareEnv & {
  SYNC_HMAC_SECRET: string;
  SYNC_ORIGIN: string;
};

type Authenticator = (
  request: Request,
  env: LoroEnvironment,
  origin: string
) => Promise<string | null>;

export type LoroSyncHandlerOptions = { authenticate?: Authenticator };

function encodeBase64(bytes: Uint8Array): string {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}

async function authenticateWithClerk(
  request: Request,
  env: LoroEnvironment,
  origin: string
): Promise<string | null> {
  if (!env.CLERK_SECRET_KEY || !env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  const { createClerkClient } = await import("@clerk/nextjs/server");
  const client = createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
  const state = await client.authenticateRequest(request, {
    acceptsToken: "session_token",
    authorizedParties: [origin],
  });
  if (!state.isAuthenticated) return null;
  const auth = state.toAuth();
  return auth?.isAuthenticated ? auth.userId : null;
}

function response(value: unknown, status = 200): Response {
  return Response.json(value, { status, headers: { "cache-control": "no-store" } });
}

async function body(request: Request): Promise<Uint8Array | null> {
  const size = request.headers.get("content-length");
  if (size !== null && (!/^\d+$/.test(size) || Number(size) > MAX_UPDATE_BYTES)) return null;
  const value = new Uint8Array(await request.arrayBuffer());
  return value.byteLength && value.byteLength <= MAX_UPDATE_BYTES ? value : null;
}

export function createLoroSyncHandler(options: LoroSyncHandlerOptions = {}) {
  const authenticate = options.authenticate ?? authenticateWithClerk;
  return async function handleLoroSync(request: Request, env: LoroEnvironment): Promise<Response> {
    if (!env.SYNC_HMAC_SECRET) return response({ error: "unavailable" }, 503);
    const origin = request.headers.get("origin");
    if (!origin || origin !== env.SYNC_ORIGIN) return response({ error: "forbidden" }, 403);
    let accountId: string | null;
    try {
      accountId = await authenticate(request, env, origin);
    } catch {
      return response({ error: "unauthorized" }, 401);
    }
    if (!accountId) return response({ error: "unauthorized" }, 401);
    const route = await accountRouteName(env.SYNC_HMAC_SECRET, accountId);
    if (env.DB && (await isAccountDeleted({ DB: env.DB }, route))) {
      return response({ error: "deleted" }, 410);
    }
    const stub = env.ACCOUNT_DATA.getByName(route);
    if (request.method === "GET") {
      const after = new URL(request.url).searchParams.get("after") ?? "0";
      if (!/^(0|[1-9][0-9]*)$/.test(after)) return response({ error: "invalid_revision" }, 400);
      const log = await stub.loroUpdates(accountId, Number(after));
      return response({
        revision: log.revision,
        updates: log.updates.map((entry: { revision: number; update: Uint8Array }) => ({
          revision: entry.revision,
          update: encodeBase64(entry.update),
        })),
      });
    }
    if (request.method !== "POST") return response({ error: "method_not_allowed" }, 405);
    if (
      request.headers.get("content-type")?.split(";", 1)[0].trim() !== "application/octet-stream"
    ) {
      return response({ error: "unsupported_media_type" }, 415);
    }
    const update = await body(request);
    if (!update) return response({ error: "invalid_update" }, 413);
    const revision = await stub.appendLoroUpdate(accountId, update);
    return response({ revision }, 201);
  };
}
