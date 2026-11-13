import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../apps/systemos/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../apps/systemos/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../apps/systemos/systemos.css", import.meta.url), "utf8");
for (const value of ['<main id="main">','id="new-show"','id="export-show"','id="import-show"','text/csv','avantis-csv.js','systemos-core.js','role="status"']) assert.ok(html.includes(value), "Missing SystemOS markup: " + value);
for (const value of ["core.parseShow","core.serializeShow","core.limits.packageBytes","avantisCsv.parse","native Avantis export and cross-vendor transfer are not available","bzaudio-system-plan","bzaudio-show-sheet","localStorage","core.createTransferReport","renderReport"]) assert.ok(app.includes(value), "Missing SystemOS behavior: " + value);
assert.ok(css.includes("@media(max-width:760px)") && css.includes(":focus-visible"));
console.log("SystemOS application shell checks passed.");
