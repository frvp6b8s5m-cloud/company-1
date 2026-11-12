(function () {
  "use strict";
  const core = window.BZAudioSystemOSCore;
  const avantisCsv = window.BZAudioAvantisCsv;
  if (!core) return;
  let activeShow = core.createShow({ name: "Untitled show" });
  const $ = (id) => document.getElementById(id);
  const feedback = $("feedback");

  function render() {
    $("show-name").textContent = activeShow.metadata.name;
    const venue = activeShow.metadata.venue || "No venue assigned";
    const profile = activeShow.consoleProfiles[0];
    const origin = profile ? " · " + profile.manufacturer + " " + profile.model : " · Neutral BZaudio show package";
    $("show-meta").textContent = venue + origin;
  }
  function announce(message, isError) {
    feedback.textContent = message;
    feedback.style.color = isError ? "#f2c879" : "";
  }
  function download(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  $("new-show").addEventListener("click", () => {
    $("input-name").value = "";
    $("input-venue").value = "";
    $("show-dialog").showModal();
    $("input-name").focus();
  });
  $("show-form").addEventListener("submit", (event) => {
    if (event.submitter && event.submitter.id === "create-show") {
      event.preventDefault();
      activeShow = core.createShow({ name: $("input-name").value, venue: $("input-venue").value });
      $("show-dialog").close();
      render();
      announce("New show created in this browser session.");
    }
  });
  $("export-show").addEventListener("click", () => {
    try {
      const safeName = activeShow.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "show";
      download(safeName + ".bzaudio.json", core.serializeShow(activeShow));
      announce("Validated BZaudio neutral show backup exported. This is not a vendor-native console file.");
    } catch (error) {
      announce(error.message, true);
    }
  });
  $("import-show").addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      if (file.size > core.limits.packageBytes) throw new Error("File exceeds the 10 MB safety limit.");
      const text = await file.text();
      if (file.name.toLowerCase().endsWith(".csv")) {
        if (!avantisCsv) throw new Error("Avantis CSV adapter did not load.");
        const parsed = avantisCsv.parse(text);
        if (!parsed.valid) throw new Error("Avantis CSV validation failed: " + parsed.diagnostics.filter(d => d.severity === "error").map(d => d.message).join(" "));
        const nextShow = core.createShow({ name: "Avantis CSV import — " + file.name });
        nextShow.consoleProfiles.push({ id: "profile-avantis-import", manufacturer: "Allen & Heath", model: "Avantis", sourceFormat: "avantis-sectioned-csv", importMode: "read-only-subset" });
        nextShow.channels = parsed.show.channels;
        nextShow.routing = parsed.show.routing;
        nextShow.io = parsed.show.io;
        nextShow.extensions["allen-heath.avantis.csv"] = parsed.sections;
        activeShow = nextShow;
        render();
        const warningCount = parsed.diagnostics.filter(d => d.severity === "warning").length;
        announce("Avantis CSV imported: " + parsed.show.channels.length + " channel rows, " + parsed.show.routing.length + " output routes and " + parsed.show.io.length + " VSC rows. Partial data only; scenes, processing and native show writing are not included." + (warningCount ? " " + warningCount + " warning(s)." : ""));
      } else {
        let payload;
        try { payload = JSON.parse(text); } catch { throw new Error("File is not valid JSON."); }
        if (payload && payload.format === core.format) {
          activeShow = core.parseShow(text);
          render();
          announce("BZaudio neutral show package imported and validated.");
        } else if (payload && payload.format === "bzaudio-system-plan" && payload.schemaVersion === 1 && Array.isArray(payload.items)) {
          const nextShow = core.createShow({ name: payload.name || "Imported system plan" });
          nextShow.extensions["bzaudio.system-plan.v1"] = payload;
          activeShow = nextShow;
          render();
          announce("System Builder plan imported and preserved as a linked project extension. Equipment is not yet treated as verified console routing.");
        } else if (payload && payload.format === "bzaudio-show-sheet" && payload.schemaVersion === 1 && Array.isArray(payload.inputs)) {
          const nextShow = core.createShow({ name: payload.show || "Imported show sheet", venue: payload.venue || "", notes: payload.notes || "" });
          nextShow.channels = payload.inputs.map((input, index) => ({
            id: "show-sheet-input-" + (index + 1),
            label: String(input.source || "Unnamed input"),
            type: "input",
            extensions: { "bzaudio.show-sheet.v1": { microphone: input.mic || "", notes: input.notes || "" } }
          }));
          nextShow.extensions["bzaudio.show-sheet.v1"] = payload;
          activeShow = nextShow;
          render();
          announce("Show Workspace sheet imported: " + nextShow.channels.length + " input-list entries added to the neutral show.");
        } else {
          throw new Error("Unsupported JSON file. Import a BZaudio show, System Builder plan or Show Workspace sheet.");
        }
      }
    } catch (error) {
      announce("Import rejected: " + error.message, true);
    } finally {
      event.target.value = "";
    }
  });
  render();
})();
