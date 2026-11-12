(function () {
  "use strict";
  const core = window.BZAudioSystemOSCore;
  if (!core) return;
  let activeShow = core.createShow({ name: "Untitled show" });
  const $ = (id) => document.getElementById(id);
  const feedback = $("feedback");

  function render() {
    $("show-name").textContent = activeShow.metadata.name;
    const venue = activeShow.metadata.venue || "No venue assigned";
    $("show-meta").textContent = venue + " · Neutral BZaudio show package";
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
      activeShow = core.createShow({
        name: $("input-name").value,
        venue: $("input-venue").value
      });
      $("show-dialog").close();
      render();
      announce("New show created in this browser session.");
    }
  });
  $("export-show").addEventListener("click", () => {
    try {
      const safeName = activeShow.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "show";
      download(safeName + ".bzaudio.json", core.serializeShow(activeShow));
      announce("Validated BZaudio show package exported.");
    } catch (error) {
      announce(error.message, true);
    }
  });
  $("import-show").addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      if (file.size > core.limits.packageBytes) throw new Error("File exceeds the 10 MB safety limit.");
      const imported = core.parseShow(await file.text());
      activeShow = imported;
      render();
      announce("Show package imported and validated. Vendor-native files are not supported by this importer yet.");
    } catch (error) {
      announce("Import rejected: " + error.message, true);
    } finally {
      event.target.value = "";
    }
  });
  render();
})();
