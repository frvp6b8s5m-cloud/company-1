# BZaudio SystemOS browser workspace

## Purpose

SystemOS is the local-first project workspace embedded in the BZaudio website. It gives an audio team one place to organize venue/system records and the documentation around them.

## Delivered modules

| Module | Data captured | Available actions |
|---|---|---|
| Systems | Name, venue/location, system type, description | Create, select, delete |
| Equipment | Model/name, category, quantity, location, notes | Add, delete |
| Signal flow | Node name, stage, connection notes | Add, remove; list order documents the path |
| Documents & references | Title, type, URL, notes | Save, delete |
| Maintenance log | Entry, date, work type, notes | Add, delete |
| Backup/restore | Complete workspace JSON | Export and import |

## Storage and data model

- Storage key: bzaudio.systemos.workspace.v1
- Schema version: 1
- Workspace: { version, activeId, projects[] }
- Each project owns inventory[], signal[], documents[], service[] and activity[].
- Records have generated local IDs. Activity entries record local timestamps and short action descriptions.
- Browser storage is scoped to the current browser profile/device. It does not synchronize or transmit data.

## Backup and restore

Export downloads a JSON snapshot. Import accepts JSON backups up to 5 MB and at most 500 projects; collection sizes are bounded and imported content is rendered as text. Import replaces the current local workspace, so users should export a backup before restoring another file.

## Security and privacy boundaries

- No login, server, cloud database, analytics, file upload service or network API is used.
- Data is stored in localStorage; browser profile clearing can remove it.
- Imported and user-entered text is treated as untrusted and rendered via textContent.
- Document records hold reference URLs and notes; they do not upload or store files.
- Signal flow is documentation, not live network discovery or a verified topology engine.

## Explicitly outside this browser workspace

No Allen & Heath discovery/control, mixer monitoring, command transmission, QR provisioning, account synchronization, acoustic simulation, SPL prediction, product compatibility verification or desktop/hardware OS is claimed. Those capabilities require separate engineering, security and physical-device validation.
