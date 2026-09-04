import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Workers Builds has no Bun; committed bun.lock made OpenNext run `bun run build`.
const config = defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  enableCacheInterception: true,
});

const openNextConfig = {
  ...config,
  buildCommand: "CI=true pnpm run build",
};

export default openNextConfig;
