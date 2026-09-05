import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import { solidStart } from "@solidjs/start/config";

export default defineConfig({
  define: {
    "import.meta.env.VITE_CLERK_PUBLISHABLE_KEY": JSON.stringify(
      process.env.VITE_CLERK_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""
    ),
  },
  plugins: [cloudflare({ viteEnvironment: { name: "ssr" } }), solidStart()],
});
