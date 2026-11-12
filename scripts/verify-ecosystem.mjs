import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const architecture = readFileSync("docs/bzaudio-ecosystem-architecture.md", "utf8");
const appMap = [
  ["apps/systemos/README.md", "os.bzaudio.com"],
  ["apps/system-builder/README.md", "build.bzaudio.com"],
  ["apps/compatibility-center/README.md", "compat.bzaudio.com"],
  ["apps/show-workspace/README.md", "shows.bzaudio.com"],
  ["apps/fx-lab/README.md", "fx.bzaudio.com"],
  ["apps/bzaudio-id/README.md", "id.bzaudio.com"],
];
for (const [path, host] of appMap) {
  assert.ok(existsSync(path), `Missing app boundary: ${path}`);
  assert.ok(readFileSync(path, "utf8").includes(host), `${path} must document ${host}`);
  assert.ok(architecture.includes(host), `Architecture must include ${host}`);
}
assert.ok(existsSync("apps/README.md"), "Missing apps index");
assert.ok(existsSync("packages/README.md"), "Missing shared packages index");
assert.ok(architecture.includes("scaffold") && architecture.includes("DNS"), "Architecture must distinguish scaffolds from deployed apps and document DNS");
assert.ok(architecture.includes("GitHub Pages"), "Architecture must document GitHub Pages hosting constraints");
console.log("BZaudio ecosystem scaffold verified: 6 app boundaries, shared packages, domain map and deployment caveats.");
