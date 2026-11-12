import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
const apps = ["systemos", "system-builder", "compatibility-center", "show-workspace", "fx-lab", "bzaudio-id"];
for (const app of apps) {
  for (const file of ["index.html", "app.js", "tokens.css", "app.css"]) {
    assert.ok(existsSync(`dist/apps/${app}/${file}`), `Missing built ${app}/${file}`);
  }
  const html = readFileSync(`dist/apps/${app}/index.html`, "utf8");
  assert.ok(!html.includes("../../packages/"), `${app} must not retain monorepo asset paths`);
  assert.ok(!html.includes("../app.css"), `${app} must use bundled shared styles`);
}
for (const file of ["systemos-core.js", "avantis-csv.js", "systemos.css"]) {
  assert.ok(existsSync(`dist/apps/systemos/${file}`), `Missing SystemOS dependency ${file}`);
}
for (const file of ["fx-engine.js", "fx.css"]) assert.ok(existsSync(`dist/apps/fx-lab/${file}`), `Missing FX Lab dependency ${file}`);
assert.ok(existsSync("dist/apps/bzaudio-id/id.css"), "Missing BZaudio ID styles");
console.log("Six standalone BZaudio app bundles verified.");
