import { createClerkClient } from "@clerk/backend";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { accountRouteName } from "./account-route";
import {
  checkRevocationHandle,
  consumeRevocationRateLimit,
  handleClerkUserDeletedWebhook,
} from "./account-deletion";
import {
  applyLegacyNote,
  applyLegacyProgress,
  getLegacyNotes,
  getLegacyProgress,
} from "./legacy-adapters";
import { isValidProblemRegistrySlug } from "../problem-registry";
import { parseNotesPostBody } from "../../utils/notesUtils";

type ApiEnvironment = CloudflareEnv & {
  CLERK_SECRET_KEY?: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  CLERK_WEBHOOK_SIGNING_SECRET?: string;
  SYNC_HMAC_SECRET?: string;
};

async function userId(request: Request, env: ApiEnvironment): Promise<string | null> {
  if (!env.CLERK_SECRET_KEY || !env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  const client = createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
  const state = await client.authenticateRequest(request, {
    acceptsToken: "session_token",
    authorizedParties: [new URL(request.url).origin],
  });
  const auth = state.toAuth();
  return auth?.isAuthenticated ? auth.userId : null;
}

export async function legacyProgress(request: Request, env: ApiEnvironment): Promise<Response> {
  const id = await userId(request, env).catch(() => null);
  if (request.method === "GET")
    return Response.json(id ? await getLegacyProgress(env, id) : { progress: {} });
  if (request.method !== "POST") return new Response(null, { status: 405 });
  if (!id) return new Response("Unauthorized", { status: 401 });
  let body: { slug?: unknown; completed?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!isValidProblemRegistrySlug(body.slug)) return new Response("Invalid slug", { status: 400 });
  if (typeof body.completed !== "boolean")
    return new Response("Invalid completed value", { status: 400 });
  await applyLegacyProgress(env, id, body.slug, body.completed);
  return Response.json({ ok: true });
}

export async function legacyNotes(request: Request, env: ApiEnvironment): Promise<Response> {
  const id = await userId(request, env).catch(() => null);
  if (request.method === "GET")
    return Response.json(id ? await getLegacyNotes(env, id) : { notes: {}, updatedAt: {} });
  if (request.method !== "POST") return new Response(null, { status: 405 });
  if (!id) return new Response("Unauthorized", { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  const parsed = parseNotesPostBody(body);
  if (!parsed.ok) return new Response(parsed.error, { status: parsed.status });
  await applyLegacyNote(env, id, parsed.slug, parsed.note);
  return Response.json({ ok: true });
}

export async function revocation(request: Request, env: ApiEnvironment): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  if (!env.DB || !env.SYNC_HMAC_SECRET) return new Response(null, { status: 503 });
  const address = request.headers.get("cf-connecting-ip")?.slice(0, 128) || "anonymous";
  if (!(await consumeRevocationRateLimit({ DB: env.DB }, env.SYNC_HMAC_SECRET, address)))
    return new Response(null, { status: 429 });
  const data = new Uint8Array(await request.arrayBuffer());
  if (data.length !== 32) return new Response(null, { status: 400 });
  return Response.json(await checkRevocationHandle({ DB: env.DB }, data), {
    headers: { "cache-control": "no-store" },
  });
}

export async function clerkWebhook(request: Request, env: ApiEnvironment): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  if (!env.CLERK_WEBHOOK_SIGNING_SECRET || !env.SYNC_HMAC_SECRET)
    return new Response(null, { status: 503 });
  return handleClerkUserDeletedWebhook(
    request,
    async (id) => {
      const route = await accountRouteName(env.SYNC_HMAC_SECRET!, id);
      await env.ACCOUNT_DATA.getByName(route).deleteAccount(id, route);
    },
    (incoming) => verifyWebhook(incoming, { signingSecret: env.CLERK_WEBHOOK_SIGNING_SECRET! })
  );
}
