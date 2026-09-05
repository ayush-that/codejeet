import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import { solidStart } from "@solidjs/start/config";

export default defineConfig({
  plugins: [cloudflare({ viteEnvironment: { name: "ssr" } }), solidStart()],
});
