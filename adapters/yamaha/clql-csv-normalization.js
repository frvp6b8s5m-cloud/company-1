/* Yamaha CL/QL CSV vocabulary normalizers based on the vendor's Editor manuals.
 * This is not a CSV file parser and does not claim a complete Yamaha adapter.
 */
(function (root) {
  "use strict";
  const COLOURS = new Map([
    ["BLUE","Blue"],["BL","Blue"],["B","Blue"],
    ["ORANGE","Orange"],["OR","Orange"],["O","Orange"],
    ["YELLOW","Yellow"],["YE","Yellow"],["YL","Yellow"],["Y","Yellow"],
    ["PURPLE","Purple"],["PU","Purple"],["P","Purple"],
    ["CYAN","Cyan"],["SKYBLUE","Cyan"],["CY","Cyan"],["C","Cyan"],
    ["MAGENTA","Magenta"],["PINK","Magenta"],["PK","Magenta"],["M","Magenta"],["MG","Magenta"],
    ["RED","Red"],["BROWN","Red"],["RD","Red"],["BN","Red"],["R","Red"],
    ["GREEN","Green"],["GN","Green"],["G","Green"],
    ["OFF","Off"],["BLACK","Off"],["BK","Off"],["","Off"]
  ]);

  function normalizeColour(value) {
    const key = String(value == null ? "" : value).trim().replace(/\s+/g, "").toUpperCase();
    return COLOURS.has(key) ? { value: COLOURS.get(key), recognized: true } : { value: null, recognized: false, original: value };
  }

  function normalizePortName(value) {
    const raw = String(value == null ? "" : value).trim().replace(/\s+/g, " ").toUpperCase();
    if (!raw || raw === "NONE") return { kind: "none", channel: null, original: value };
    let match;
    if ((match = /^(?:DANTE|DNT)\s*(\d+)$/.exec(raw))) return { kind: "dante", channel: Number(match[1]), original: value };
    if ((match = /^(?:OMNI|AD)\s*(\d+)$/.exec(raw))) return { kind: "omni", channel: Number(match[1]), original: value };
    if ((match = /^INPUT\s*(\d+)$/.exec(raw))) return { kind: "input", channel: Number(match[1]), original: value };
    if (/^(?:PB L|PBL|PLAYBACK OUTPUT LEFT)$/.test(raw)) return { kind: "playback", channel: 1, side: "left", original: value };
    if (/^(?:PB R|PBR|PLAYBACK OUTPUT RIGHT)$/.test(raw)) return { kind: "playback", channel: 2, side: "right", original: value };
    if ((match = /^(?:SLOT\s*([123])|SL\s*([123]))\s*(\d+)$/.exec(raw))) return { kind: "slot" + (match[1] || match[2]), channel: Number(match[3]), original: value };
    if ((match = /^(?:FX\s*(\d+)\s*([AB])|FX(\d+)([AB])|EFFECT RACK\s*(\d+)\s*([AB]))$/.exec(raw))) return { kind: "fx", channel: Number(match[1] || match[3] || match[5]), side: match[2] || match[4] || match[6], original: value };
    if ((match = /^(?:PRFX\s*(\d+)\s*([AB])|PR(\d+)([AB])|PREMIUM RACK\s*(\d+)\s*([AB]))$/.exec(raw))) return { kind: "premium-rack", channel: Number(match[1] || match[3] || match[5]), side: match[2] || match[4] || match[6], original: value };
    if ((match = /^(?:GEQ\s*(\d+)\s*([AB])|GEQ(\d+)([AB])|GEQ RACK\s*(\d+)\s*([AB]))$/.exec(raw))) return { kind: "geq", channel: Number(match[1] || match[3] || match[5]), side: match[2] || match[4] || match[6], original: value };
    if ((match = /^(?:MIX\s*(\d+)|MX\s*(\d+)|MIX CHANNEL\s*(\d+))$/.exec(raw))) return { kind: "mix", channel: Number(match[1] || match[2] || match[3]), original: value };
    if ((match = /^(?:MATRIX\s*(\d+)|MT\s*(\d+)|MATRIX CHANNEL\s*(\d+))$/.exec(raw))) return { kind: "matrix", channel: Number(match[1] || match[2] || match[3]), original: value };
    const fixed = new Map([
      ["STEREO L","stereo-left"],["STL","stereo-left"],["STEREO OUTPUT LEFT","stereo-left"],["MAIN L","stereo-left"],
      ["STEREO R","stereo-right"],["STR","stereo-right"],["STEREO OUTPUT RIGHT","stereo-right"],["MAIN R","stereo-right"],
      ["MONO (C)","mono"],["MONO","mono"]
    ]);
    if (fixed.has(raw)) return { kind: fixed.get(raw), channel: null, original: value };
    return { kind: "unknown", channel: null, original: value };
  }

  root.BZAudioYamahaClQl = Object.freeze({ normalizeColour, normalizePortName });
})(typeof globalThis !== "undefined" ? globalThis : this);
