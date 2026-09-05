import path from "node:path";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest(async () => ({
      main: "tests/workers/worker.ts",
      miniflare: {
        d1Databases: ["DB"],
        durableObjects: { ACCOUNT_DATA: "AccountData" },
        bindings: {
          TEST_MIGRATIONS: await readD1Migrations(path.resolve("migrations")),
          SYNC_HMAC_SECRET: "workers-test-secret",
          SYNC_ORIGIN: "https://example.test",
        },
      },
    })),
  ],
  test: {
    fileParallelism: false,
    include: ["tests/workers/**/*.test.ts"],
    setupFiles: ["tests/workers/setup.ts"],
  },
});
