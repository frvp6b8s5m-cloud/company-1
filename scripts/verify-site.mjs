import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const html = read("../index.html");
const css = read("../styles.css");
const js = read("../script.js");
const soundmatch = read("../soundmatch.js");
const systemos = read("../systemos.js");
const systemosCss = read("../systemos.css");
const experience = read("../experience.css");
const config = read("../site-config.js");
const assets = read("../docs/assets.md");
const favicon = read("../favicon.svg");
const pagesWorkflow = read("../.github/workflows/pages.yml");

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique");

const internalLinks = [...html.matchAll(/\bhref=["']#([^"']+)["']/g)].map((match) => match[1]);
const missingTargets = [...new Set(internalLinks.filter((target) => !ids.includes(target)))];
assert.deepEqual(missingTargets, [], "Every in-page link must point to an existing ID");

const buttons = [...html.matchAll(/<button\b([^>]*)>/g)].map((match) => match[1]);
assert.ok(buttons.length > 0, "Expected interactive buttons");
assert.ok(buttons.every((attributes) => /\btype=/.test(attributes)), "Every button must declare a type");

for (const id of ["work", "equipment", "soundmatch", "os", "contact"]) {
  assert.ok(ids.includes(id), `Missing required section: ${id}`);
}

assert.ok(css.includes("prefers-reduced-motion"), "Reduced-motion styles are required");
assert.ok(css.includes("@media(max-width:680px)"), "Mobile breakpoint is required");
assert.ok((css.match(/{/g) || []).length === (css.match(/}/g) || []).length, "CSS braces must balance");
assert.ok(js.includes("nav.inert"), "Collapsed mobile navigation must be removed from tab order");
assert.ok(js.includes('nav.setAttribute("aria-hidden", String(collapsed))'), "Initial mobile navigation state must be exposed to assistive technology");
assert.ok(js.includes("const restoreFocus = isMobileNav()"), "Navigation focus restoration must be limited to the open mobile menu");
assert.ok(js.includes("menuButton.focus({ preventScroll: true })"), "Closing the mobile menu must restore focus without overriding the anchor scroll position");
assert.ok(systemos.includes("textContent") && soundmatch.includes("textContent"), "User-provided project data must be rendered as text");
assert.ok(config.includes("inquiryEmail"), "Inquiry recipient must be configurable");
assert.ok(html.includes('action="mailto:" method="post" enctype="text/plain"'), "The contact form must have a non-JavaScript mailto fallback");
assert.ok(html.includes('src="soundmatch.js"'), "SoundMatch behavior must be loaded");
assert.ok(html.includes('role="progressbar" aria-label="SoundMatch progress"') && html.includes('id="sm-count" aria-live="polite"'), "SoundMatch progress is announced accessibly");
assert.equal([...html.matchAll(/class="sm-step"/g)].length, 6, "SoundMatch must have six guided stages");
for (const field of ["venue", "audience", "environment", "application", "coverage", "zones", "inputCount", "mixer", "stageIO", "speakerApproach", "subCount", "monitorCount", "infrastructure", "expansion", "existing", "scope", "budget", "timeline", "notes"]) {
  assert.ok(html.includes(`name="sm-${field}"`), `SoundMatch must include ${field}`);
}
assert.ok(soundmatch.includes("bzaudio.soundmatch.drafts.v1"), "SoundMatch drafts must use a versioned local storage key");
assert.ok(soundmatch.includes("textContent"), "SoundMatch user content must be rendered as text");
assert.ok(soundmatch.includes('form.addEventListener("submit", (event) => event.preventDefault())'), "SoundMatch must not accidentally submit/reload its planning form");
assert.ok(soundmatch.includes("UNVERIFIED / REVIEW REQUIRED"), "SoundMatch must flag unverified equipment compatibility");
assert.ok(soundmatch.includes("sm-item-qty"), "SoundMatch equipment quantities must be editable after adding items");
assert.ok(html.includes('id="sm-quantity" type="number" min="1" max="100" value="1" required'), "SoundMatch new equipment quantities must be required");
assert.ok(html.includes('href="experience.css"'), "The industrial BZaudio visual system must be loaded");
assert.ok(experience.includes("--signal:#ff6a2a") && experience.includes("#111412"), "The visual system must use charcoal and electric-orange signal accents");
assert.ok(experience.includes("prefers-reduced-motion:reduce"), "New motion must respect reduced-motion preferences");

assert.ok(js.includes("const mailtoRecipient = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(recipient) ? recipient : \"\";"), "Configured inquiry recipient must be validated without encoding the @ separator");
assert.ok(js.includes('"mailto:" + mailtoRecipient'), "Mailto recipient must remain a valid address component");

const photoUrls = [...new Set([...html.matchAll(/https:\/\/images\.pexels\.com\/photos\/\d+\/[^\s"'<>]+/g), ...css.matchAll(/https:\/\/images\.pexels\.com\/photos\/\d+\/[^\s"'<>]+/g)].map((match) => match[0].split("?")[0]))];
assert.ok(photoUrls.length >= 3, "Expected multiple real-world photo assets");
for (const photoUrl of photoUrls) {
  const photoId = photoUrl.match(/photos\/(\d+)/)?.[1];
  assert.ok(photoId && assets.includes(photoId), `Photo ${photoId} must be recorded in the asset rights ledger`);
}

assert.ok(html.includes('rel="icon" href="favicon.svg" type="image/svg+xml"'), "A scalable BZaudio favicon must be linked");
assert.ok(pagesWorkflow.includes("branches:\n      - main") && !pagesWorkflow.includes("feat/bzaudio-company-site"), "Pages must not deploy feature branch pushes");
assert.ok(pagesWorkflow.includes("if: github.ref == \'refs/heads/main\'"), "Manual Pages dispatch must be guarded to main");
assert.ok(html.includes('name="twitter:card" content="summary_large_image"'), "Social sharing should use the large-image card");
assert.ok(html.includes('property="og:image"'), "Open Graph image metadata is required");
assert.ok(html.includes("SystemOS") && html.includes('id="sys-project-form"') && html.includes('id="sys-export"'), "SystemOS project and backup controls must be present");
assert.ok(systemos.includes("bzaudio.systemos.workspace.v1") && systemos.includes("sys-import") && systemos.includes("sys-service-form"), "SystemOS must persist locally and support import, export and service history");
assert.ok(systemosCss.includes(".sys-layout") && systemosCss.includes("@media(max-width:600px)"), "SystemOS must have responsive workspace styling");
assert.ok(!html.includes('id="designer"') && !html.includes('id="connection"'), "Duplicate PA Designer and unimplemented Connection Lab sections must be removed");
assert.ok(!html.includes("IN DEVELOPMENT") && !html.includes("ROADMAP") && !html.includes("PA Designer"), "The public site must not advertise unfinished modules or a duplicate quiz");
assert.ok(html.includes("SoundMatch") && html.includes("SYSTEM CONFIGURATOR") && html.includes("Equipment builder"), "SoundMatch must remain the single guided system configurator");
assert.ok(!html.includes("<em>Pro</em>") && !html.includes("IN DEVELOPMENT") && !html.includes("ROADMAP"), "Do not imply unimplemented paid tiers or roadmap features are available");
assert.ok(favicon.includes("<svg") && favicon.includes("BZ"), "The BZaudio favicon must be a real SVG brand mark");
assert.ok(!/href=["']#["']/.test(html), "Avoid placeholder links");

const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
assert.equal(imageTags.length, 4, "All four photographic areas must use real image elements");
assert.ok(imageTags.every((tag) => /\balt=["'][^"']+["']/.test(tag)), "Every image must have meaningful alternative text");
assert.ok(imageTags.every((tag) => /\bdecoding=["']async["']/.test(tag)), "Images should decode asynchronously");
const heroImage = imageTags.find((tag) => /class=["']hero-image["']/.test(tag));
assert.ok(heroImage && /fetchpriority=["']high["']/.test(heroImage), "The hero image must receive high fetch priority");
assert.ok(heroImage && /srcset=["'][^"']+["']/.test(heroImage), "The hero image must offer responsive source candidates");
assert.ok(imageTags.filter((tag) => !/class=["']hero-image["']/.test(tag)).every((tag) => /loading=["']lazy["']/.test(tag)), "Below-the-fold images must lazy-load");
assert.ok(!/background(?:-image)?\s*:[^;]*images\.pexels\.com/.test(css), "Photography must use image elements, not eager CSS background downloads");

console.log("BZaudio static site checks passed.");
console.log(`Checked ${ids.length} unique IDs, ${internalLinks.length} internal links, ${buttons.length} buttons and ${photoUrls.length} licensed photo references.`);
