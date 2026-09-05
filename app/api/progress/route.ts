import { auth } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isValidProblemRegistrySlug } from "@/lib/problem-registry";
import { applyLegacyProgress, getLegacyProgress } from "@/lib/sync/legacy-adapters";

// Reads Clerk identity + the D1 binding at request time — must be dynamic.
export const dynamic = "force-dynamic";

// GET -> { progress: { [slug]: solvedAtISO } }. Signed-out returns an empty map
// (200, not a redirect) so the client can call it unconditionally.
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ progress: {} });
  return Response.json(await getLegacyProgress(getCloudflareContext().env, userId));
}

// POST { slug, completed }. Check -> insert keeping the original solve date
// (ON CONFLICT DO NOTHING, so the revision clock never resets). Uncheck -> delete.
// user_id always comes from the server session, never the request body.
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  let body: { slug?: unknown; completed?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { slug, completed } = body;
  if (!isValidProblemRegistrySlug(slug)) {
    return new Response("Invalid slug", { status: 400 });
  }
  if (typeof completed !== "boolean") {
    return new Response("Invalid completed value", { status: 400 });
  }

  await applyLegacyProgress(getCloudflareContext().env, userId, slug, completed);

  return Response.json({ ok: true });
}
