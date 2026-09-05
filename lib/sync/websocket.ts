import { RejectionCode, encodeRejectionFrame } from "./codec";
import { accountRouteName } from "./account-route";
import { isAccountDeleted } from "./account-deletion";
import {
  failureForRejection,
  recordTransportDiagnostic,
  rejectionForFailure,
  transportFailure,
} from "./transport-diagnostics";

type SyncEnvironment = CloudflareEnv & {
  SYNC_HMAC_SECRET: string;
  SYNC_ORIGIN: string;
};

type WebSocketIdentity = { accountId: string; expiresAt: number };
type WebSocketAuthenticator = (
  request: Request,
  env: SyncEnvironment,
  origin: string
) => Promise<WebSocketIdentity | null>;

export type WebSocketSyncHandlerOptions = {
  authenticate?: WebSocketAuthenticator;
  now?: () => number;
};

function rejection(code: RejectionCode, status: number): Response {
  void recordTransportDiagnostic({
    eventCode: "request_rejected",
    failureCode: failureForRejection(code),
    protocolVersion: 1,
  });
  return new Response(encodeRejectionFrame({ code, itemIndex: null }).buffer as ArrayBuffer, {
    status,
    headers: {
      "content-type": "application/octet-stream",
      "cache-control": "no-store",
    },
  });
}

async function authenticateWithClerk(
  request: Request,
  env: SyncEnvironment,
  origin: string
): Promise<WebSocketIdentity | null> {
  if (!env.CLERK_SECRET_KEY || !env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  try {
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
    const expiresAt = auth?.sessionClaims?.exp;
    if (!auth?.isAuthenticated || !auth.userId || typeof expiresAt !== "number") return null;
    return { accountId: auth.userId, expiresAt };
  } catch {
    return null;
  }
}

export function createWebSocketSyncHandler(options: WebSocketSyncHandlerOptions = {}) {
  const authenticate = options.authenticate ?? authenticateWithClerk;
  const now = options.now ?? (() => Date.now());
  return async function handleWebSocket(request: Request, env: SyncEnvironment): Promise<Response> {
    if (!env.SYNC_HMAC_SECRET) return rejection(RejectionCode.TRANSIENT_FAILURE, 503);
    if (request.method !== "GET") return rejection(RejectionCode.INVALID_FRAME, 405);
    const origin = request.headers.get("origin");
    if (!origin || origin !== env.SYNC_ORIGIN) {
      return rejection(RejectionCode.AUTHENTICATION_REQUIRED, 403);
    }
    if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return rejection(RejectionCode.INVALID_FRAME, 426);
    }
    let identity: WebSocketIdentity | null;
    try {
      identity = await authenticate(request, env, origin);
    } catch {
      await recordTransportDiagnostic({
        eventCode: "request_rejected",
        failureCode: "authentication_invalid",
        protocolVersion: 1,
      });
      return rejection(RejectionCode.AUTHENTICATION_REQUIRED, 401);
    }
    if (!identity) return rejection(RejectionCode.AUTHENTICATION_REQUIRED, 401);
    if (
      !Number.isSafeInteger(identity.expiresAt) ||
      identity.expiresAt <= Math.floor(now() / 1000)
    ) {
      return rejection(RejectionCode.AUTHENTICATION_REQUIRED, 401);
    }
    try {
      const route = await accountRouteName(env.SYNC_HMAC_SECRET, identity.accountId);
      if (env.DB && (await isAccountDeleted({ DB: env.DB }, route)))
        return rejection(RejectionCode.ACCOUNT_DELETED, 410);
      const headers = new Headers(request.headers);
      headers.set("x-cjet-account-id", identity.accountId);
      headers.set("x-cjet-route", route);
      headers.set("x-cjet-session-expiry", String(identity.expiresAt));
      const stub = env.ACCOUNT_DATA.getByName(route);
      return stub.fetch(new Request(request, { headers }));
    } catch (error) {
      const failure = transportFailure(error);
      await recordTransportDiagnostic({
        eventCode: "request_rejected",
        failureCode: failure.code,
        protocolVersion: 1,
        accountId: identity.accountId,
      });
      const code = rejectionForFailure(failure.code);
      return rejection(code, code === RejectionCode.ACCOUNT_DELETED ? 410 : 503);
    }
  };
}
