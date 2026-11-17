import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIEWPORT_CONTENT = "width=device-width, initial-scale=1, viewport-fit=cover";

export function patchMobileViewportHtml(html) {
  return html.replaceAll(
    /width=device-width, initial-scale=1(?!, viewport-fit=cover)/g,
    VIEWPORT_CONTENT,
  );
}

async function patchHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await patchHtmlFiles(fullPath);
      return;
    }
    if (!entry.name.endsWith(".html")) return;
    const html = await readFile(fullPath, "utf8");
    const patched = patchMobileViewportHtml(html);
    if (patched !== html) await writeFile(fullPath, patched);
  }));
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const clientDir = path.resolve(process.cwd(), "dist/client");
  await patchHtmlFiles(clientDir);
}
