
import { withSensor as brekenWithSensor } from "../../../lib/breken-sensor";
export const dynamic = "force-dynamic";

 async function GET() {
  return Response.json(
    { ok: true },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}

// Scout observes API outcomes while preserving handler behavior.
const brekenGET = brekenWithSensor(GET, {"route":"/api/health","routeFile":"app/api/health/route.ts","problemJson":false,"reportThroughHook":true});
export { brekenGET as GET };
