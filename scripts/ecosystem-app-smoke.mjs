import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const appFiles = [
  "apps/systemos/index.html", "apps/systemos/app.js", "apps/systemos/systemos.css",
  "apps/system-builder/index.html", "apps/system-builder/app.js",
  "apps/compatibility-center/index.html", "apps/compatibility-center/app.js",
  "apps/show-workspace/index.html", "apps/show-workspace/app.js",
  "apps/app.css"
];
for (const path of appFiles) assert.ok(existsSync(path), "Missing application file: " + path);
const builder = readFileSync("apps/system-builder/app.js", "utf8");
const compat = readFileSync("apps/compatibility-center/app.js", "utf8");
const workspace = readFileSync("apps/show-workspace/app.js", "utf8");
assert.match(builder, /bzaudio-system-plan/);
assert.match(builder, /planning-only/);
assert.match(compat, /Unverified/);
assert.match(compat, /support\\.allen-heath\\.com/);
assert.match(workspace, /bzaudio-show-sheet/);
assert.match(workspace, /inputs/);
console.log("BZaudio app foundations verified.");
