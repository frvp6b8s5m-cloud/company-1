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
  await page.locator("#primary-nav a[href=\"#designer\"]").click();
  await page.waitForFunction(() => document.querySelector("#primary-nav")?.getAttribute("aria-hidden") === "true", null, { timeout: 1500 });
  assert.equal(await nav.getAttribute("aria-hidden"), "true", "Selecting a mobile link closes the menu");
  assert.equal(await nav.evaluate((element) => element.inert), true, "Closed navigation is removed from tab order");
  assert.equal(await menu.evaluate((element) => element === document.activeElement), true, "Focus returns to the mobile menu trigger");
  assert.equal(new URL(page.url()).hash, "#designer", "PA Designer navigation target works");

  await menu.click();
  assert.equal(await menu.getAttribute("aria-expanded"), "true", "Menu can be reopened");
  await page.keyboard.press("Escape");
  assert.equal(await menu.getAttribute("aria-expanded"), "false", "Escape closes the mobile menu");
  assert.equal(await nav.getAttribute("aria-hidden"), "true", "Escape hides navigation from assistive technology");
  assert.equal(await menu.evaluate((element) => element === document.activeElement), true, "Escape restores focus to the menu trigger");

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

  await page.locator("#soundmatch").scrollIntoViewIfNeeded();
  const smNext = page.locator("#sm-next");
  await smNext.click();
  assert.equal(await page.locator('[name="sm-venue"]').evaluate((element) => element.checkValidity()), false, "SoundMatch requires venue details before progression");
  await page.locator('[name="sm-venue"]').selectOption({ label: "House of worship" });
  await page.locator('[name="sm-audience"]').fill("350");
  await page.locator('[name="sm-environment"]').selectOption({ label: "Indoor" });
  await page.locator('[name="sm-layout"]').selectOption({ label: "Seated" });
  await page.locator('[name="sm-width"]').fill("60");
  await page.locator('[name="sm-length"]').fill("90");
  await smNext.click();
  await page.locator('[name="sm-application"]').selectOption({ label: "Worship services" });
  await page.locator('[name="sm-coverage"]').selectOption({ label: "Speech intelligibility" });
  await page.locator('[name="sm-zones"]').fill("2");
  await page.locator('[name="sm-sub-goal"]').selectOption({ label: "Helpful for music" });
  await smNext.click();
  await page.locator('[name="sm-mixer"]').selectOption({ label: "Digital mixing console" });
  await page.locator('[name="sm-inputCount"]').fill("32");
  await page.locator('[name="sm-stageIO"]').selectOption({ label: "Digital stagebox" });
  await page.locator('[name="sm-recording"]').selectOption({ label: "Multitrack recording" });
  await smNext.click();
  await page.locator('[name="sm-speakerApproach"]').selectOption({ label: "Point source" });
  await page.locator('[name="sm-main-count"]').fill("2");
  await page.locator('[name="sm-subCount"]').fill("2");
  await page.locator('[name="sm-monitorCount"]').fill("4");
  await page.locator('[name="sm-amplification"]').selectOption({ label: "Powered speakers" });
  await page.locator('[name="sm-microphones"]').selectOption({ label: "Both wired and wireless" });
  await smNext.click();
  await page.locator('[name="sm-infrastructure"]').selectOption({ label: "Permanent installed system" });
  await page.locator('[name="sm-mounting"]').selectOption({ label: "Wall / ceiling mounted" });
  await page.locator('[name="sm-network"]').selectOption({ label: "Basic control network" });
  await page.locator('[name="sm-expansion"]').selectOption({ label: "More zones / rooms" });
  await smNext.click();
  await page.locator('[name="sm-existing"]').selectOption({ label: "Upgrading existing equipment" });
  await page.locator('[name="sm-scope"]').selectOption({ label: "Design, supply and installation" });
  await page.locator('[name="sm-budget"]').selectOption({ label: "$15,000–$35,000" });
  await page.locator('[name="sm-timeline"]').selectOption({ label: "1–3 months" });
  await smNext.click();
  assert.equal(await page.locator("#sm-review").isVisible(), true, "SoundMatch produces a system brief after six stages");
  assert.ok((await page.locator("#sm-brief").innerText()).includes("BZAUDIO SOUNDMATCH"), "SoundMatch brief identifies the tool");
  assert.ok((await page.locator("#sm-brief").innerText()).includes("32"), "SoundMatch brief includes mixer input requirements");
  await page.locator("#sm-tier").selectOption("recommended");
  await page.locator("#sm-category").selectOption({ label: "Mixing console" });
  await page.locator("#sm-item-name").fill("Digital mixing console");
  await page.locator("#sm-add-item").click();
  assert.ok((await page.locator("#sm-items-recommended").innerText()).includes("Digital mixing console"), "Equipment can be added to a comparison tier");
  await page.locator("#sm-design-name").fill("Auditorium system");
  await page.locator("#sm-save").click();
  assert.equal(await page.locator("#sm-saved-select option").count(), 1, "SoundMatch saves multiple local designs");
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("bzaudio.soundmatch.drafts.v1"))[0].values["sm-venue"]), "House of worship", "Saved draft captures the completed form answers");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#soundmatch").scrollIntoViewIfNeeded();
  assert.equal(await page.locator("#sm-saved-select option").count(), 1, "Saved SoundMatch designs persist after reload");
  await page.locator("#sm-load").click();
  assert.equal(await page.locator('[name="sm-venue"]').inputValue(), "House of worship", "Saved SoundMatch design reloads its answers");
  await page.locator("#sm-delete").click();
  assert.equal(await page.locator("#sm-saved-select option").count(), 1, "Empty saved-design state remains available after deletion");

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
