import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";
import { patchMobileViewportHtml } from "./scripts/patch-mobile-viewport.mjs";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      {
        name: "mobile-viewport",
        transform(code: string, id: string) {
          if (!id.replaceAll("\\", "/").includes("vinext/dist/shims/metadata.js")) return null;
          if (code.includes("viewport-fit=cover")) return null;
          const needle = "if (viewport.initialScale !== void 0) parts.push(`initial-scale=${viewport.initialScale}`);";
          if (!code.includes(needle)) return null;
          return code.replace(needle, `${needle}\n\tparts.push("viewport-fit=cover");`);
        },
        transformIndexHtml(html: string) {
          return patchMobileViewportHtml(html);
        },
      },
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
        // Codex's sandbox permits the preview server but not the Worker inspector.
        inspectorPort: isCodexSeatbeltSandbox ? false : undefined,
      }),
    ],
  };
});
