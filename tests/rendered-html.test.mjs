import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the portfolio with optimized loading hints", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Kevin Wu(?:&#x27;|')s Portfolio<\/title>/i);
  assert.match(html, /Ideas, craft and creativity/i);
  assert.match(html, /src="\/figma-assets\/hero-e\.webp"[^>]*loading="eager"/i);
  assert.match(html, /src="\/figma-assets\/work-rebrand\.webp"[^>]*srcSet=/i);
  assert.match(html, /loading="lazy" decoding="async"/i);
  assert.doesNotMatch(html, /\/figma-assets\/(?!emoji\/)[^"']+\.(?:png|jpe?g|gif)/i);
});

test("ships responsive WebP images and subset WOFF2 fonts", async () => {
  const [component, manifest, css] = await Promise.all([
    readFile(new URL("../app/components/optimized-image.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/optimized-images.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(component, /srcSet/);
  assert.match(component, /sizes/);
  assert.match(component, /loading \?\? "lazy"/);
  assert.match(component, /decoding = "async"/);
  assert.match(manifest, /work-mould-720\.webp/);
  assert.match(manifest, /work-mould-1360\.webp/);
  assert.match(css, /FKDisplay-Regular\.woff2/);
  assert.match(css, /MiSans-Regular\.woff2/);
  assert.doesNotMatch(css, /\.ttf|format\("truetype"\)/);
});
