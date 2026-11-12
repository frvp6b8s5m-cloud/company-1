import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const html = await readFile(resolve(root, "index.html"), "utf8");
const css = await readFile(resolve(root, "styles.css"), "utf8");
const soundmatchCss = await readFile(resolve(root, "soundmatch.css"), "utf8");
const experienceCss = await readFile(resolve(root, "experience.css"), "utf8");
const js = await readFile(resolve(root, "script.js"), "utf8");
const soundmatchJs = await readFile(resolve(root, "soundmatch.js"), "utf8");
const config = await readFile(resolve(root, "site-config.js"), "utf8");
const sourceBytes = {
  html: Buffer.byteLength(html),
  css: Buffer.byteLength(css) + Buffer.byteLength(soundmatchCss) + Buffer.byteLength(experienceCss),
  javascript: Buffer.byteLength(js) + Buffer.byteLength(soundmatchJs),
  config: Buffer.byteLength(config)
};
assert.ok(sourceBytes.html < 45_000, "HTML source stays under the 45 KB source budget");
assert.ok(sourceBytes.css < 80_000, "Combined CSS stays under the 80 KB source budget");
assert.ok(sourceBytes.javascript < 40_000, "Combined JavaScript stays under the 40 KB source budget");
assert.ok(sourceBytes.config < 2_000, "Site configuration stays lightweight");

const desktopHero = "https://images.pexels.com/photos/34612567/pexels-photo-34612567.jpeg?auto=compress&cs=tinysrgb&w=2200";
const mobileHero = "https://images.pexels.com/photos/34612567/pexels-photo-34612567.jpeg?auto=compress&cs=tinysrgb&w=1200";
assert.ok(html.includes(`href="${desktopHero.replaceAll("&", "&amp;")}" media="(min-width: 681px)"`), "Desktop hero preload must match the desktop responsive image");
assert.ok(html.includes(`href="${mobileHero.replaceAll("&", "&amp;")}" media="(max-width: 680px)"`), "Mobile hero preload must match the mobile responsive image");
const heroTag = html.match(/<img\b[^>]*class="hero-image"[^>]*>/)?.[0] || "";
assert.ok(heroTag.includes(desktopHero.replaceAll("&", "&amp;")), "Desktop hero source must be available in the responsive image set");
assert.ok(heroTag.includes(mobileHero.replaceAll("&", "&amp;")), "Mobile hero source must be available in the responsive image set");

const imageUrls = [...new Set([...html.matchAll(/https:\/\/images\.pexels\.com\/photos\/\d+\/[^\s"'<>]+/g)].map((match) => match[0].replaceAll("&amp;", "&")))];
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
  await mkdir(resolve(root, "artifacts/visual-review"), { recursive: true });
  for (const viewport of [{ width: 390, height: 844, name: "mobile-390" }, { width: 768, height: 1024, name: "tablet-768" }, { width: 1440, height: 900, name: "desktop-1440" }]) {
    const reviewPage = await browser.newPage({ viewport });
    await reviewPage.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: "load" });
    await reviewPage.waitForTimeout(1600);
    await reviewPage.screenshot({ path: resolve(root, `artifacts/visual-review/${viewport.name}-first-screen.png`) });
    const documentHeight = await reviewPage.evaluate(() => document.documentElement.scrollHeight);
    const scrollStep = Math.max(350, Math.floor(viewport.height * 0.75));
    for (let y = 0; y < documentHeight; y += scrollStep) {
      await reviewPage.evaluate((position) => window.scrollTo(0, position), y);
      await reviewPage.waitForTimeout(120);
    }
    await reviewPage.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0), null, { timeout: 20000 });
    await reviewPage.waitForTimeout(1300);
    await reviewPage.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, 0); });
    await reviewPage.waitForTimeout(150);
    await reviewPage.addStyleTag({ content: ".site-header{position:static!important;top:auto!important}" });
    await reviewPage.screenshot({ path: resolve(root, `artifacts/visual-review/${viewport.name}.png`), fullPage: true });
    await reviewPage.close();
  }
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
  console.log(JSON.stringify({ sourceBytes, imageChecks, browserMetrics: metrics }, null, 2));
  await page.close();
  console.log("BZaudio performance and CDN delivery smoke checks passed.");
} finally {
  await browser.close();
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()));
}
