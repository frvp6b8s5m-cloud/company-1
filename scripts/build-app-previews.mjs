import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "dist", "apps");
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
  await writeApp(name, [`apps/${name}/index.html`, `apps/${name}/app.js`], html => html
    .replace("../../packages/design-system/tokens.css", "tokens.css")
    .replace("../app.css", "app.css")
    .replace("../../index.html", "https://www.bzaudio.com/"));
}
console.log("Built four independent static BZaudio application bundles in dist/apps/.");
