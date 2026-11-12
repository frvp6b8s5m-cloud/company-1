import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../apps/systemos/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../apps/systemos/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../apps/systemos/systemos.css", import.meta.url), "utf8");

assert.match(html, /<main id="main">/);
assert.match(html, /<a class="skip" href="#main">/);
assert.match(html, /id="new-show"/);
assert.match(html, /id="export-show"/);
assert.match(html, /id="import-show"/);
assert.match(html, /type="file" accept="\.json,application\/json"/);
assert.match(html, /role="status" aria-live="polite"/);
assert.match(html, /systemos-core\.js/);
assert.match(app, /core\.parseShow/);
assert.match(app, /core\.serializeShow/);
assert.match(app, /core\.limits\.packageBytes/);
assert.match(app, /Vendor-native files are not supported/);
assert.match(css, /@media\(max-width:760px\)/);
assert.match(css, /:focus-visible/);
console.log("SystemOS application shell checks passed.");
