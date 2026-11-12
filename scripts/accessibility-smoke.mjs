import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import axe from "axe-core";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
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
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  const address = server.address();
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
    await page.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: "domcontentloaded" });
    const overflow = await page.evaluate(() => ({ page: document.documentElement.scrollWidth > window.innerWidth, elements: [...document.querySelectorAll("*")].map((element) => { const rect = element.getBoundingClientRect(); return { tag: element.tagName, id: element.id, className: typeof element.className === "string" ? element.className : "", left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }; }).filter((item) => item.right > window.innerWidth + 1 || item.left < -1).slice(0, 12) }));
    if (overflow.page) console.log(JSON.stringify({ viewport, overflowingElements: overflow.elements }));
    assert.equal(overflow.page, false, `No horizontal page overflow at ${viewport.width}px`);
    await page.addScriptTag({ content: axe.source });
    const results = await page.evaluate(async () => window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }
    }));
    const failures = results.violations.filter((item) => ["critical", "serious"].includes(item.impact));
    if (results.violations.length) {
      console.log(JSON.stringify({
        viewport,
        violations: results.violations.map((item) => ({
          id: item.id, impact: item.impact, description: item.description,
          nodes: item.nodes.slice(0, 5).map((node) => ({ target: node.target, summary: node.failureSummary }))
        }))
      }, null, 2));
    }
    assert.deepEqual(failures.map((item) => item.id), [], `Serious or critical WCAG violations at ${viewport.width}px`);
    await page.close();
  }
  console.log("BZaudio WCAG 2.2 AA automated accessibility checks passed at 390px, 768px and 1440px.");
} finally {
  await browser.close();
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()));
}
