import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root=resolve(fileURLToPath(new URL("..",import.meta.url)));
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8"};
const server=createServer(async(req,res)=>{try{let path=decodeURIComponent(new URL(req.url,"http://localhost").pathname);let relative=path==="/"? "index.html":path.slice(1);if(relative.endsWith("/"))relative+="index.html";const file=resolve(root,relative);if(file!==root&&!file.startsWith(root+sep))throw new Error("bad path");const body=await readFile(file);res.writeHead(200,{"content-type":mime[extname(file)]||"application/octet-stream"});res.end(body);}catch{res.writeHead(404);res.end("Not found");}});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
async function readDownload(page,click){const [download]=await Promise.all([page.waitForEvent("download"),click()]);const stream=await download.createReadStream();let value="";for await(const chunk of stream)value+=chunk.toString();return JSON.parse(value);}
try{
 await new Promise(resolveListen=>server.listen(0,"127.0.0.1",resolveListen));
 const origin="http://127.0.0.1:"+server.address().port;
 const context=await browser.newContext({viewport:{width:1280,height:900}});
 const page=await context.newPage(),errors=[];page.on("pageerror",error=>errors.push(error.message));
 let response=await page.goto(origin+"/apps/systemos/",{waitUntil:"domcontentloaded"});
 assert.equal(response.status(),200,"SystemOS Transfer Studio loads");
 await page.locator("#new-show").click();
 await page.locator("#input-name").fill("Festival Main Stage");
 await page.locator("#input-venue").fill("River Park");
 await page.locator("#create-show").click();
 assert.equal(await page.locator("#show-name").innerText(),"Festival Main Stage","SystemOS creates a show");
 await page.reload({waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#show-name").innerText(),"Festival Main Stage","SystemOS restores the local show after reload");
 const avantisFixture=`[Version]
2
[Channels]
Channel Type,Channel No.,Name,Colour,Socket Type,Socket No.,Source Side,Gain.,PAD,+48v
Input,1,"Lead, Vocal",Green,Surface,1,Left,25,Off,On
Group,1,Drums,Red,,,,,,
[Outputs]
Output Type,Channel No.,Source Type,Source Ch No.,Stereo
Surface,1,Main,1,Left
[Virtual Soundcheck]
Input Channel,VSC Source no.,VSC Source Type
1,1,USB
`;
 await page.locator("#import-show").setInputFiles({name:"sample-avantis.csv",mimeType:"text/csv",buffer:Buffer.from(avantisFixture)});
 await page.waitForFunction(()=>!document.querySelector("#transfer-report")?.hidden);
 assert.ok((await page.locator("#transfer-report-summary").innerText()).includes("Partial Avantis CSV import"),"SystemOS reports partial source import");
 assert.equal(await page.locator(".transfer-counts article").count(),4,"SystemOS renders transfer status counts");
 const systemExport=await readDownload(page,()=>page.locator("#export-show").click());
 assert.equal(systemExport.format,"bzaudio-show","SystemOS exports the neutral show format");
 assert.equal(systemExport.channels.length,2,"SystemOS preserves imported channel records");
 const transferExport=await readDownload(page,()=>page.locator("#export-report").click());
 assert.equal(transferExport.status,"partial-import","SystemOS exports an explicit partial-transfer report");
 assert.equal(transferExport.counts.unsupported,2,"SystemOS marks scenes and processing as unsupported");
 await page.reload({waitUntil:"domcontentloaded"});
 assert.ok((await page.locator("#show-meta").innerText()).includes("Allen & Heath Avantis"),"SystemOS restores imported console profile");
 response=await page.goto(origin+"/apps/system-builder/",{waitUntil:"domcontentloaded"});
 assert.equal(response.status(),200,"System Builder loads");
 await page.locator("#plan-name").fill("Main Room Upgrade");
 await page.locator("#category").selectOption({label:"Mixing console"});
 await page.locator("#item-name").fill("Avantis 64");
 await page.locator("#quantity").fill("1");
 await page.locator("#item-form button[type=submit]").click();
 await page.locator("#category").selectOption({label:"Main speakers"});
 await page.locator("#item-name").fill("Powered point source");
 await page.locator("#quantity").fill("2");
 await page.locator("#item-form button[type=submit]").click();
 assert.equal(await page.locator(".item").count(),2,"System Builder adds equipment line items");
 const qty=page.locator(".item-controls input").nth(1);await qty.fill("4");await qty.dispatchEvent("change");
 assert.ok((await page.locator(".item").nth(1).innerText()).includes("4 units"),"System Builder supports editable quantities");
 await page.reload({waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#plan-name").inputValue(),"Main Room Upgrade","System Builder restores plan name");
 assert.equal(await page.locator(".item").count(),2,"System Builder restores equipment list");
 const exported=await readDownload(page,()=>page.locator("#export").click());
 assert.equal(exported.format,"bzaudio-system-plan","System Builder exports versioned plan format");
 assert.equal(exported.items[1].quantity,4,"System Builder export preserves edited quantities");
 exported.items[0].name="Imported console";
 await page.locator("#import-file").setInputFiles({name:"system-plan.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(exported))});
 assert.ok((await page.locator(".item").first().innerText()).includes("Imported console"),"System Builder validates and imports plan files");
 await page.locator("#clear-plan").click();
 assert.equal(await page.locator(".item").count(),0,"System Builder clears local plan");
 await page.goto(origin+"/apps/show-workspace/",{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#show").count(),1,"Show Workspace loads");
 await page.locator("#show").fill("Summer Festival");
 await page.locator("#venue").fill("River Stage");
 await page.locator("#date").fill("2026-08-14");
 await page.locator("#stage").fill("Main Stage");
 await page.locator("#production-notes").fill("Doors at 18:00; line check at 16:00.");
 await page.locator("#source").fill("Lead vocal");
 await page.locator("#mic").fill("Dynamic handheld");
 await page.locator("#notes").fill("Stage left; stand");
 await page.locator("#input-form button[type=submit]").click();
 assert.equal(await page.locator(".item").count(),1,"Show Workspace adds input channels");
 await page.reload({waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#show").inputValue(),"Summer Festival","Show Workspace restores production metadata");
 assert.equal(await page.locator(".item").count(),1,"Show Workspace restores input list");
 const sheet=await readDownload(page,()=>page.locator("#export").click());
 assert.equal(sheet.format,"bzaudio-show-sheet","Show Workspace exports versioned show-sheet format");
 assert.equal(sheet.inputs[0].source,"Lead vocal","Show Workspace export preserves input details");
 sheet.inputs[0].source="Imported lead vocal";
 await page.locator("#import-file").setInputFiles({name:"show-sheet.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(sheet))});
 assert.ok((await page.locator(".item").first().innerText()).includes("Imported lead vocal"),"Show Workspace validates and imports show sheets");
 await page.locator("#clear-show").click();
 assert.equal(await page.locator(".item").count(),0,"Show Workspace clears local data");
 await page.goto(origin+"/apps/compatibility-center/",{waitUntil:"domcontentloaded"});
 await page.locator("#search").fill("Avantis");
 assert.ok((await page.locator("#results").innerText()).toLowerCase().includes("documented"),"Compatibility Center searches evidence records");
 assert.ok(await page.locator('#results a[href^="https://support.allen-heath.com/"]').count(),"Avantis result links to official manufacturer documentation");
 assert.deepEqual(errors,[],"Companion apps have no uncaught browser errors");
 console.log("System Builder, Show Workspace and Compatibility Center browser tests passed.");
}finally{await browser.close();server.close();}
