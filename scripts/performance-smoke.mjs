import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const html = await readFile(resolve(root, "index.html"), "utf8");
const css = await readFile(resolve(root, "styles.css"), "utf8");
const js = await readFile(resolve(root, "script.js"), "utf8");
const config = await readFile(resolve(root, "site-config.js"), "utf8");
assert.ok(html.length < 30_000, "HTML source stays under the 30 KB source budget");
assert.ok(css.length < 50_000, "CSS source stays under the 50 KB source budget");
assert.ok(js.length < 30_000, "JavaScript source stays under the 30 KB source budget");
assert.ok(config.length < 2_000, "Site configuration stays lightweight");

const imageUrls = [...new Set([...css.matchAll(/https:\/\/images\.pexels\.com\/photos\/\d+\/[^")]+/g)].map((match) => match[0]))];
const imageById = new Map();
for (const url of imageUrls) {
  const id = url.match(/photos\/(\d+)/)?.[1];
  if (id && !imageById.has(id)) imageById.set(id, url);
}
assert.ok(imageById.size >= 3, "At least three licensed photography sources are referenced");

const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8" };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    const file = resolve(root, relative);
    if (file !== root && !file.startsWith(root + sep)) throw new Error("Invalid path");
    response.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
try {
  const imageChecks = [];
  for (const [id, url] of [...imageById.entries()].slice(0, 3)) {
    const started = Date.now();
    const response = await browser.newPage().then(async (page) => {
      const result = await page.request.get(url, { timeout: 20000 });
      await page.close();
      return result;
    });
    const type = response.headers()["content-type"] || "";
    const bytes = Number(response.headers()["content-length"] || 0);
    assert.equal(response.status(), 200, `Pexels image ${id} must return HTTP 200`);
    assert.ok(type.startsWith("image/"), `Pexels image ${id} must return an image content type`);
    assert.ok(!bytes || bytes < 2_500_000, `Pexels image ${id} must remain below the 2.5 MB transfer budget`);
    imageChecks.push({ id, status: response.status(), contentType: type, bytes: bytes || null, durationMs: Date.now() - started });
  }

  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  const address = server.address();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const response = await page.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: "load" });
  assert.equal(response.status(), 200, "Homepage must load");
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByType("paint");
    return {
      domContentLoadedMs: Math.round(nav?.domContentLoadedEventEnd || 0),
      loadEventMs: Math.round(nav?.loadEventEnd || 0),
      firstContentfulPaintMs: Math.round(paint.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0)
    };
  });
  console.log(JSON.stringify({ sourceBytes: { html: html.length, css: css.length, javascript: js.length, config: config.length }, imageChecks, browserMetrics: metrics }, null, 2));
  await page.close();
  console.log("BZaudio performance and CDN delivery smoke checks passed.");
} finally {
  await browser.close();
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()));
}
