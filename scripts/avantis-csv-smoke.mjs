import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const source = readFileSync(new URL("../adapters/allen-heath/avantis-csv.js", import.meta.url), "utf8");
const context = vm.createContext({});
vm.runInContext(source, context);
const adapter = context.BZAudioAvantisCsv;
assert.ok(adapter, "Avantis CSV adapter is exposed");
const fixture = `[Version]
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
const parsed = adapter.parse(fixture);
assert.equal(parsed.valid, true, JSON.stringify(parsed.diagnostics));
assert.equal(parsed.manufacturer, "Allen & Heath");
assert.equal(parsed.show.channels.length, 2);
assert.equal(parsed.show.channels[0].label, "Lead, Vocal");
assert.equal(parsed.show.channels[0].preamp.gainDb, 25);
assert.equal(parsed.show.channels[0].preamp.phantom48v, "On");
assert.equal(parsed.show.routing[0].output.socketNumber, 1);
assert.equal(parsed.show.io[0].sourceType, "USB");
assert.equal(parsed.capabilities.write, false);
assert.throws(() => adapter.parse("[Channels]\\nInput,1"), /Version/);
assert.throws(() => adapter.parse("[Version]\\n1\\n[Channels]\\n\\"unterminated"), /unterminated/);
const invalid = adapter.parse(`[Version]
1
[Channels]
Input,65,Out of range,Green,Surface,1,Left,25,Off,Off
`);
assert.equal(invalid.valid, false);
assert.ok(invalid.diagnostics.some(item => item.code === "invalid-range"));
console.log("Avantis CSV adapter tests passed.");
