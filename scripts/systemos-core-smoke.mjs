import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const core = require("../systemos-core.js");

const show = core.createShow({ name: "Festival Main Stage", venue: "Outdoor stage" });
assert.equal(show.format, "bzaudio-show");
assert.equal(show.schemaVersion, 1);
assert.equal(core.validateShow(show).valid, true);

show.channels.push({ id: "ch-1", label: "Lead vocal", manufacturerExtension: { source: "fixture" } });
assert.equal(core.validateShow(show).valid, true, "Neutral show accepts channel records and vendor extensions");

const serialized = core.serializeShow(show);
const restored = core.parseShow(serialized);
assert.equal(restored.channels[0].manufacturerExtension.source, "fixture", "Unknown vendor fields survive round-trip");

const duplicate = structuredClone(show);
duplicate.channels.push({ id: "ch-1", label: "Duplicate" });
assert.equal(core.validateShow(duplicate).valid, false, "Duplicate stable IDs are rejected");

assert.throws(() => core.parseShow("{broken"), /valid JSON/);
assert.throws(() => core.parseShow("x".repeat(core.limits.packageBytes + 1)), /10 MB/);

const registry = core.createAdapterRegistry();
const adapter = {
  id: "fixture-vendor-format-v1",
  manufacturer: "Fixture",
  formats: ["fixture-v1"],
  identify: () => ({ confidence: 1 }),
  parse: () => ({ show }),
  validate: () => [],
  map: () => ({ show, report: [] }),
  export: () => new Uint8Array(),
  capabilities: () => ({ read: true, write: false })
};
registry.register(adapter);
assert.equal(registry.get(adapter.id).id, adapter.id);
assert.equal(registry.list().length, 1);
assert.throws(() => registry.register(adapter), /already registered/);
assert.throws(() => registry.register({ id: "incomplete" }), /missing identify/);

const report = core.createTransferReport({ manufacturer: "Fixture" }, { manufacturer: "Destination" });
assert.equal(report.status, "analysis-required");
assert.deepEqual(report.counts, { exact: 0, transformed: 0, needsReview: 0, unsupported: 0, notPresent: 0, unverified: 0 });

console.log("SystemOS neutral show model and adapter registry tests passed.");
