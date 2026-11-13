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

The GitHub Actions quality workflow runs JavaScript syntax and static structure checks, then installs Playwright/Chromium and exercises responsive navigation, the six-stage SoundMatch wizard, editable component tiers, browser-local draft persistence, clipboard output and quote-request handoff. Separate browser tests cover SystemOS, FX Lab audio sources and custom presets, and the BZaudio ID local profile. The latest fully green run checked browser behavior, strict axe-core accessibility, performance/CDN responses and responsive screenshot generation.

### Configuration

Set the inquiry recipient in `site-config.js`:

```js
window.BZAUDIO_CONFIG = {
  inquiryEmail: "your-company-inbox@example.com"
};
```

Until a recipient is configured, the contact form opens a mail draft with the recipient left blank. The website does not transmit or store inquiry details.

### Current capabilities

- Responsive architectural BZaudio company site with real-world audio photography, industrial geometry, precise typography and reduced-motion-aware motion.
- Equipment categories with quote-request handoff; no checkout or unverified prices/stock.
- SoundMatch six-stage system configurator (the only guided customer quiz) with editable equipment tiers, copyable quote brief and browser-local saved drafts.
- SystemOS engineering workspace with systems, equipment, signal flow, patchbay, network, commissioning, references and maintenance records, local persistence and JSON backup/restore.
- Six companion apps: SystemOS, System Builder, Compatibility Center, Show Workspace, FX Lab and BZaudio ID. Each has a standalone browser bundle; hosting and custom DNS are still pending.
- Contact inquiry validates details and opens a user-reviewed email draft; it does not claim automatic delivery.
- Hardware control, live mixer discovery, acoustic prediction and cloud accounts are not exposed as working capabilities without engineering and real-device verification.

### Asset rights

See [docs/assets.md](docs/assets.md) for image sources, licensing notes and production checks. Public source labels are not displayed unless a license or other rights holder requires attribution.

### Project process

- [Approved specification](SPEC.md)
- [Implementation plan](tasks/plan.md)
- [Task checklist](tasks/todo.md)
- [Repository baseline](docs/repository-baseline.md)
- [Connection Lab compatibility assessment](docs/connection-lab-compatibility.md)
- [Security and privacy review](docs/security-review.md)

### BZaudio application ecosystem

The approved direction is a GitHub-managed application ecosystem with independently developed products for the company site, SystemOS, System Builder, Compatibility Center, Show Workspace, FX Lab and BZaudio ID. See [docs/bzaudio-ecosystem-architecture.md](docs/bzaudio-ecosystem-architecture.md) for the repository layout, shared contracts, hosting constraints and staged subdomain release plan. The hostnames listed there are proposed; DNS and separate hosting targets must be configured before they are live. The existing company site and its GitHub Pages workflow remain unchanged during application development.

### GitHub Pages deployment

The GitHub Pages workflow deploys `main` only. Feature-branch pushes run quality checks and upload visual-review artifacts/build bundles; they do not publish a public preview. The Pages workflow deploys `main` only. Custom subdomains require separate hosting targets and DNS configuration. Do not merge to `main` until the configured inquiry recipient and release checklist are complete.
