# BZaudio SystemOS application

**Hostname target:** `os.bzaudio.com`  
**Status:** browser application scaffold; not yet deployed to a subdomain.

SystemOS is the flagship browser-first professional audio workspace. Its core is manufacturer-neutral; manufacturer/model/firmware adapters will provide explicit capabilities and evidence.

Read [the universal architecture](../../docs/systemos-universal-architecture.md) and [the subdomain deployment plan](../../docs/subdomain-architecture.md).

## Current working features

- Create a neutral BZaudio show package with a show name and venue.
- Export the validated show as a local JSON file.
- Import and validate a BZaudio JSON show package in the browser.
- Reject malformed or oversized imports.
- Show an honest adapter-availability state for Yamaha and Allen & Heath.

## Not implemented yet

This scaffold does not parse vendor-native Yamaha or Allen & Heath files, translate between manufacturers, connect to consoles, read live meters, or control hardware. The next engineering phase is model/firmware research, real sample-file fixtures and adapter tests. No device is advertised as supported until those checks pass.

File operations currently run locally in the browser. There is no cloud account, remote storage, or cross-subdomain sign-in in this phase.

## Local preview

From the repository root:

```bash
python3 -m http.server 4173
```

Open [http://localhost:4173/apps/systemos/](http://localhost:4173/apps/systemos/).
