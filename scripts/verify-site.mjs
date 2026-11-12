import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const html = read("../index.html");
const css = read("../styles.css");
const js = read("../script.js");
const config = read("../site-config.js");
const assets = read("../docs/assets.md");

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique");

const internalLinks = [...html.matchAll(/\bhref=["']#([^"']+)["']/g)].map((match) => match[1]);
const missingTargets = [...new Set(internalLinks.filter((target) => !ids.includes(target)))];
assert.deepEqual(missingTargets, [], "Every in-page link must point to an existing ID");

const buttons = [...html.matchAll(/<button\b([^>]*)>/g)].map((match) => match[1]);
assert.ok(buttons.length > 0, "Expected interactive buttons");
assert.ok(buttons.every((attributes) => /\btype=/.test(attributes)), "Every button must declare a type");

for (const id of ["work", "equipment", "designer", "connection", "os", "contact"]) {
  assert.ok(ids.includes(id), `Missing required section: ${id}`);
}

for (const field of ["venue", "audience", "width", "length", "environment", "use", "audienceLayout", "speakerApproach", "coverage", "sources", "zones", "challenges", "existing", "scope", "brands", "budget", "notes"]) {
  assert.ok(html.includes(`name="${field}"`), `Missing PA Designer field: ${field}`);
}
for (const summaryField of ["data.audienceLayout", "data.speakerApproach", "data.zones", "data.scope", "data.brands"]) {
  assert.ok(js.includes(summaryField), `PA Designer summary must include ${summaryField}`);
}

assert.ok(css.includes("prefers-reduced-motion"), "Reduced-motion styles are required");
assert.ok(css.includes("@media(max-width:680px)"), "Mobile breakpoint is required");
assert.ok((css.match(/{/g) || []).length === (css.match(/}/g) || []).length, "CSS braces must balance");
assert.ok(js.includes("nav.inert"), "Collapsed mobile navigation must be removed from tab order");
assert.ok(js.includes('nav.setAttribute("aria-hidden", String(collapsed))'), "Initial mobile navigation state must be exposed to assistive technology");
assert.ok(js.includes("const restoreFocus = isMobileNav()"), "Navigation focus restoration must be limited to the open mobile menu");
assert.ok(js.includes("menuButton.focus({ preventScroll: true })"), "Closing the mobile menu must restore focus without overriding the anchor scroll position");
assert.ok(js.includes("textContent = brief"), "User-provided project data must be rendered as text");
assert.ok(config.includes("inquiryEmail"), "Inquiry recipient must be configurable");

const photoUrls = [...new Set([...html.matchAll(/https:\/\/images\.pexels\.com\/photos\/\d+\/[^\s"'<>]+/g), ...css.matchAll(/https:\/\/images\.pexels\.com\/photos\/\d+\/[^\s"'<>]+/g)].map((match) => match[0].split("?")[0]))];
assert.ok(photoUrls.length >= 3, "Expected multiple real-world photo assets");
for (const photoUrl of photoUrls) {
  const photoId = photoUrl.match(/photos\/(\d+)/)?.[1];
  assert.ok(photoId && assets.includes(photoId), `Photo ${photoId} must be recorded in the asset rights ledger`);
}

assert.ok(!/href=["']#["']/.test(html), "Avoid placeholder links");

const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
assert.equal(imageTags.length, 7, "All seven photographic areas must use real image elements");
assert.ok(imageTags.every((tag) => /\balt=["'][^"']+["']/.test(tag)), "Every image must have meaningful alternative text");
assert.ok(imageTags.every((tag) => /\bdecoding=["']async["']/.test(tag)), "Images should decode asynchronously");
const heroImage = imageTags.find((tag) => /class=["']hero-image["']/.test(tag));
assert.ok(heroImage && /fetchpriority=["']high["']/.test(heroImage), "The hero image must receive high fetch priority");
assert.ok(heroImage && /srcset=["'][^"']+["']/.test(heroImage), "The hero image must offer responsive source candidates");
assert.ok(imageTags.filter((tag) => !/class=["']hero-image["']/.test(tag)).every((tag) => /loading=["']lazy["']/.test(tag)), "Below-the-fold images must lazy-load");
assert.ok(!/background(?:-image)?\s*:[^;]*images\.pexels\.com/.test(css), "Photography must use image elements, not eager CSS background downloads");

console.log("BZaudio static site checks passed.");
console.log(`Checked ${ids.length} unique IDs, ${internalLinks.length} internal links, ${buttons.length} buttons and ${photoUrls.length} licensed photo references.`);
