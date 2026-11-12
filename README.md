# BZaudio

Premium professional-audio equipment, system design, installation and support.

## Website

This repository contains the BZaudio static website, built with semantic HTML, CSS and vanilla JavaScript for GitHub Pages.

### Local preview

From the repository root:

```bash
python3 -m http.server 4173
```

Open http://localhost:4173.

### Quality checks

The GitHub Actions quality workflow runs JavaScript syntax and static structure checks, then installs Playwright/Chromium and exercises the responsive navigation, PA Designer wizard and quote-request handoff in a headless browser.

### Configuration

Set the inquiry recipient in `site-config.js`:

```js
window.BZAUDIO_CONFIG = {
  inquiryEmail: "your-company-inbox@example.com"
};
```

Until a recipient is configured, the contact form opens a mail draft with the recipient left blank. The website does not transmit or store inquiry details.

### Current capabilities

- Responsive cinematic company site using real-world licensed audio photography.
- Equipment categories with quote-request handoff; no online checkout.
- Guided PA Designer that gathers venue, audience, use-case and project constraints and produces a preliminary brief. It does not calculate acoustic coverage, SPL or final loudspeaker specifications.
- Free Connection Lab introduction. Live mixer discovery/control is not advertised as available until model-specific hardware verification is complete.
- BZaudio OS roadmap overview, clearly labeled as in development.

### Asset rights

See [docs/assets.md](docs/assets.md) for image sources, licensing notes and production checks. Public source labels are not displayed unless a license or other rights holder requires attribution.

### Project process

- [Approved specification](SPEC.md)
- [Implementation plan](tasks/plan.md)
- [Task checklist](tasks/todo.md)
- [Repository baseline](docs/repository-baseline.md)
- [Connection Lab compatibility assessment](docs/connection-lab-compatibility.md)

The GitHub Pages workflow currently deploys from `main`; work on `feat/bzaudio-company-site` is not automatically published. Production release requires a separate approval.
