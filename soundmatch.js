(() => {
  "use strict";

  const form = document.querySelector("#soundmatch-form");
  if (!form) return;

  const steps = [...form.querySelectorAll(".sm-step")];
  const count = document.querySelector("#sm-count");
  const progress = document.querySelector("#sm-progress-bar");
  const back = document.querySelector("#sm-back");
  const next = document.querySelector("#sm-next");
  const controls = form.querySelector(".sm-controls");
  const review = document.querySelector("#sm-review");
  const builder = document.querySelector("#sm-builder");
  const briefOutput = document.querySelector("#sm-brief");
  const status = document.querySelector("#sm-status");
  const storageKey = "bzaudio.soundmatch.drafts.v1";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let items = [];

  const values = () => Object.fromEntries(new FormData(form).entries());
  const clean = (value) => String(value ?? "").trim() || "Not specified";
  const tierNames = { essential: "Essential", recommended: "Recommended", professional: "Professional" };

  const buildBrief = () => {
    const data = values();
    const lines = [
      "BZAUDIO SOUNDMATCH — SYSTEM PLANNING BRIEF",
      "",
      "VENUE",
      "Venue: " + clean(data["sm-venue"]),
      "Audience: " + clean(data["sm-audience"]),
      "Environment: " + clean(data["sm-environment"]),
      "Layout: " + clean(data["sm-layout"]),
      "Room: " + clean(data["sm-width"]) + " ft wide × " + clean(data["sm-length"]) + " ft long",
      "",
      "APPLICATION",
      "Primary use: " + clean(data["sm-application"]),
      "Coverage priority: " + clean(data["sm-coverage"]),
      "Zones: " + clean(data["sm-zones"]),
      "Subwoofer goal: " + clean(data["sm-sub-goal"]),
      "Sources: " + clean(data["sm-sources"]),
      "",
      "MIXING AND I/O",
      "Console: " + clean(data["sm-mixer"]),
      "Input channels: " + clean(data["sm-inputCount"]),
      "Stage I/O: " + clean(data["sm-stageIO"]),
      "Recording / streaming: " + clean(data["sm-recording"]),
      "Existing console: " + clean(data["sm-console-owned"]),
      "",
      "LOUDSPEAKERS AND AMPLIFICATION",
      "Main speaker approach: " + clean(data["sm-speakerApproach"]),
      "Main speakers: " + clean(data["sm-main-count"]),
      "Subwoofers: " + clean(data["sm-subCount"]),
      "Monitors: " + clean(data["sm-monitorCount"]),
      "Amplification / DSP: " + clean(data["sm-amplification"]),
      "Microphones / wireless: " + clean(data["sm-microphones"]),
      "",
      "INFRASTRUCTURE",
      "Installation: " + clean(data["sm-infrastructure"]),
      "Mounting: " + clean(data["sm-mounting"]),
      "Networking: " + clean(data["sm-network"]),
      "Expansion: " + clean(data["sm-expansion"]),
      "Constraints: " + clean(data["sm-infra-notes"]),
      "",
      "PROJECT",
      "Existing system: " + clean(data["sm-existing"]),
      "Scope: " + clean(data["sm-scope"]),
      "Budget: " + clean(data["sm-budget"]),
      "Timeline: " + clean(data["sm-timeline"]),
      "Notes / existing gear: " + clean(data["sm-notes"]),
      "",
      "CUSTOM EQUIPMENT PLANNING"
    ];

    for (const tier of Object.keys(tierNames)) {
      lines.push("", tierNames[tier].toUpperCase());
      const tierItems = items.filter((item) => item.tier === tier);
      if (!tierItems.length) lines.push("No components added yet.");
      tierItems.forEach((item) => lines.push(item.quantity + " × " + item.category + " — " + item.name));
    }

    lines.push(
      "",
      "VERIFICATION NOTE",
      "This is a preliminary planning and quote brief. It is not a product recommendation, compatibility certificate, acoustic prediction, SPL calculation, electrical design or final equipment specification. BZaudio must verify exact models, system fit, availability and engineering requirements."
    );
    return lines.join("\n");
  };

  const renderStep = () => {
    steps.forEach((step, index) => { step.hidden = index !== current; });
    review.hidden = true;
    builder.hidden = true;
    controls.hidden = false;
    count.textContent = String(current + 1).padStart(2, "0") + " / 06";
    progress.style.width = ((current + 1) / steps.length * 100) + "%";
    back.disabled = current === 0;
    next.textContent = current === steps.length - 1 ? "Review system brief →" : "Continue →";
    status.textContent = "";
  };

  const renderItems = () => {
    for (const tier of Object.keys(tierNames)) {
      const list = document.querySelector("#sm-items-" + tier);
      list.replaceChildren();
      const tierItems = items.filter((item) => item.tier === tier);
      if (!tierItems.length) {
        const empty = document.createElement("li");
        empty.className = "sm-empty";
        empty.textContent = "No components added";
        list.append(empty);
      }
      tierItems.forEach((item) => {
        const row = document.createElement("li");
        const detail = document.createElement("span");
        detail.textContent = item.quantity + " × " + item.category + " — " + item.name;
        const verification = document.createElement("small");
        verification.className = "sm-unverified";
        verification.textContent = "UNVERIFIED / REVIEW REQUIRED";
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "sm-remove";
        remove.textContent = "Remove";
        remove.setAttribute("aria-label", "Remove " + item.name + " from " + tierNames[tier]);
        remove.addEventListener("click", () => {
          items = items.filter((candidate) => candidate.id !== item.id);
          renderItems();
          briefOutput.textContent = buildBrief();
        });
        row.append(detail, verification, remove);
        list.append(row);
      });
    }
  };

  const readSaved = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(parsed) ? parsed.filter((draft) => draft && typeof draft.id === "string" && typeof draft.name === "string" && draft.values && Array.isArray(draft.items)) : [];
    } catch {
      return [];
    }
  };

  const writeSaved = (drafts) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(drafts));
      return true;
    } catch {
      status.textContent = "This browser could not save the design. Copy the brief to keep a backup.";
      return false;
    }
  };

  const renderSaved = () => {
    const select = document.querySelector("#sm-saved-select");
    const drafts = readSaved();
    select.replaceChildren();
    if (!drafts.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No saved designs";
      select.append(option);
    } else {
      drafts.forEach((draft) => {
        const option = document.createElement("option");
        option.value = draft.id;
        option.textContent = draft.name;
        select.append(option);
      });
    }
  };

  const showReview = () => {
    steps.forEach((step) => { step.hidden = true; });
    controls.hidden = true;
    review.hidden = false;
    builder.hidden = false;
    count.textContent = "REVIEW";
    progress.style.width = "100%";
    briefOutput.textContent = buildBrief();
    renderItems();
    renderSaved();
    status.textContent = "Your SoundMatch system brief is ready.";
  };

  next.addEventListener("click", () => {
    const fields = [...steps[current].querySelectorAll("input,select,textarea")];
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return;
      }
    }
    if (current < steps.length - 1) {
      current += 1;
      renderStep();
    } else {
      showReview();
    }
  });

  back.addEventListener("click", () => {
    if (current > 0) {
      current -= 1;
      renderStep();
    }
  });

  document.querySelector("#sm-edit").addEventListener("click", () => {
    current = steps.length - 1;
    renderStep();
  });

  document.querySelector("#sm-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(buildBrief());
      status.textContent = "SoundMatch brief copied.";
    } catch {
      status.textContent = "Copy is unavailable in this browser. Select the brief text to copy it.";
    }
  });

  document.querySelector("#sm-quote").addEventListener("click", () => {
    const message = document.querySelector('#project-form [name="message"]');
    const service = document.querySelector('#project-form [name="service"]');
    if (message) message.value = buildBrief();
    if (service) service.value = "Equipment quote";
    document.querySelector("#contact")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    message?.focus({ preventScroll: true });
  });

  document.querySelector("#sm-add-item").addEventListener("click", () => {
    const nameInput = document.querySelector("#sm-item-name");
    const quantityInput = document.querySelector("#sm-quantity");
    const name = nameInput.value.trim();
    const quantity = Number(quantityInput.value);
    if (!name) {
      status.textContent = "Enter a component or model before adding it.";
      nameInput.focus();
      return;
    }
    if (!quantityInput.checkValidity() || !Number.isInteger(quantity)) {
      quantityInput.reportValidity();
      return;
    }
    if (items.length >= 50) {
      status.textContent = "A system plan can contain up to 50 components.";
      return;
    }
    items.push({
      id: String(Date.now()) + "-" + String(items.length),
      tier: document.querySelector("#sm-tier").value,
      category: document.querySelector("#sm-category").value,
      name: name.slice(0, 100),
      quantity
    });
    nameInput.value = "";
    quantityInput.value = "1";
    renderItems();
    briefOutput.textContent = buildBrief();
    status.textContent = "Component added to the " + tierNames[items[items.length - 1].tier] + " plan.";
  });

  document.querySelector("#sm-save").addEventListener("click", () => {
    const name = document.querySelector("#sm-design-name").value.trim();
    if (!name) {
      status.textContent = "Give this design a name before saving.";
      document.querySelector("#sm-design-name").focus();
      return;
    }
    const drafts = readSaved();
    if (drafts.length >= 10) {
      status.textContent = "You can keep up to 10 saved designs in this browser. Delete one to make room.";
      return;
    }
    const id = String(Date.now());
    drafts.push({ id, name: name.slice(0, 60), values: values(), items: items.map((item) => ({ ...item })) });
    if (writeSaved(drafts)) {
      renderSaved();
      document.querySelector("#sm-saved-select").value = id;
      status.textContent = "Design saved in this browser.";
    }
  });

  document.querySelector("#sm-load").addEventListener("click", () => {
    const id = document.querySelector("#sm-saved-select").value;
    const draft = readSaved().find((candidate) => candidate.id === id);
    if (!draft) {
      status.textContent = "Choose a saved design to load.";
      return;
    }
    for (const [name, value] of Object.entries(draft.values)) {
      const field = form.elements.namedItem(name);
      if (field) field.value = value;
    }
    items = draft.items.filter((item) => item && Object.hasOwn(tierNames, item.tier) && typeof item.name === "string").map((item, index) => ({
      id: String(Date.now()) + "-" + index,
      tier: item.tier,
      category: String(item.category || "Other"),
      name: item.name.slice(0, 100),
      quantity: Math.min(100, Math.max(1, Number(item.quantity) || 1))
    }));
    current = steps.length - 1;
    renderStep();
    renderItems();
    status.textContent = "Saved design loaded. Continue to review your system.";
  });

  document.querySelector("#sm-delete").addEventListener("click", () => {
    const id = document.querySelector("#sm-saved-select").value;
    if (!id) {
      status.textContent = "Choose a saved design to delete.";
      return;
    }
    const drafts = readSaved().filter((draft) => draft.id !== id);
    if (writeSaved(drafts)) {
      renderSaved();
      status.textContent = "Saved design deleted from this browser.";
    }
  });

  renderSaved();
  renderStep();
})();