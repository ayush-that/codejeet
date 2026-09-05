import { AccountData } from "./lib/sync/account-do";
import { createSyncHandler } from "./lib/sync/http";
import { createLoroSyncHandler } from "./lib/sync/loro-http";
import { createWebSocketSyncHandler } from "./lib/sync/websocket";

import handler from "./.open-next/worker.js";

export { AccountData };

const sync = createSyncHandler();
const loroSync = createLoroSyncHandler();
const websocket = createWebSocketSyncHandler();

export default {
  fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    if (new URL(request.url).pathname === "/api/sync") {
      if (request.headers.get("upgrade")?.toLowerCase() === "websocket") {
        return websocket(request, env);
      }
      return sync(request, env);
    }
    if (new URL(request.url).pathname === "/api/loro-sync") {
      return loroSync(request, env);
    }
    return handler.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<CloudflareEnv>;
