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
        const imported = core.parseShow(text);
        activeShow = imported;
        render();
        announce("BZaudio neutral show package imported and validated.");
      }
    } catch (error) {
      announce("Import rejected: " + error.message, true);
    } finally {
      event.target.value = "";
    }
  });
  render();
})();
