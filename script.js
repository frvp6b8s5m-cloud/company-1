(() => {
  "use strict";
  const config = window.BZAUDIO_CONFIG || {};
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  const isMobileNav = () => window.matchMedia("(max-width: 680px)").matches;
  if (nav) nav.inert = isMobileNav();
  const setMenu = (open) => {
    if (!menuButton || !nav) return;
    nav.classList.toggle("open", open);
    nav.inert = isMobileNav() && !open;
    nav.setAttribute("aria-hidden", String(isMobileNav() && !open));
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("menu-open", open);
  };
  menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  window.addEventListener("resize", () => {
    if (!isMobileNav()) setMenu(false);
    else if (menuButton?.getAttribute("aria-expanded") !== "true" && nav) { nav.inert = true; nav.setAttribute("aria-hidden", "true"); }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") { setMenu(false); menuButton.focus(); }
  });
  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll(".section-meta, .intro-grid, .service-card, .equipment-list a, .connection-card, .os-platforms > div, .contact-grid, .designer-panel");
  const heroImage = document.querySelector(".hero-image");
  if (heroImage && !reducedMotion) {
    let parallaxFrame = 0;
    const updateHeroDepth = () => {
      const offset = Math.min(window.scrollY * 0.12, 70);
      const scale = 1.025 + Math.min(window.scrollY / 10000, 0.04);
      heroImage.style.transform = "translate3d(0," + offset + "px,0) scale(" + scale + ")";
      parallaxFrame = 0;
    };
    window.addEventListener("scroll", () => {
      if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateHeroDepth);
    }, { passive: true });
  }
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, current) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          current.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((element) => { element.classList.add("reveal"); observer.observe(element); });
  }

  const wizard = document.querySelector("#pa-wizard");
  if (wizard) {
    const steps = [...wizard.querySelectorAll(".wizard-step")];
    const count = document.querySelector("#wizard-count");
    const progress = document.querySelector("#wizard-progress");
    const back = document.querySelector("#wizard-back");
    const next = document.querySelector("#wizard-next");
    const controls = document.querySelector("#wizard-controls");
    const review = document.querySelector("#wizard-review");
    const output = document.querySelector("#brief-output");
    const status = document.querySelector("#wizard-status");
    const copyButton = document.querySelector("#copy-brief");
    const useButton = document.querySelector("#use-brief");
    const editButton = document.querySelector("#wizard-edit");
    let current = 0;
    let brief = "";
    const values = () => Object.fromEntries(new FormData(wizard).entries());
    const label = (value) => value && String(value).trim() ? String(value).trim() : "Not specified";
    const makeBrief = (data) => [
      "BZAUDIO PA DESIGNER — PRELIMINARY PROJECT BRIEF",
      "",
      "SPACE",
      "Venue: " + label(data.venue),
      "Audience: " + label(data.audience),
      "Room: " + label(data.width) + " ft wide × " + label(data.length) + " ft long × " + label(data.height) + " ft high",
      "Environment: " + label(data.environment),
      "",
      "APPLICATION & SOUND GOALS",
      "Primary use: " + label(data.use),
      "Audience layout: " + label(data.audienceLayout),
      "Preferred speaker approach: " + label(data.speakerApproach),
      "Coverage priority: " + label(data.coverage),
      "Additional zones: " + label(data.zones),
      "Sources: " + label(data.sources),
      "Room challenges: " + label(data.challenges),
      "",
      "PROJECT PARAMETERS",
      "Existing equipment: " + label(data.existing),
      "Project scope: " + label(data.scope),
      "Preferred brands / equipment: " + label(data.brands),
      "Budget: " + label(data.budget),
      "Additional notes: " + label(data.notes),
      "",
      "NEXT STEP",
      "Review this brief with BZaudio to develop a verified system design and equipment quote.",
      "",
      "Planning note: This intake summary is not an acoustic prediction, coverage map, SPL calculation or final equipment specification."
    ].join("\n");
    const renderStep = () => {
      steps.forEach((step, index) => { step.hidden = index !== current; });
      review.hidden = true;
      controls.hidden = false;
      count.innerHTML = String(current + 1).padStart(2, "0") + " <span>/ 03</span>";
      progress.style.width = ((current + 1) / steps.length * 100) + "%";
      back.disabled = current === 0;
      next.textContent = current === steps.length - 1 ? "Review project brief" : "Continue →";
      status.textContent = "";
    };
    const validateCurrent = () => {
      const fields = [...steps[current].querySelectorAll("input,select,textarea")];
      for (const field of fields) {
        if (!field.checkValidity()) { field.reportValidity(); return false; }
      }
      return true;
    };
    next.addEventListener("click", () => {
      if (!validateCurrent()) return;
      if (current < steps.length - 1) { current += 1; renderStep(); return; }
      brief = makeBrief(values());
      output.textContent = brief;
      steps.forEach((step) => { step.hidden = true; });
      review.hidden = false;
      controls.hidden = true;
      count.textContent = "REVIEW";
      progress.style.width = "100%";
      status.textContent = "Your project brief is ready.";
    });
    back.addEventListener("click", () => {
      if (!review.hidden) { renderStep(); current = steps.length - 1; renderStep(); return; }
      if (current > 0) { current -= 1; renderStep(); }
    });
    editButton.addEventListener("click", () => { current = steps.length - 1; renderStep(); });
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(brief);
        status.textContent = "Project brief copied.";
      } catch {
        status.textContent = "Copy isn't available in this browser. Select the brief text to copy it.";
      }
    });
    useButton.addEventListener("click", () => {
      const message = document.querySelector('#project-form [name="message"]');
      const service = document.querySelector('#project-form [name="service"]');
      if (message) message.value = brief;
      if (service) service.value = "PA system design";
      document.querySelector("#contact")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      message?.focus({ preventScroll: true });
    });
    renderStep();
  }

  document.querySelectorAll("[data-quote]").forEach((link) => {
    link.addEventListener("click", () => {
      const service = document.querySelector('#project-form [name="service"]');
      const message = document.querySelector('#project-form [name="message"]');
      if (service) service.value = "Equipment quote";
      if (message) message.value = "I'm interested in a quote for: " + link.dataset.quote + ".\n\nPlease contact me to discuss options.";
    });
  });

  const contactForm = document.querySelector("#project-form");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const recipient = typeof config.inquiryEmail === "string" ? config.inquiryEmail.trim() : "";
    const subject = encodeURIComponent("BZaudio project inquiry — " + data.get("service"));
    const body = encodeURIComponent([
      "Name: " + data.get("name"),
      "Email: " + data.get("email"),
      "Service: " + data.get("service"),
      "Timeline: " + (data.get("timeline") || "Not specified"),
      "",
      "Project details:",
      data.get("message")
    ].join("\n"));
    const status = document.querySelector("#form-status");
    status.textContent = recipient
      ? "Your email app is opening with a draft addressed to BZaudio. Review it before sending."
      : "Your email app is opening with a draft. Add the BZaudio recipient address, review it and send when ready.";
    window.location.href = "mailto:" + encodeURIComponent(recipient) + "?subject=" + subject + "&body=" + body;
  });
})();