# SystemOS manufacturer format research

**Research date:** 2026-11-12  
**Scope:** official vendor documentation first; third-party format analysis is not treated as an implementation specification.

## Confirmed official workflows

### Allen & Heath Avantis — sectioned CSV

The official Avantis CSV Import / Export article documents four sections: `[Version]`, `[Channels]`, `[Outputs]` and `[Virtual Soundcheck]`. It documents these column layouts:

- Channels: Channel Type, Channel No., Name, Colour, Socket Type, Socket No., Source Side, Gain., PAD, +48v.
- Outputs: Output Type, Channel No., Source Type, Source Ch No., Stereo.
- Virtual Soundcheck: Input Channel, VSC Source no., VSC Source Type.

The documented editable data includes channel name/colour/patch socket, input socket gain/PAD/phantom power, and output socket patch. Gain is entered without applying a PAD offset. When multiple processing channels share one socket but provide different preamp values, the first preamp value is used. Virtual Soundcheck source type is set by the first configured VSC channel; later source-type values are ignored.

Official source: [Allen & Heath — CSV Import / Export](https://support.allen-heath.com/hc/en-gb/articles/7028322319377-CSV-Import-Export).

Implementation status:
- Read-only sectioned CSV parser implemented in `adapters/allen-heath/avantis-csv.js`.
- It validates documented section names, column counts, common enum/range constraints, and preserves raw rows.
- It normalizes the documented channel, output patch and VSC subset into the BZaudio neutral show model.
- It does not write Avantis CSV yet. The Version-section payload and exact exported header/encoding details must be verified against real console/Director exports before a writer is enabled.
- It does not claim to import/export a complete Avantis show or processing/scene state.

### Allen & Heath SQ — complete show folder

The official SQ support article says a show includes the current SQ state, scenes and libraries, and that the full show folder must be copied from the USB drive. The folder is under `AHSQ/SHOWS`; its `SHOW.DAT` contains the show name, while editing internal files can corrupt the show.

Official source: [Allen & Heath — SQ: Transferring Show Files to a computer](https://support.allen-heath.com/hc/en-gb/articles/4402941948561-SQ-Transferring-Show-Files-to-a-computer).

Implementation status: no SQ binary parser or writer. Treat the complete folder as an opaque backup until a supported, tested format implementation exists.

### Allen & Heath dLive — complete show archive

The official dLive guide says a show stores the complete dLive setup, including bus configuration, system preferences, all scene memories, cue lists, actions and libraries; user profiles are not included. Shows can be archived via USB.

Official source: [Allen & Heath — Shows / Utility](https://support.allen-heath.com/hc/en-gb/articles/39822377006865-Shows-Utility).

Implementation status: no dLive archive parser/writer. No claim of support.

### Yamaha CL/QL — CLF and Editor CSV workflows

Yamaha's QL Editor manual documents `.QLE` editor files and `.CLF` files containing CL/QL console data. It also documents CSV import/export. The CSV import workflow supports channel names, colours, icons, input patching, output patching and other patch data; missing CSV files simply leave those settings unchanged.

Official sources:
- [Yamaha — QL Editor Owner's Manual](https://data.yamaha.com/download/files/2106902)
- [Yamaha — QL Editor manual PDF](https://data.yamaha.com/files/download/other_assets/6/798476/qleditor_en_om_f0.pdf)

Implementation status:
- No CLF binary parser/writer.
- No Yamaha CSV parser/writer yet. The manual confirms the feature scope but the exact CSV filenames, headers, encoding and value conventions need a genuine export fixture and editor round-trip tests.
- Do not assume Yamaha CSV files are structurally compatible with Avantis CSV.

## First interoperability milestone

1. Import documented Avantis CSV into the neutral model with an explicit read-only/partial-data label.
2. Obtain legitimate sample exports from Yamaha QL/CL Editor and Avantis Director/console.
3. Build fixture-driven parsers for the exact CSV variants and firmware/editor versions.
4. Map only fields whose semantics are equivalent and whose ranges are verified.
5. Produce a transfer report for every dropped, transformed, ambiguous or unsupported field.
6. Add destination writers only after round-trip validation in the vendor editor and, separately, on physical consoles with safe test shows.

## Required sample fixtures

- Avantis CSV export containing all four sections, including representative channel types and output/VSC rows.
- Yamaha CL/QL CSV export folder from a named editor/console version, including all available CSV files.
- Yamaha CLF and A&H SQ/dLive/Avantis native show files only if the owner has lawful access and can provide test copies.

Fixtures should be sanitized of personal/venue information where possible and must not be redistributed unless licensing permits.
