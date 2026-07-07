import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Only spin up the dev binding proxy (miniflare) during `next dev`. next.config is
// also loaded during `next build`, where calling this starts miniflare and its
// workerd subprocess throws an intermittent `unhandledRejection: write EPIPE` that
// aborts the build. It is purely a dev convenience (exposes D1 etc. to `next dev`);
// the deployed Worker uses the real Cloudflare bindings and never runs this.
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;
