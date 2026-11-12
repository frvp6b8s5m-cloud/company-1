/* Read-only parser for the documented Allen & Heath Avantis sectioned CSV format.
 * Source: official Avantis CSV Import / Export help article.
 * No hardware I/O and no assumptions about undocumented Version metadata.
 */
(function (root) {
  "use strict";

  const SECTION_HEADERS = {
    Channels: ["Channel Type", "Channel No.", "Name", "Colour", "Socket Type", "Socket No.", "Source Side", "Gain.", "PAD", "+48v"],
    Outputs: ["Output Type", "Channel No.", "Source Type", "Source Ch No.", "Stereo"],
    "Virtual Soundcheck": ["Input Channel", "VSC Source no.", "VSC Source Type"]
  };
  const CHANNEL_TYPES = new Set(["Input", "Group", "St Group", "Aux", "St Aux", "Main", "Matrix", "St Matrix", "Wedge", "IEM", "FX"]);
  const SOCKET_TYPES = new Set(["Surface", "SLink", "USB", "IO 1", "IO 2"]);
  const COLOURS = new Set(["Green", "Red", "Blue", "White", "Yellow", "Magenta", "Cyan", "Off"]);
  const OUTPUT_TYPES = new Set(["Surface", "SLink", "USB", "IO 1", "IO 2"]);
  const VSC_TYPES = SOCKET_TYPES;

  function parseCsvRow(line) {
    const cells = [];
    let value = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (quoted) {
        if (char === '"' && line[i + 1] === '"') { value += '"'; i += 1; }
        else if (char === '"') quoted = false;
        else value += char;
      } else if (char === '"' && value.length === 0) quoted = true;
      else if (char === ",") { cells.push(value); value = ""; }
      else value += char;
    }
    if (quoted) throw new Error("Malformed CSV: unterminated quoted field.");
    cells.push(value);
    return cells.map(cell => cell.trim());
  }

  function parseSectionedCsv(text) {
    if (typeof text !== "string") throw new TypeError("Avantis CSV must be text.");
    if (text.length > 5 * 1024 * 1024) throw new Error("Avantis CSV exceeds the 5 MB safety limit.");
    const sections = {};
    let current = null;
    for (const rawLine of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;
      const match = /^\[([^\]]+)\]$/.exec(line);
      if (match) {
        current = match[1];
        if (sections[current]) throw new Error("Duplicate Avantis CSV section: " + current);
        sections[current] = [];
        continue;
      }
      if (!current) throw new Error("Avantis CSV data appears before a section header.");
      sections[current].push(parseCsvRow(rawLine));
    }
    if (!sections.Version) throw new Error("Avantis CSV is missing the [Version] section.");
    if (!sections.Channels && !sections.Outputs && !sections["Virtual Soundcheck"]) {
      throw new Error("Avantis CSV contains no recognized data sections.");
    }
    return sections;
  }

  function rowsFor(sections, name, expectedHeaders, diagnostics) {
    const rows = sections[name] || [];
    if (!rows.length) return [];
    const first = rows[0].map(x => x.toLowerCase());
    const expected = expectedHeaders.map(x => x.toLowerCase());
    if (expected.every((header, i) => first[i] === header)) return rows.slice(1);
    if (rows.some(row => row.length !== expectedHeaders.length)) {
      diagnostics.push({ severity: "error", code: "column-count", section: name, message: name + " rows must contain " + expectedHeaders.length + " columns." });
      return [];
    }
    return rows;
  }

  function integer(value, label, diagnostics, min, max) {
    if (value === "") return null;
    const n = Number(value);
    if (!Number.isInteger(n) || n < min || n > max) {
      diagnostics.push({ severity: "error", code: "invalid-range", message: label + " must be an integer from " + min + " to " + max + "." });
      return null;
    }
    return n;
  }

  function parseAvantisCsv(text) {
    const sections = parseSectionedCsv(text);
    const diagnostics = [];
    const channels = [];
    const routing = [];
    const io = [];
    const channelRows = rowsFor(sections, "Channels", SECTION_HEADERS.Channels, diagnostics);
    channelRows.forEach((row, index) => {
      if (row.length !== 10) {
        diagnostics.push({ severity: "error", code: "channel-columns", row: index + 1, message: "Channel row must contain 10 columns." });
        return;
      }
      const [type, numberText, label, colour, socketType, socketText, sourceSide, gainText, pad, phantom] = row;
      if (!CHANNEL_TYPES.has(type)) diagnostics.push({ severity: "error", code: "channel-type", row: index + 1, message: "Unknown Avantis channel type: " + type });
      const maxChannel = ({ Input: 64, Group: 40, "St Group": 20, Aux: 40, "St Aux": 20, Main: 3, Matrix: 40, "St Matrix": 20, Wedge: 1, IEM: 1, FX: 12 })[type] || 0;
      const number = integer(numberText, "Channel number", diagnostics, 1, maxChannel || 999);
      if (colour && !COLOURS.has(colour)) diagnostics.push({ severity: "warning", code: "unknown-colour", row: index + 1, message: "Unrecognized colour: " + colour });
      const isInput = type === "Input";
      if (isInput && socketType && !SOCKET_TYPES.has(socketType)) diagnostics.push({ severity: "error", code: "socket-type", row: index + 1, message: "Unknown input socket type: " + socketType });
      const socketNo = isInput ? integer(socketText, "Socket number", diagnostics, 1, socketType === "Surface" ? 14 : socketType === "USB" ? 2 : 128) : null;
      const gainDb = isInput && gainText !== "" ? Number(gainText) : null;
      if (gainDb !== null && (!Number.isFinite(gainDb) || gainDb < 5 || gainDb > 60)) diagnostics.push({ severity: "error", code: "gain-range", row: index + 1, message: "Avantis input gain must be between 5 and 60 dB." });
      if (isInput && pad && !["On", "Off"].includes(pad)) diagnostics.push({ severity: "error", code: "pad-value", row: index + 1, message: "PAD must be On or Off." });
      if (isInput && phantom && !["On", "Off"].includes(phantom)) diagnostics.push({ severity: "error", code: "phantom-value", row: index + 1, message: "+48v must be On or Off." });
      channels.push({
        id: "avantis-" + String(type).toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + number,
        label,
        type,
        colour: colour || null,
        source: isInput ? { socketType: socketType || null, socketNumber: socketNo, sourceSide: sourceSide || null } : null,
        preamp: isInput ? { gainDb, pad: pad || null, phantom48v: phantom || null } : null,
        extensions: { "allen-heath.avantis.csv": { sourceRow: row.slice() } }
      });
    });

    const outputRows = rowsFor(sections, "Outputs", SECTION_HEADERS.Outputs, diagnostics);
    outputRows.forEach((row, index) => {
      if (row.length !== 5) {
        diagnostics.push({ severity: "error", code: "output-columns", row: index + 1, message: "Output row must contain 5 columns." });
        return;
      }
      const [outputType, outputNoText, sourceType, sourceNoText, stereo] = row;
      if (outputType && !OUTPUT_TYPES.has(outputType)) diagnostics.push({ severity: "error", code: "output-type", row: index + 1, message: "Unknown output socket type: " + outputType });
      const outputNo = integer(outputNoText, "Output socket number", diagnostics, 1, outputType === "Surface" ? 16 : outputType === "USB" ? 2 : 128);
      const sourceNo = sourceNoText ? integer(sourceNoText, "Output source channel number", diagnostics, 1, 999) : null;
      routing.push({
        id: "avantis-output-" + outputType.toLowerCase().replace(/\s+/g, "-") + "-" + outputNo,
        output: { socketType: outputType, socketNumber: outputNo },
        source: { type: sourceType || null, channelNumber: sourceNo },
        stereo: stereo || null,
        extensions: { "allen-heath.avantis.csv": { sourceRow: row.slice() } }
      });
    });

    const vscRows = rowsFor(sections, "Virtual Soundcheck", SECTION_HEADERS["Virtual Soundcheck"], diagnostics);
    vscRows.forEach((row, index) => {
      if (row.length !== 3) {
        diagnostics.push({ severity: "error", code: "vsc-columns", row: index + 1, message: "Virtual Soundcheck row must contain 3 columns." });
        return;
      }
      const [inputChannel, sourceNoText, sourceType] = row;
      if (sourceType && !VSC_TYPES.has(sourceType)) diagnostics.push({ severity: "error", code: "vsc-source-type", row: index + 1, message: "Unknown VSC source type: " + sourceType });
      io.push({
        id: "avantis-vsc-" + (index + 1),
        inputChannel: inputChannel || null,
        sourceNumber: integer(sourceNoText, "VSC source number", diagnostics, 1, sourceType === "Surface" ? 14 : sourceType === "USB" ? 2 : 128),
        sourceType: sourceType || null,
        extensions: { "allen-heath.avantis.csv": { sourceRow: row.slice() } }
      });
    });

    const errors = diagnostics.filter(d => d.severity === "error");
    return {
      manufacturer: "Allen & Heath",
      modelFamily: "Avantis",
      format: "avantis-sectioned-csv",
      sections,
      show: { channels, routing, io },
      diagnostics,
      valid: errors.length === 0,
      capabilities: { read: true, write: false, nativeShowFile: false, liveHardware: false }
    };
  }

  root.BZAudioAvantisCsv = Object.freeze({
    format: "avantis-sectioned-csv",
    headers: SECTION_HEADERS,
    parse: parseAvantisCsv,
    parseSectioned: parseSectionedCsv
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
