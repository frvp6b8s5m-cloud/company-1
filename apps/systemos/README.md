# BZaudio SystemOS application

**Hostname target:** `os.bzaudio.com`  
**Status:** browser application scaffold; not yet deployed to a subdomain.

SystemOS is the flagship browser-first professional audio workspace. Its core is manufacturer-neutral; manufacturer/model/firmware adapters provide explicit capabilities and evidence.

Read [the universal architecture](../../docs/systemos-universal-architecture.md), [format research](../../docs/systemos-format-research.md) and [the subdomain deployment plan](../../docs/subdomain-architecture.md).

## Current working features

- Create, validate, import and export neutral BZaudio show packages locally.
- Add/remove neutral show channels and persist the active show in this browser.
- Produce an explicit field-level transfer report for the partial Avantis CSV import, including unsupported scenes/processing and warnings.
- Export the transfer report separately as JSON.
- Import a documented subset of Allen & Heath Avantis sectioned CSV: channel records, output patch rows and Virtual Soundcheck rows.
- Validate section names, columns and selected enumerated/range values.
- Preserve the source Avantis CSV sections as vendor extensions in the neutral package.
- Reject malformed and oversized imports.

## Explicit limitations

The Avantis CSV reader is a **partial, read-only importer**, not a complete Avantis show adapter. It does not import scenes, processing, all console state or all hardware settings. No Avantis CSV writer is enabled because the Version-section/export details still require real export fixtures and editor/console round-trip tests.

No Yamaha parser/writer is enabled yet. Yamaha CL/QL Editor CSV support is documented, but its exact file names, headers and conventions need genuine export fixtures. There is no cross-manufacturer transfer, console connection, live metering or hardware control yet.

File operations currently run locally in the browser. There is no cloud account, remote storage or cross-subdomain sign-in in this phase.

## Local preview

From the repository root:

```bash
python3 -m http.server 4173
```

Open [http://localhost:4173/apps/systemos/](http://localhost:4173/apps/systemos/).
