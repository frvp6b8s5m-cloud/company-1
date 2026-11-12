import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "dist", "apps");
const hosts = { systemos: "https://os.bzaudio.com/", "system-builder": "https://build.bzaudio.com/", "compatibility-center": "https://compat.bzaudio.com/", "show-workspace": "https://shows.bzaudio.com/", "fx-lab": "https://fx.bzaudio.com/", "bzaudio-id": "https://id.bzaudio.com/" };
await mkdir(out, { recursive: true });

async function writeApp(name, sourceFiles, transform) {
  const target = join(out, name);
  await mkdir(target, { recursive: true });
  for (const file of sourceFiles) {
    const source = join(root, file);
    const destination = join(target, file.split("/").at(-1));
    if (file.endsWith(".html") && transform) {
      const html = await readFile(source, "utf8");
      await writeFile(destination, transform(html), "utf8");
    } else {
      await cp(source, destination);
    }
  }
  await cp(join(root, "packages/design-system/tokens.css"), join(target, "tokens.css"));
  await writeFile(join(target, "app.css"), await readFile(join(root, "apps/app.css"), "utf8"));
}

await writeApp("systemos", [
  "apps/systemos/index.html", "apps/systemos/app.js", "apps/systemos/systemos.css",
  "systemos-core.js", "adapters/allen-heath/avantis-csv.js"
], html => html
  .replace("../../packages/design-system/tokens.css", "tokens.css")
  .replace("../../systemos-core.js", "systemos-core.js")
  .replace("../../adapters/allen-heath/avantis-csv.js", "avantis-csv.js")
  .replace("../../index.html", "https://www.bzaudio.com/"));

for (const name of ["system-builder", "compatibility-center", "show-workspace"]) {
  await writeApp(name, [`apps/${name}/index.html`, `apps/${name}/app.js`], html => {
    let output = html
      .replace("../../packages/design-system/tokens.css", "tokens.css")
      .replace("../app.css", "app.css")
      .replace("../../index.html", "https://www.bzaudio.com/");
    for (const [app, host] of Object.entries(hosts)) output = output.replaceAll(`../${app}/`, host);
    return output;
  });
}
console.log("Built initial four independent BZaudio application bundles.");

await writeApp("fx-lab", ["apps/fx-lab/index.html", "apps/fx-lab/app.js", "apps/fx-lab/fx-engine.js", "apps/fx-lab/fx.css"], html => html.replace("../../packages/design-system/tokens.css", "tokens.css"));
await writeApp("bzaudio-id", ["apps/bzaudio-id/index.html", "apps/bzaudio-id/app.js", "apps/bzaudio-id/id.css"], html => html.replace("../../packages/design-system/tokens.css", "tokens.css"));
console.log("Added FX Lab and BZaudio ID standalone bundles.");
