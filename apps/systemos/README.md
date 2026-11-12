# SystemOS application boundary

**Hostname:** `os.bzaudio.com`  
**Status:** architecture approved; current browser prototype remains at repository root.

SystemOS is the universal professional audio show-management and mixing workflow platform. Its core is manufacturer-neutral; manufacturer/model/firmware adapters provide explicit capabilities and evidence.

Read [the universal architecture](../../docs/systemos-universal-architecture.md).

## Planned areas

- Shows and revisions
- Transfer Studio
- Mixer Workspace
- Routing and I/O
- Scenes and cues
- Libraries
- Device and compatibility status
- Validation and transfer reports

## Current boundary

Do not copy the existing root `systemos.js`, `systemos.css` or `systemos-core.js` into this directory. They remain the working prototype until a migration is separately tested. The current neutral core is not a hardware driver and does not yet translate real vendor show files.

No manufacturer should be shown as supported until its exact model/firmware adapter passes documented fixtures and semantic round-trip tests.
