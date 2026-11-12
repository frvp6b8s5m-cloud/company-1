# BZaudio SystemOS — Universal Mixing Platform Architecture

**Status:** Product direction approved by the project owner on 2026-11-12.  
**Implementation status:** Architecture target; not a claim that hardware adapters or live console control are already implemented.  
**Current repository baseline:** Browser-local engineering workspace. This document supersedes that workspace as the long-term product vision without pretending the prototype already meets it.

## 1. Product definition

BZaudio SystemOS is a universal professional-audio mixing and show-management platform. It should let engineers prepare, translate, manage, validate and—only where explicitly supported—operate audio systems across manufacturers from one consistent environment.

The platform is manufacturer-neutral at its core and manufacturer/model-specific at its edges. It must not assume that two consoles expose identical features or file formats.

Primary outcomes:
- Move show data between supported consoles in both directions.
- Preserve as much meaning as possible when translating channel, bus, routing, processing, scene and show data.
- Make every lossy, unsupported or approximate conversion visible before export.
- Provide a coherent workspace for show files, scenes, snapshots, patching, stage boxes, I/O, network plans, notes, revisions and backups.
- Grow through tested adapters rather than claiming universal compatibility prematurely.

## 2. Product principles

1. **One neutral core, many adapters.** Vendor-specific parsing and export logic must not leak into the shared domain model.
2. **No silent data loss.** Every translation produces a report with exact, transformed, omitted, unsupported and review-required fields.
3. **Read before write.** Initial hardware integrations are read-only. Console write/control is a separate capability requiring model-specific safety tests.
4. **Model-level truth.** Compatibility is declared by exact manufacturer, product family, model, firmware range, file format and tested capability.
5. **Offline resilience.** Show preparation, editing, comparison and file translation should work locally in the browser where practical. Local data is user-owned and exportable.
6. **Reversible workflows.** Preserve original source files, create versioned outputs, and never overwrite a source show.
7. **Operator-first UX.** Large touch targets, keyboard operation, clear signal flow, fast search, undo/redo, autosave, recovery and obvious status.
8. **Engineering-grade transparency.** Distinguish imported facts, inferred mappings, user edits, simulation and live device telemetry.

## 3. Universal domain model

The neutral show package is versioned and vendor-independent. Initial entities:

- **Show:** identity, venue, production, author, notes, timestamps and source lineage.
- **Console profile:** manufacturer, model, family, firmware, sample rate, I/O configuration and declared capabilities.
- **Channel:** stable ID, label, channel type, source, input socket, preamp/gain, polarity, phantom power, delay, filters, dynamics, EQ, pan/balance, mute, fader and DCA/group memberships.
- **Bus:** type (mix, subgroup, matrix, aux, FX, main), format, level, processing, assignments and output destination.
- **Routing graph:** typed endpoints and edges for inputs, channels, buses, outputs, inserts, direct outs, tie-lines and external transports.
- **Processing block:** typed parameters with units, ranges, defaults, provenance and compatibility metadata.
- **Scene/snapshot:** scoped parameter state, recall scope/safes, ordering, notes and change history.
- **Cue/list:** ordered show events, scene references, operator notes and timing metadata.
- **FX rack/library:** effect identity, parameters, routing and vendor-specific implementation metadata.
- **I/O inventory:** local I/O, stage boxes, cards, expansion units, ports and channel capacity.
- **Network plan:** control/audio networks, addressing, VLAN, clocking and device topology; documented separately from live discovery.
- **Metadata/extensions:** namespaced vendor data retained losslessly when the neutral model cannot yet interpret it.

All entities need stable IDs, schema versions, explicit units, provenance and optional vendor extensions. Unknown fields must be retained when safe, not discarded.

## 4. Translation pipeline

Every transfer follows the same inspectable pipeline:

1. **Acquire:** user selects a local show file or a verified read-only device source.
2. **Identify:** detect file family, model and firmware when possible; otherwise ask the user to confirm.
3. **Parse:** use the exact source adapter and preserve the original bytes.
4. **Normalize:** map supported source concepts into the neutral show package.
5. **Validate:** check schema, references, ranges, channel counts, routing cycles, unsupported combinations and destination limits.
6. **Map:** resolve source objects to destination objects with explicit user review for ambiguous mappings.
7. **Preview:** show a before/after comparison and a categorized transfer report.
8. **Export:** invoke the destination adapter to produce a native import file only when that format is implemented and verified.
9. **Verify:** re-parse the generated output where possible and compare semantic values against the intended mapping.
10. **Package:** deliver native output, neutral backup and human-readable transfer report without modifying the source.

Transfer report categories:
- Exact transfer
- Converted with documented transformation
- User decision required
- Unsupported by destination
- Not present in source
- Preserved as vendor extension but not active on destination
- Export not verified

No adapter may mark an item “exact” without a test fixture and semantic round-trip evidence.

## 5. Adapter architecture

Each adapter implements a small contract:
- identify(fileMetadata, bytes)
- parse(bytes, profile) → neutralShow + sourceExtensions + diagnostics
- validate(neutralShow, destinationProfile) → diagnostics
- map(neutralShow, mappingChoices, destinationProfile) → mappedShow + report
- export(mappedShow, destinationProfile) → bytes + diagnostics
- capabilities(profile) → capabilityManifest
- optional, separately gated read-only device discovery/telemetry methods

Adapter packages are isolated by manufacturer and format/version. They must include:
- documented format provenance and licensing review;
- exact supported model/firmware matrix;
- real sample files with redistribution rights or synthetic fixtures;
- parser fuzzing and malformed-file tests;
- conversion unit tests;
- round-trip and semantic-diff tests;
- safe failure behavior and resource limits.

No proprietary format should be reverse engineered in violation of applicable terms. Prefer published formats, official SDKs, documented APIs and manufacturer-approved methods.

## 6. Initial manufacturer roadmap

The architecture is universal. Adapter coverage is deliberately incremental.

Candidate adapter research targets (not yet declared supported):
- Yamaha: CL/QL, TF, DM series and other families after format/API research.
- Allen & Heath: dLive, Avantis, SQ, Qu, CQ and other families after format/API research.
- Later manufacturers: DiGiCo, Midas, Behringer, Soundcraft, Avid and others only after the same evidence gate.

Do not assume a format from one family works for another family from the same manufacturer. Do not assume compatibility in either direction is symmetric.

## 7. User experience

SystemOS should feel like a dedicated professional mixing environment, not a generic admin dashboard.

Primary navigation:
- **Home:** recent shows, active work, imported console profiles and alerts.
- **Shows:** create, open, duplicate, version, compare, archive and back up shows.
- **Transfer Studio:** source → neutral model → destination workflow with compatibility report.
- **Mixer Workspace:** channel strips, layers, meters and controls; only enable live controls when a tested adapter and authorized connection are present.
- **Routing:** visual patching and signal-flow graph with validation.
- **Scenes & Cues:** scene library, snapshots, recall scope, cue list and safe preview.
- **Libraries:** channel presets, processing templates, FX and reusable show templates, with vendor compatibility labels.
- **Devices:** console profiles, I/O, stage boxes, network plans and connection status.
- **Reports:** translation, commissioning, change history and export audit.
- **Settings:** local storage, backup, privacy, accessibility and adapter updates.

Core interaction requirements:
- Desktop and tablet responsive layouts; touch-first controls for a future dedicated controller.
- Resizable channel strips and configurable workspaces.
- Undo/redo, autosave, crash recovery and non-destructive editing.
- Search, filters, multi-select and bulk operations.
- Clear offline, imported, simulated, connected, read-only and control-enabled states.
- Accessible keyboard navigation, visible focus, reduced motion and screen-reader names.

## 8. Browser and hardware integration strategy

The browser remains the first delivery surface. File-based workflows must not require a server upload. Local files are processed on-device.

Direct hardware access is a separate layer:
- Browser APIs vary by browser, operating system, transport and permission.
- Browser sandboxing can prevent arbitrary LAN discovery and proprietary UDP/TCP access.
- If a required protocol cannot safely run in the browser, evaluate a signed local bridge/companion process with a narrow authenticated API. Do not quietly turn the website into a network scanner.
- Separate read-only monitoring from write/control permissions.
- Require explicit operator confirmation for risky actions such as scene recall, patch changes, phantom power, preamp gain, mute and output changes.
- Provide connection timeout, disconnect, state reconciliation, audit trail and safe recovery.
- Never claim live meters or control unless real device data/commands are implemented and physically tested.

## 9. Security, privacy and reliability

- Local-first by default; no show file upload without explicit user action and disclosure.
- Validate file size, structure, decompression limits and all parsed values.
- Treat show files as untrusted input; no execution of embedded scripts or macros.
- Use strict adapter boundaries and avoid dynamic code execution.
- Keep secrets and device credentials out of show files, logs and exports.
- Require authenticated pairing and least privilege for any future local bridge.
- Version the neutral schema and provide migrations with backups.
- Maintain a compatibility registry and signed adapter release metadata before distributing executable adapters.

## 10. Phased delivery and acceptance gates

### Phase A — Foundation
- Define and validate the neutral show schema.
- Build show package import/export, schema migrations, local persistence, version history and recovery.
- Create adapter interface, capability registry and transfer report model.
- Deliver a usable show workspace with no fake live hardware controls.

### Phase B — First real file adapters
- Research actual Yamaha and Allen & Heath file formats and official support paths.
- Select one exact source model/file version and one exact destination model/file version for the first verified path.
- Implement read/parse/normalize and export/round-trip tests.
- Add fixtures only where redistribution is permitted.
- Publish a model-specific support matrix.

### Phase C — Bidirectional transfer
- Add reverse translation for the same exact model pair.
- Expand to scenes, routing and processing incrementally.
- Require semantic diff reports and user approval for lossy mappings.

### Phase D — Live read-only integration
- Validate official protocols/SDKs and local connectivity constraints.
- Implement model-specific discovery and telemetry only after hardware testing.

### Phase E — Live operation
- Add write/control capabilities one command family at a time with permissions, confirmations, rollback/recovery and physical test evidence.
- No generic “control all consoles” switch.

### Phase F — Ecosystem expansion
- Add manufacturers, desktop/companion support and dedicated touch-controller surfaces based on demand and validated adapters.

Release gate for each adapter:
- exact model and firmware range documented;
- source/destination file fixtures available and licensed;
- parser and exporter tests pass;
- semantic round-trip test passes for claimed exact fields;
- unsupported/lossy cases are visible;
- malformed input and resource exhaustion tests pass;
- physical console import/export validation completed where applicable;
- compatibility registry and user documentation updated.

## 11. Immediate next engineering tasks

1. Replace the existing SystemOS workspace product specification with this universal mixing-platform target.
2. Define a machine-readable neutral show schema and capability manifest.
3. Build the adapter registry and translation-report data model.
4. Build Transfer Studio UX around import → inspect → map → preview → export.
5. Research manufacturer-published file formats and SDKs before selecting the first exact adapter.
6. Add tests for schema validation, adapter contract, transfer reports, mapping decisions and preservation of unknown vendor extensions.
7. Keep the old engineering register available as a subsystem, not the main SystemOS experience.

## 12. Explicit non-claims

Until each relevant release gate is met, SystemOS must not claim:
- universal console compatibility;
- verified Yamaha ↔ Allen & Heath conversion;
- complete transfer of every processing/routing feature;
- live connection, discovery, metering or control;
- safe write operations on real hardware.

The product can be universal in architecture and ambition while its actual supported capabilities remain precise, testable and honest.
