
import { withSensor as brekenWithSensor } from "../../../lib/breken-sensor";
import { auth } from "@clerk/nextjs/server";
import { getDatabasePool } from "@/lib/database";
import { handleProgressGet, handleProgressPost } from "@/lib/progress-api";
import { listProgress, setProgress } from "@/lib/user-data-repository";

// Reads Clerk identity + the D1 binding at request time — must be dynamic.
export const dynamic = "force-dynamic";

function dependencies() {
  const pool = getDatabasePool();
  return {
    getUserId: async () => (await auth()).userId,
    listProgress: (userId: string) => listProgress(pool, userId),
    setProgress: (userId: string, slug: string, completed: boolean, now: string) =>
      setProgress(pool, userId, slug, completed, now),
    now: () => new Date().toISOString(),
    readOnly: process.env.USER_DATA_READ_ONLY === "1",
  };
}

// GET -> { progress: { [slug]: solvedAtISO } }. Signed-out returns an empty map
// (200, not a redirect) so the client can call it unconditionally.
 async function GET() {
  return handleProgressGet(dependencies());
}

// POST { slug, completed }. Check -> insert keeping the original solve date
// (ON CONFLICT DO NOTHING, so the revision clock never resets). Uncheck -> delete.
// user_id always comes from the server session, never the request body.
 async function POST(req: Request) {
  return handleProgressPost(req, dependencies());
}

// Scout observes API outcomes while preserving handler behavior.
const brekenGET = brekenWithSensor(GET, {"route":"/api/progress","routeFile":"app/api/progress/route.ts","problemJson":false,"reportThroughHook":true});
export { brekenGET as GET };
const brekenPOST = brekenWithSensor(POST, {"route":"/api/progress","routeFile":"app/api/progress/route.ts","problemJson":false,"reportThroughHook":true});
export { brekenPOST as POST };
