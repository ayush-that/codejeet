import { AccountData } from "./lib/sync/account-do";
import { createSyncHandler } from "./lib/sync/http";
import { createWebSocketSyncHandler } from "./lib/sync/websocket";

import handler from "./src/entry-server";

export { AccountData };

const sync = createSyncHandler();
const websocket = createWebSocketSyncHandler();

export default {
  fetch(request: Request, env: CloudflareEnv): Promise<Response> {
    if (new URL(request.url).pathname === "/api/sync") {
      if (request.headers.get("upgrade")?.toLowerCase() === "websocket") {
        return websocket(request, env);
      }
      return sync(request, env);
    }
    return handler.fetch(request);
  },
} satisfies ExportedHandler<CloudflareEnv>;
