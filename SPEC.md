# BZaudio Website Specification

**Version:** 1.0 — approved 2026-11-12  
**Repository:** `frvp6b8s5m-cloud/company-1`  
**Working branch:** `feat/bzaudio-company-site`  
**Status:** Approved for implementation; ongoing work authorized 2026-11-12.

## Objective
Replace the existing single-page BZaudio site with a cohesive, premium professional-audio company website. The experience combines a cinematic, real-world architectural art direction with useful equipment discovery, PA services, a free Connection Lab entry point, and an accurate introduction to the BZaudio OS ecosystem.

Primary audience: live-sound engineers, venues, houses of worship, schools, institutions, commercial customers, and audio buyers. Success means the site is visually distinctive, genuinely usable on mobile and desktop, honest about available functionality, accessible, performant, and maintainable.

## Approved capability map
| Module ID | Responsibility | Depends on |
|---|---|---|
| brand-experience | Brand system, navigation, homepage, responsive motion | — |
| equipment-marketplace | Equipment categories, discovery, product information and quote paths | brand-experience |
| pa-services-designer | Service information and guided PA project brief | brand-experience |
| connection-lab | Free Connection Lab introduction and verified compatibility/connection experience | brand-experience; protocol validation |
| bzaudio-os | Dedicated OS, Windows/macOS software and touchscreen ecosystem overview | brand-experience |
| customer-contact | Contact and project inquiry workflows | brand-experience |

Build order: brand-experience → equipment-marketplace and pa-services-designer → customer-contact → connection-lab → bzaudio-os → integrated review and release. The Connection Lab UI may ship before hardware integration only if it clearly labels unavailable capabilities and never simulates a live connection.

## Visual and interaction requirements
- Real-world photography of actual audio equipment, venues, studios, installations and architecture; only assets with confirmed usage rights.
- No AI-looking imagery, robot imagery, synthetic neural-network motifs, or generic sci-fi graphics.
- Premium architectural/editorial composition, strong typography, deliberate whitespace and restrained material palette.
- Cinematic but purposeful transitions, layered photography and scroll choreography; animations must not impair navigation, readability, battery life or accessibility.
- Realistic 3D equipment only when authentic models/assets and performance budgets are available.
- Mobile-first responsive behavior, keyboard operation, visible focus, semantic structure and reduced-motion support.

## Functional scope
### Brand experience
Homepage, clear navigation, company positioning, featured services, featured technology and responsive footer.

### Equipment marketplace
Category discovery, search/filter/sort where a reliable catalog exists, product detail/specification presentation, and inquiry/quote actions. Do not invent products, stock, pricing, reviews, manufacturer relationships, or checkout status. Payment/checkout is out of scope until a provider, catalog source, tax/shipping rules and credentials are approved.

### PA services and designer
Explain PA design, installation, tuning and support. Provide a guided project brief for venue/application, room information, audience/use, priorities and budget. Do not claim engineering-grade coverage, SPL, prediction or equipment recommendations until validated calculation methods and data are implemented and independently checked.

### Customer contact
Accessible project inquiry form with validation and a clearly disclosed delivery mechanism. Until an approved backend/email service and recipient address exist, use a user-reviewed email-draft flow; never imply a message was sent.

### Free Connection Lab
Free website entry point. Present only model-specific verified Allen & Heath compatibility. Distinguish discovery, monitoring and control. Browser local-network restrictions may require a local companion app. No network scanning, mixer control, or live connection claim until protocol, permissions, recovery behavior and real hardware tests are verified. Unknown models must be marked unverified, not supported.

### BZaudio OS
Accurately introduce the planned ecosystem: dedicated-device operating system, Windows/macOS platform and dedicated touchscreen controller. Label roadmap capabilities as planned, not available.

## Technology and project constraints
- Existing branch is a small static HTML/CSS/vanilla JavaScript website with GitHub Pages workflow; no package manifest or application framework was present in the inspected root.
- Prefer preserving the static deployment model initially. Introduce a framework or dependencies only with documented justification and human approval.
- Keep semantic HTML, modular CSS and progressively enhanced JavaScript. Avoid unnecessary dependencies.
- Do not add backend services, payment integrations, analytics, authentication, customer data storage or network-control privileges without explicit approval.
- Preserve repository history. Work only on `feat/bzaudio-company-site`; do not modify `main`, unrelated repositories, or the separate BZaudio toolbox/OS repositories.

## Commands and verification
Current baseline has no package scripts. Until a test harness is approved/added:
- JavaScript syntax: `node --check script.js` (and each new JS entry file).
- Local preview: `python3 -m http.server 4173` from the site root.
- Deployment verification: inspect the GitHub Pages Actions run and test the published URL after deployment.
The plan must add repeatable automated checks appropriate to the chosen architecture (HTML validation, unit tests for pure logic, and browser-level smoke tests where feasible) before release. Never claim tests ran if they were not run.

## Project structure target
Keep the static site understandable and avoid framework migration by default. Proposed structure:
- `index.html`: homepage shell and semantic page sections
- `styles/`: design tokens, layout, component and responsive styles (or a small number of focused CSS files)
- `scripts/`: navigation, motion and feature-specific behavior
- `assets/`: licensed photography, product imagery, icons and fonts with source/license notes
- `docs/`: architecture, asset credits, capability/compatibility status
- `tasks/plan.md`, `tasks/todo.md`: approved plan and execution checklist
Existing deployment workflow remains until its replacement is tested.

## Code style
- Use descriptive kebab-case file names and CSS classes.
- Prefer semantic HTML elements and native browser capabilities.
- Keep JavaScript functions small and feature-scoped; validate form input at boundaries.
- Use CSS custom properties for design tokens; avoid inline style duplication.
- Respect `prefers-reduced-motion`; all controls must be keyboard accessible.
- Do not add fake links, inert buttons, fabricated content, or silent failure states.

## Testing strategy
- Syntax and static validation on every change.
- Unit tests for pure validation, filtering and formatting logic.
- Browser smoke tests for navigation, responsive menu, forms, product discovery and reduced-motion behavior.
- Manual checks at narrow mobile, tablet and desktop breakpoints, keyboard-only navigation, and a screen reader spot check.
- Performance review for image weight, layout shift, animation cost and Core Web Vitals.
- Connection Lab hardware/protocol verification is a separate gate requiring actual supported mixer models and safe test conditions.

## Boundaries
### Always do
- Work on the approved feature branch and preserve history.
- Keep product/compatibility/roadmap claims accurate.
- Test each vertical slice and document results.
- Use licensed or user-provided imagery and record provenance.
- Keep Connection Lab free and clearly distinguish planned from live features.

### Ask first
- Framework migration or new production dependencies.
- Checkout/payment provider, backend, customer database, email service, analytics or tracking.
- Domain/DNS changes, deployment configuration changes that affect production, or launch to the default branch.
- Real mixer control commands or privileged local-network companion behavior.
- Any paid-feature boundary or pricing decision.

### Never do
- Force-push or rewrite Git history.
- Modify `main` without separate approval.
- Claim untested Allen & Heath compatibility or send unverified control commands.
- Present mock data or placeholder behavior as live functionality.
- Commit secrets, private customer data, unlicensed images, or generated fake testimonials/reviews.

## Success criteria
- The complete site has one consistent premium architectural identity and contains no AI-style visual motifs.
- All approved modules have accurate content and working navigation.
- All interactive controls work and all forms clearly communicate their delivery behavior.
- Layouts and interactions work at mobile, tablet and desktop sizes.
- Keyboard access, focus visibility, semantic structure and reduced-motion support pass review.
- No broken links, missing assets, uncaught console errors or critical accessibility findings.
- Images have documented rights/provenance and are optimized.
- Automated checks and build/deployment checks pass; release is reversible.
- No unsupported product, pricing, compatibility or feature claims remain.

## Open questions / release dependencies
- Approved company contact email and any physical business details.
- Product catalog source, pricing/stock source, manufacturer permissions and whether checkout is desired.
- Licensed/company-owned photography and authentic equipment image/model assets.
- Payment provider and fulfillment details, if checkout is later approved.
- Whether PA Designer is initially a guided project brief or a validated acoustic calculation tool.
- Which Allen & Heath mixer models and protocols can be physically tested; no universal compatibility claim is permitted.
- Local companion-app architecture and supported operating systems for Connection Lab hardware networking.


## Approved clarifications — 2026-11-12
- Equipment sales begin with **quote requests**; no online checkout or payment flow in this release.
- Source authentic, commercially licensed professional photography. Keep provenance and license records in the project documentation; do not show public source labels unless a license requires attribution.
- PA Designer **is included**. Start with a guided PA-planning wizard and clear project summary. Do not promise perfect results or acoustic predictions. Validated acoustic calculations are a later engineering milestone requiring verified speaker data, documented methods and test evidence.
- Contact/project inquiry functionality is included. Keep the recipient email configurable; until an approved address or delivery backend is supplied, provide a reviewable email-draft flow and never claim that an inquiry was sent.
