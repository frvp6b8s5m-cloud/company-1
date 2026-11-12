import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const apps = [
  ["systemos", ["index.html", "app.js", "systemos.css"]],
  ["system-builder", ["index.html", "app.js"]],
  ["compatibility-center", ["index.html", "app.js"]],
  ["show-workspace", ["index.html", "app.js"]]
];
for (const [app, files] of apps) for (const file of files) assert.ok(existsSync("apps/" + app + "/" + file), "Missing " + app + "/" + file);
const builder = readFileSync("apps/system-builder/app.js", "utf8");
const compat = readFileSync("apps/compatibility-center/app.js", "utf8");
const workspace = readFileSync("apps/show-workspace/app.js", "utf8");
assert.match(builder, /bzaudio-system-plan/);
assert.match(builder, //planning-only//);
assert.match(compat, /Unverified/);
assert.match(compat, /support\.allen-heath\.com/);
assert.match(workspace, /bzaudio-show-sheet/);
assert.match(workspace, /inputs/);
assert.ok(existsSync("apps/app.css"), "Shared app styling must exist");
console.log("BZaudio app foundations verified.");
