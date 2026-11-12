/* BZaudio SystemOS neutral show model and adapter registry. No hardware I/O is performed here. */
(function (root) {
  "use strict";

  const FORMAT = "bzaudio-show";
  const VERSION = 1;
  const COLLECTIONS = ["consoleProfiles", "channels", "buses", "routing", "scenes", "cues", "effects", "io", "network"];
  const LIMITS = { packageBytes: 10 * 1024 * 1024, collectionItems: 20000 };

  function makeId(prefix) {
    const random = Math.random().toString(36).slice(2, 10);
    return prefix + "-" + Date.now().toString(36) + "-" + random;
  }

  function createShow(options) {
    const opts = options || {};
    const show = {
      format: FORMAT,
      schemaVersion: VERSION,
      id: makeId("show"),
      metadata: {
        name: String(opts.name || "Untitled show").trim().slice(0, 120),
        venue: String(opts.venue || "").trim().slice(0, 160),
        production: String(opts.production || "").trim().slice(0, 160),
        notes: String(opts.notes || "").trim().slice(0, 4000),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      consoleProfiles: [],
      channels: [],
      buses: [],
      routing: [],
      scenes: [],
      cues: [],
      effects: [],
      io: [],
      network: [],
      extensions: {}
    };
    return show;
  }

  function validateShow(show) {
    const errors = [];
    if (!show || typeof show !== "object" || Array.isArray(show)) {
      return { valid: false, errors: ["Show package must be an object."] };
    }
    if (show.format !== FORMAT) errors.push("Unsupported show package format.");
    if (show.schemaVersion !== VERSION) errors.push("Unsupported show schema version.");
    if (typeof show.id !== "string" || !show.id.trim()) errors.push("Show ID is required.");
    if (!show.metadata || typeof show.metadata !== "object" || Array.isArray(show.metadata)) {
      errors.push("Show metadata is required.");
    } else if (typeof show.metadata.name !== "string" || !show.metadata.name.trim()) {
      errors.push("Show name is required.");
    }
    for (const key of COLLECTIONS) {
      const list = show[key];
      if (!Array.isArray(list)) {
        errors.push(key + " must be an array.");
        continue;
      }
      if (list.length > LIMITS.collectionItems) errors.push(key + " exceeds the item limit.");
      const seen = new Set();
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(key + "[" + i + "] must be an object.");
          continue;
        }
        if (typeof item.id !== "string" || !item.id.trim()) {
          errors.push(key + "[" + i + "] is missing a stable ID.");
        } else if (seen.has(item.id)) {
          errors.push(key + " contains duplicate ID " + item.id + ".");
        } else {
          seen.add(item.id);
        }
      }
    }
    if (!show.extensions || typeof show.extensions !== "object" || Array.isArray(show.extensions)) {
      errors.push("Vendor extensions must be an object.");
    }
    return { valid: errors.length === 0, errors };
  }

  function serializeShow(show) {
    const result = validateShow(show);
    if (!result.valid) throw new Error("Cannot export invalid show: " + result.errors.join(" "));
    return JSON.stringify(show, null, 2);
  }

  function parseShow(text) {
    if (typeof text !== "string") throw new TypeError("Show package input must be text.");
    if (text.length > LIMITS.packageBytes) throw new Error("Show package exceeds the 10 MB safety limit.");
    let parsed;
    try { parsed = JSON.parse(text); } catch { throw new Error("Show package is not valid JSON."); }
    const result = validateShow(parsed);
    if (!result.valid) throw new Error("Invalid show package: " + result.errors.join(" "));
    return parsed;
  }

  function createAdapterRegistry() {
    const adapters = new Map();
    return Object.freeze({
      register(adapter) {
        if (!adapter || typeof adapter.id !== "string" || !adapter.id.trim()) {
          throw new TypeError("Adapter requires a stable id.");
        }
        for (const method of ["identify", "parse", "validate", "map", "export", "capabilities"]) {
          if (typeof adapter[method] !== "function") throw new TypeError("Adapter " + adapter.id + " is missing " + method + "().");
        }
        if (adapters.has(adapter.id)) throw new Error("Adapter already registered: " + adapter.id);
        adapters.set(adapter.id, Object.freeze({ ...adapter }));
      },
      get(id) { return adapters.get(id) || null; },
      list() { return Array.from(adapters.values()).map(adapter => ({ id: adapter.id, manufacturer: adapter.manufacturer || "Unknown", formats: adapter.formats || [] })); }
    });
  }

  function createTransferReport(source, destination) {
    return {
      id: makeId("transfer"),
      createdAt: new Date().toISOString(),
      source: source || null,
      destination: destination || null,
      counts: { exact: 0, transformed: 0, needsReview: 0, unsupported: 0, notPresent: 0, unverified: 0 },
      items: [],
      status: "analysis-required"
    };
  }

  const api = Object.freeze({
    format: FORMAT,
    schemaVersion: VERSION,
    limits: Object.freeze({ ...LIMITS }),
    createShow,
    validateShow,
    serializeShow,
    parseShow,
    createAdapterRegistry,
    createTransferReport
  });

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.BZAudioSystemOSCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
