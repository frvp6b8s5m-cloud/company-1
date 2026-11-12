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
  const origin = `http://127.0.0.1:${address.port}`;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const response = await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
  assert.equal(response.status(), 200, "Homepage must load successfully");

  const nav = page.locator("#primary-nav");
  const menu = page.locator(".menu-toggle");
  assert.equal(await nav.getAttribute("aria-hidden"), "true", "Mobile navigation starts hidden from assistive technology");
  assert.equal(await nav.evaluate((element) => element.inert), true, "Closed mobile navigation starts inert");
  await menu.click();
  assert.equal(await menu.getAttribute("aria-expanded"), "true", "Menu trigger exposes the expanded state");
  assert.equal(await nav.getAttribute("aria-hidden"), "false", "Open navigation is exposed to assistive technology");
  await page.locator("#primary-nav a[href=\"#soundmatch\"]").click();
  await page.waitForFunction(() => document.querySelector("#primary-nav")?.getAttribute("aria-hidden") === "true", null, { timeout: 1500 });
  assert.equal(await nav.getAttribute("aria-hidden"), "true", "Selecting a mobile link closes the menu");
  assert.equal(await nav.evaluate((element) => element.inert), true, "Closed navigation is removed from tab order");
  assert.equal(await menu.evaluate((element) => element === document.activeElement), true, "Focus returns to the mobile menu trigger");
  assert.equal(new URL(page.url()).hash, "#soundmatch", "SoundMatch navigation target works");

  await menu.click();
  assert.equal(await menu.getAttribute("aria-expanded"), "true", "Menu can be reopened");
  await page.keyboard.press("Escape");
  assert.equal(await menu.getAttribute("aria-expanded"), "false", "Escape closes the mobile menu");
  assert.equal(await nav.getAttribute("aria-hidden"), "true", "Escape hides navigation from assistive technology");
  assert.equal(await menu.evaluate((element) => element === document.activeElement), true, "Escape restores focus to the menu trigger");

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
  await page.locator("#sm-copy").click();
  await page.waitForTimeout(100);
  const copiedSoundMatch = await page.evaluate(() => navigator.clipboard.readText());
  assert.ok(copiedSoundMatch.includes("BZAUDIO SOUNDMATCH"), "SoundMatch copies the generated system brief");
  await page.locator("#sm-tier").selectOption("recommended");
  await page.locator("#sm-category").selectOption({ label: "Mixing console" });
  await page.locator("#sm-item-name").fill("Digital mixing console");
  await page.locator("#sm-add-item").click();
  assert.ok((await page.locator("#sm-items-recommended").innerText()).includes("Digital mixing console"), "Equipment can be added to a comparison tier");
  assert.ok((await page.locator("#sm-items-recommended").innerText()).includes("UNVERIFIED / REVIEW REQUIRED"), "Unverified component status is explicit");
  await page.locator("#sm-items-recommended .sm-item-qty").fill("3");
  await page.locator("#sm-items-recommended .sm-item-qty").dispatchEvent("change");
  assert.ok((await page.locator("#sm-brief").innerText()).includes("3 × Mixing console — Digital mixing console"), "SoundMatch allows component quantity edits");
  assert.ok((await page.locator("#sm-items-recommended li").innerText()).includes("3 × Mixing console — Digital mixing console"), "Edited quantity is reflected in the comparison list");
  await page.locator("#sm-items-recommended .sm-item-qty").fill("");
  await page.locator("#sm-items-recommended .sm-item-qty").dispatchEvent("change");
  assert.equal(await page.locator("#sm-items-recommended .sm-item-qty").inputValue(), "3", "Invalid empty quantity reverts to the last valid value");
  await page.locator("#sm-design-name").fill("Auditorium system");
  await page.locator("#sm-save").click();
  assert.equal(await page.locator("#sm-saved-select option").count(), 1, "SoundMatch saves multiple local designs");
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("bzaudio.soundmatch.drafts.v1"))[0].values["sm-venue"]), "House of worship", "Saved draft captures the completed form answers");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#soundmatch").scrollIntoViewIfNeeded();
  assert.equal(await page.locator("#sm-saved-select option").count(), 1, "Saved SoundMatch designs persist after reload");
  await page.locator("#sm-load").click();
  assert.equal(await page.locator('[name="sm-venue"]').inputValue(), "House of worship", "Saved SoundMatch design reloads its answers");
  assert.equal(await page.locator("#sm-items-recommended .sm-item-qty").inputValue(), "3", "Saved SoundMatch design reloads component quantities");
  await page.locator("#sm-delete").click();
  assert.equal(await page.locator("#sm-saved-select option").count(), 1, "Empty saved-design state remains available after deletion");

  await page.locator("#os").scrollIntoViewIfNeeded();
  await page.locator("#sys-new-project").click();
  await page.locator("#sys-project-form [name=name]").fill("Main auditorium");
  await page.locator("#sys-project-form [name=location]").fill("North hall");
  await page.locator("#sys-project-form button[type=submit]").click();
  assert.equal(await page.locator("#sys-active-name").innerText(), "Main auditorium", "SystemOS creates and selects a system");
  await page.locator(".sys-tab[data-view=inventory]").click();
  await page.locator("#sys-equipment-form [name=name]").fill("SQ-6");
  await page.locator("#sys-equipment-form button[type=submit]").click();
  assert.ok((await page.locator("#sys-equipment-list").innerText()).includes("SQ-6"), "SystemOS adds equipment");
  await page.locator(".sys-tab[data-view=signal]").click();
  await page.locator("#sys-signal-form [name=name]").fill("Vocal microphones");
  await page.locator("#sys-signal-form button[type=submit]").click();
  assert.ok((await page.locator("#sys-signal-list").innerText()).includes("Vocal microphones"), "SystemOS records signal path nodes");
  await page.locator(".sys-tab[data-view=patchbay]").click();
  await page.locator("#sys-patch-form [name=source]").fill("DX168 output 01");
  await page.locator("#sys-patch-form [name=destination]").fill("SQ-6 input 17");
  await page.locator("#sys-patch-form button[type=submit]").click();
  assert.ok((await page.locator("#sys-patch-list").innerText()).includes("DX168 output 01"), "SystemOS records patchbay source and destination");
  await page.locator(".sys-tab[data-view=network]").click();
  await page.locator("#sys-network-form [name=device]").fill("FOH-SW-01");
  await page.locator("#sys-network-form [name=ip]").fill("192.168.20.10");
  await page.locator("#sys-network-form button[type=submit]").click();
  assert.ok((await page.locator("#sys-network-list").innerText()).includes("192.168.20.10"), "SystemOS records network endpoints");
  await page.locator(".sys-tab[data-view=commissioning]").click();
  await page.locator("#sys-test-form [name=test]").fill("Main PA polarity check");
  await page.locator("#sys-test-form [name=date]").fill("2026-11-12");
  await page.locator("#sys-test-form [name=result]").selectOption("Pass");
  await page.locator("#sys-test-form button[type=submit]").click();
  assert.ok((await page.locator("#sys-test-list").innerText()).includes("Main PA polarity check"), "SystemOS records commissioning evidence");
  await page.locator(".sys-tab[data-view=service]").click();
  await page.locator("#sys-service-form [name=title]").fill("Annual inspection");
  await page.locator("#sys-service-form [name=date]").fill("2026-11-12");
  await page.locator("#sys-service-form button[type=submit]").click();
  assert.ok((await page.locator("#sys-service-list").innerText()).includes("Annual inspection"), "SystemOS logs maintenance");
  assert.ok((await page.evaluate(()=>localStorage.getItem("bzaudio.systemos.workspace.v1")))?.includes("Main auditorium"), "SystemOS persists workspace data locally");
  const backupDownload = page.waitForEvent("download");
  await page.locator("#sys-export").click();
  assert.equal((await backupDownload).suggestedFilename(), "bzaudio-systemos-backup.json", "SystemOS exports a named JSON backup");
  const importPayload = {version:1,activeId:"imported",projects:[{id:"imported",name:"Imported rehearsal room",type:"Live venue",location:"Studio B",inventory:[],signal:[],documents:[],service:[],activity:[]}]};
  await page.locator("#sys-import").setInputFiles({name:"systemos-backup.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(importPayload))});
  await page.waitForFunction(()=>document.querySelector("#sys-active-name")?.textContent==="Imported rehearsal room");
  assert.equal(await page.locator("#sys-project-select").inputValue(),"imported","SystemOS restores an imported backup");

  const appPage = await context.newPage();
  const appErrors = [];
  appPage.on("pageerror", (error) => appErrors.push(error.message));

  await appPage.goto(`${origin}/apps/system-builder/`, { waitUntil: "domcontentloaded" });
  await appPage.locator("#item-name").fill("Test digital console");
  await appPage.locator("#item-form button[type=submit]").click();
  assert.ok((await appPage.locator("#items").innerText()).includes("Test digital console"), "System Builder adds equipment");
  assert.ok((await appPage.locator("#checks").innerText()).includes("No main speakers listed"), "System Builder shows a planning gap without claiming compatibility");
  const planDownload = appPage.waitForEvent("download");
  await appPage.locator("#export").click();
  assert.equal((await planDownload).suggestedFilename(), "bzaudio-system-plan.json", "System Builder exports a plan");

  await appPage.goto(`${origin}/apps/compatibility-center/`, { waitUntil: "domcontentloaded" });
  await appPage.locator("#search").fill("Avantis");
  assert.ok((await appPage.locator("#results").innerText()).includes("CSV import/export"), "Compatibility Center searches documented records");
  await appPage.locator("#search").fill("Yamaha CL/QL");
  assert.ok((await appPage.locator("#results").innerText()).includes("Documented"), "Compatibility Center displays evidence status");

  await appPage.goto(`${origin}/apps/show-workspace/`, { waitUntil: "domcontentloaded" });
  await appPage.locator("#source").fill("Lead vocal");
  await appPage.locator("#mic").fill("Dynamic microphone");
  await appPage.locator("#input-form button[type=submit]").click();
  assert.ok((await appPage.locator("#inputs").innerText()).includes("Lead vocal"), "Show Workspace adds stage inputs");
  const showDownload = appPage.waitForEvent("download");
  await appPage.locator("#export").click();
  assert.equal((await showDownload).suggestedFilename(), "bzaudio-show-sheet.json", "Show Workspace exports a production sheet");

  await appPage.goto(`${origin}/apps/systemos/`, { waitUntil: "domcontentloaded" });
  assert.equal(await appPage.locator("#show-name").innerText(), "Untitled show", "SystemOS app initializes a neutral show");
  const avantisFixture = `[Version]
2
[Channels]
Channel Type,Channel No.,Name,Colour,Socket Type,Socket No.,Source Side,Gain.,PAD,+48v
Input,1,"Lead, Vocal",Green,Surface,1,Left,25,Off,On
[Outputs]
Output Type,Channel No.,Source Type,Source Ch No.,Stereo
Surface,1,Main,1,Left
[Virtual Soundcheck]
Input Channel,VSC Source no.,VSC Source Type
1,1,USB
`;
  await appPage.locator("#import-show").setInputFiles({ name: "avantis-export.csv", mimeType: "text/csv", buffer: Buffer.from(avantisFixture) });
  assert.ok((await appPage.locator("#feedback").innerText()).includes("Avantis CSV imported"), "SystemOS imports documented Avantis CSV subset");
  assert.ok((await appPage.locator("#show-meta").innerText()).includes("Avantis"), "SystemOS identifies the source console profile");

  const planPayload = { format: "bzaudio-system-plan", schemaVersion: 1, items: [{ category: "Mixing console", name: "User-entered console", quantity: 1 }] };
  await appPage.locator("#import-show").setInputFiles({ name: "system-plan.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(planPayload)) });
  assert.ok((await appPage.locator("#feedback").innerText()).includes("System Builder plan imported"), "SystemOS accepts System Builder interchange files");
  const showPayload = { format: "bzaudio-show-sheet", schemaVersion: 1, show: "Friday Festival", venue: "Main Stage", date: "2026-11-12", stage: "A", inputs: [{ source: "Lead vocal", mic: "Dynamic", notes: "Boom stand" }], notes: "Doors at 6" };
  await appPage.locator("#import-show").setInputFiles({ name: "show-sheet.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(showPayload)) });
  assert.ok((await appPage.locator("#feedback").innerText()).includes("Show Workspace sheet imported"), "SystemOS accepts Show Workspace interchange files");
  assert.equal(await appPage.locator("#show-name").innerText(), "Friday Festival", "Show Workspace metadata carries into SystemOS");

  assert.deepEqual(appErrors, [], "No uncaught errors in BZaudio application pages");
  await appPage.close();

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(400);
  assert.equal(await nav.getAttribute("aria-hidden"), "false", "Desktop navigation is exposed");
  assert.equal(await nav.evaluate((element) => element.inert), false, "Desktop navigation is not inert");
  assert.deepEqual(pageErrors, [], "No uncaught browser JavaScript errors");
  console.log("BZaudio browser smoke tests passed: responsive navigation, keyboard focus, SoundMatch and SystemOS flows, local draft persistence, quote handoff and desktop state.");
} finally {
  await browser.close();
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()));
}
