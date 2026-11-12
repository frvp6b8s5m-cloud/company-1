import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8" };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    const file = resolve(root, relative);
    if (file !== root && !file.startsWith(root + sep)) throw new Error("Invalid path");
    const body = await readFile(file);
    response.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
try {
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  const address = server.address();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const response = await page.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: "domcontentloaded" });
  assert.equal(response.status(), 200, "Homepage must load successfully");

  const nav = page.locator("#primary-nav");
  const menu = page.locator(".menu-toggle");
  assert.equal(await nav.getAttribute("aria-hidden"), "true", "Mobile navigation starts hidden from assistive technology");
  assert.equal(await nav.evaluate((element) => element.inert), true, "Closed mobile navigation starts inert");
  await menu.click();
  assert.equal(await menu.getAttribute("aria-expanded"), "true", "Menu trigger exposes the expanded state");
  assert.equal(await nav.getAttribute("aria-hidden"), "false", "Open navigation is exposed to assistive technology");
  await page.getByRole("link", { name: "PA Designer" }).click();
  assert.equal(await nav.getAttribute("aria-hidden"), "true", "Selecting a mobile link closes the menu");
  assert.equal(await nav.evaluate((element) => element.inert), true, "Closed navigation is removed from tab order");
  assert.equal(await menu.evaluate((element) => element === document.activeElement), true, "Focus returns to the mobile menu trigger");
  assert.equal(new URL(page.url()).hash, "#designer", "PA Designer navigation target works");

  const next = page.locator("#wizard-next");
  await next.click();
  assert.equal(await page.locator('[name="venue"]').evaluate((element) => element.checkValidity()), false, "Required first-step fields block progression");
  assert.equal(await page.locator('.wizard-step[data-step="0"]').isVisible(), true, "Invalid step remains visible");

  await page.locator('[name="venue"]').selectOption({ label: "House of worship" });
  await page.locator('[name="audience"]').fill("350");
  await page.locator('[name="width"]').fill("60");
  await page.locator('[name="length"]').fill("90");
  await page.locator('[name="height"]').fill("24");
  await page.locator('[name="environment"]').selectOption({ label: "Indoor" });
  await next.click();
  assert.equal(await page.locator('.wizard-step[data-step="1"]').isVisible(), true, "Wizard advances to sound goals");

  await page.locator('[name="use"]').selectOption({ label: "Worship services" });
  await page.locator('[name="audienceLayout"]').selectOption({ label: "Seated" });
  await page.locator('[name="speakerApproach"]').selectOption({ label: "Not sure — recommend an approach" });
  await page.locator('[name="coverage"]').selectOption({ label: "Speech intelligibility" });
  await page.locator('[name="sources"]').fill("4 wireless microphones and playback");
  await next.click();
  assert.equal(await page.locator('.wizard-step[data-step="2"]').isVisible(), true, "Wizard advances to project parameters");

  await page.locator('[name="existing"]').selectOption({ label: "Starting from scratch" });
  await page.locator('[name="scope"]').selectOption({ label: "Design, supply and installation" });
  await page.locator('[name="budget"]').selectOption({ label: "$15,000–$35,000" });
  await page.locator('[name="brands"]').fill("Allen & Heath");
  await next.click();
  const brief = page.locator("#brief-output");
  assert.equal(await brief.isVisible(), true, "Final step produces a project brief");
  const briefText = await brief.innerText();
  for (const expected of ["House of worship", "350", "60 ft wide", "Worship services", "Allen & Heath", "not an acoustic prediction"]) {
    assert.ok(briefText.toLowerCase().includes(expected.toLowerCase()), `Project brief includes ${expected}`);
  }

  await page.locator("#use-brief").click();
  assert.equal(await page.locator('#project-form [name="service"]').inputValue(), "PA system design", "PA Designer handoff selects the correct inquiry type");
  assert.ok((await page.locator('#project-form [name="message"]').inputValue()).includes("BZAUDIO PA DESIGNER"), "PA Designer handoff includes the complete brief");
  assert.equal(await page.locator("#project-form").evaluate((form) => form.checkValidity()), false, "Contact form requires customer contact details before preparing an inquiry");

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(400);
  assert.equal(await nav.getAttribute("aria-hidden"), "false", "Desktop navigation is exposed");
  assert.equal(await nav.evaluate((element) => element.inert), false, "Desktop navigation is not inert");
  assert.deepEqual(pageErrors, [], "No uncaught browser JavaScript errors");
  console.log("BZaudio browser smoke tests passed: responsive navigation, keyboard focus, PA Designer validation, brief generation, quote handoff and desktop state.");
} finally {
  await browser.close();
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()));
}
