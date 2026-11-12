import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
const apps = ["systemos", "system-builder", "compatibility-center", "show-workspace"];
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
console.log("Four standalone BZaudio app bundles verified.");
