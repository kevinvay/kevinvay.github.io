import { execFileSync } from "node:child_process";
import { readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../public/figma-assets/", import.meta.url));
const manifestPath = fileURLToPath(new URL("../app/optimized-images.json", import.meta.url));
const rasterExtensions = new Set([".png", ".jpg", ".jpeg"]);
const manifest = {};

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function dimensions(path) {
  const output = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", path], { encoding: "utf8" });
  return {
    width: Number(output.match(/pixelWidth: (\d+)/)?.[1]),
    height: Number(output.match(/pixelHeight: (\d+)/)?.[1]),
  };
}

function publicPath(path) {
  return `/figma-assets/${relative(root, path)}`;
}

function encodeRaster(source) {
  const extension = extname(source).toLowerCase();
  const destination = source.slice(0, -extension.length) + ".webp";
  const { width, height } = dimensions(source);
  const bytes = statSync(source).size;
  const isCover = /\/work-[^/]+\.(png|jpe?g)$/i.test(source);
  const baseOptions = !isCover && bytes < 100_000 && extension === ".png"
    ? ["-quiet", "-lossless", "-z", "9", "-mt"]
    : ["-quiet", "-q", isCover ? "88" : "90", "-alpha_q", "100", "-m", "6", "-mt"];

  execFileSync("cwebp", [...baseOptions, source, "-o", destination]);

  const variants = [];
  for (const variantWidth of [720, 1360]) {
    if (width <= variantWidth * 1.1) continue;
    const variant = destination.replace(/\.webp$/, `-${variantWidth}.webp`);
    execFileSync("cwebp", [...baseOptions, "-resize", String(variantWidth), "0", source, "-o", variant]);
    if (statSync(variant).size >= statSync(destination).size) {
      unlinkSync(variant);
      continue;
    }
    variants.push({ src: publicPath(variant), width: variantWidth });
  }

  variants.push({ src: publicPath(destination), width });
  manifest[publicPath(destination)] = { width, height, variants };
}

function encodeGif(source) {
  const destination = source.replace(/\.gif$/i, ".webp");
  execFileSync("gif2webp", ["-quiet", "-q", "90", "-m", "6", "-mt", source, "-o", destination]);
  const { width, height } = dimensions(source);
  manifest[publicPath(destination)] = { width, height, variants: [{ src: publicPath(destination), width }] };
}

for (const source of walk(root)) {
  const extension = extname(source).toLowerCase();
  if (rasterExtensions.has(extension)) encodeRaster(source);
  if (extension === ".gif") encodeGif(source);
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Optimized ${Object.keys(manifest).length} raster assets.`);
