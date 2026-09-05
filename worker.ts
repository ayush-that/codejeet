import { AccountData } from "./lib/sync/account-do";
import { createSyncHandler } from "./lib/sync/http";
import { createLoroSyncHandler } from "./lib/sync/loro-http";
import { createWebSocketSyncHandler } from "./lib/sync/websocket";
import { clerkWebhook, legacyNotes, legacyProgress, revocation } from "./lib/sync/solid-api";

import handler from "./src/entry-server";

export { AccountData };

const sync = createSyncHandler();
const loroSync = createLoroSyncHandler();
const websocket = createWebSocketSyncHandler();

export default {
  async fetch(request: Request, env: CloudflareEnv): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (path === "/api/sync") {
      if (request.headers.get("upgrade")?.toLowerCase() === "websocket") {
        return websocket(request, env);
      }
      return sync(request, env);
    }
    if (path === "/api/loro-sync") return loroSync(request, env);
    if (path === "/api/progress") return legacyProgress(request, env);
    if (path === "/api/notes") return legacyNotes(request, env);
    if (path === "/api/revocation") return revocation(request, env);
    if (path === "/api/webhooks/clerk") return clerkWebhook(request, env);
    return handler.fetch(request);
  },
} satisfies ExportedHandler<CloudflareEnv>;
