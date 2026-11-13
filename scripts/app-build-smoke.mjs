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
  assert.ok(!html.includes("../../index.html"), `${app} must not retain monorepo home links`);
}
for (const file of ["systemos-core.js", "avantis-csv.js", "systemos.css"]) {
  assert.ok(existsSync(`dist/apps/systemos/${file}`), `Missing SystemOS dependency ${file}`);
}
for (const file of ["fx-engine.js", "fx.css"]) assert.ok(existsSync(`dist/apps/fx-lab/${file}`), `Missing FX Lab dependency ${file}`);
assert.ok(existsSync("dist/apps/bzaudio-id/id.css"), "Missing BZaudio ID styles");
const fxHtml = readFileSync("dist/apps/fx-lab/index.html", "utf8");
const idHtml = readFileSync("dist/apps/bzaudio-id/index.html", "utf8");
for (const [html, host] of [[fxHtml, "https://os.bzaudio.com/"], [idHtml, "https://fx.bzaudio.com/"], [idHtml, "https://compat.bzaudio.com/"]]) assert.ok(html.includes(host), `Missing production app navigation target ${host}`);
assert.ok(idHtml.includes("https://os.bzaudio.com/#transfer"), "BZaudio ID Transfer Studio link must resolve to SystemOS");
console.log("Six standalone BZaudio app bundles verified.");
