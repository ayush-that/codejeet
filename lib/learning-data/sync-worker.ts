import { createIndexedDbAccountCache } from "./account-cache";
import { HttpRecoverySyncClient, WebSocketSyncClient, type SyncClientContext } from "./sync-client";

type WorkerMessage = ({ kind: "start" } & SyncClientContext) | { kind: "stop" };

const cache = createIndexedDbAccountCache();
const recovery = new HttpRecoverySyncClient(cache);
const client = new WebSocketSyncClient(cache, recovery);
let runToken = 0;

const workerScope = globalThis as typeof globalThis & {
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null;
};

workerScope.onmessage = (event) => {
  const message = event.data;
  if (message.kind === "stop") {
    runToken += 1;
    client.stop();
    return;
  }
  const token = ++runToken;
  void (async () => {
    const activation = await cache.activate(message.accountId);
    if (!activation.ok || token !== runToken) return;
    if (token === runToken) client.start(message);
  })();
};
