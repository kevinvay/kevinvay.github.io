import { cp, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, "dist", "client");
const outputRoot = path.join(projectRoot, "out");
const edgeOneFileLimit = 25 * 1024 * 1024;

await stat(path.join(sourceRoot, "index.html")).catch(() => {
  throw new Error("Missing dist/client/index.html. Run npm run build first.");
});

await rm(outputRoot, { recursive: true, force: true });
await cp(sourceRoot, outputRoot, {
  recursive: true,
  filter(source) {
    const relative = path.relative(sourceRoot, source);
    if (!relative) return true;

    const parts = relative.split(path.sep);
    const name = path.basename(source);
    return !parts.includes(".vite")
      && name !== ".DS_Store"
      && name !== ".assetsignore"
      && !name.endsWith(".rsc");
  },
});

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(absolutePath));
    else files.push(absolutePath);
  }

  return files;
}

const files = await collectFiles(outputRoot);
const oversized = [];

for (const file of files) {
  const { size } = await stat(file);
  if (size > edgeOneFileLimit) oversized.push(path.relative(outputRoot, file));
}

if (oversized.length) {
  throw new Error(`EdgeOne's 25 MB file limit is exceeded by: ${oversized.join(", ")}`);
}

const htmlFiles = files.filter((file) => file.endsWith(".html")).length;
console.log(`EdgeOne package ready: out/ (${files.length} files, ${htmlFiles} HTML pages)`);
