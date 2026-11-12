# BZaudio application interchange formats

All app interchange files are explicit JSON formats with versioned identifiers. Importers must reject malformed payloads and preserve source data in a namespaced extension when they cannot interpret every field.

## System Builder export — `bzaudio-system-plan`, schema version 1

```json
{
  "format": "bzaudio-system-plan",
  "schemaVersion": 1,
  "createdAt": "ISO-8601 timestamp",
  "items": [
    {
      "category": "Mixing console",
      "name": "User-entered model or description",
      "quantity": 1
    }
  ],
  "validation": {
    "status": "planning-only",
    "note": "Not a verified compatibility or acoustic design."
  }
}
```

The current System Builder export is a planning list. It does not assert catalog identity, price, inventory, acoustic performance, power matching or product compatibility.

## Show Workspace export — `bzaudio-show-sheet`, schema version 1

```json
{
  "format": "bzaudio-show-sheet",
  "schemaVersion": 1,
  "show": "Production name",
  "venue": "Venue",
  "date": "YYYY-MM-DD",
  "stage": "Stage or room",
  "inputs": [
    {
      "source": "Lead vocal",
      "mic": "Dynamic microphone",
      "notes": "User notes"
    }
  ],
  "notes": "Production notes"
}
```

Show Workspace input-list rows can be represented as neutral channel records by SystemOS. Mic and user notes remain in the `bzaudio.show-sheet.v1` extension namespace.

## SystemOS neutral show export — `bzaudio-show`, schema version 1

The authoritative show package and validation rules currently live in the root `systemos-core.js`. System Builder and Show Workspace exports are preserved as namespaced extensions when imported by SystemOS, so the original project data is not silently discarded.

## Interchange guarantees and limitations

- JSON file import/export currently runs locally in the browser.
- The import path validates the format identifier and schema version before adapting.
- Original System Builder / Show Workspace payloads are retained in extensions.
- This is file-based interchange, not live shared cloud state or multi-user sync.
- Vendor-native console files and hardware state are separate adapters; these app formats do not claim compatibility with Yamaha or Allen & Heath console formats.
