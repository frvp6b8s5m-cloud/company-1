# BZaudio connected product ecosystem

**Status:** approved product direction; implementation scaffold in progress  
**Repository:** this existing repository, preserved in place  
**Decision date:** 2026-11-12

## Product promise

**Your entire audio world, connected.**

BZaudio is a family of focused audio products, not a collection of unrelated websites. Each application has a clear job and can be developed and released independently while sharing contracts, design foundations and (when implemented) identity and customer/project data.

## Application map

| Product | Proposed hostname | Responsibility | Initial status |
|---|---|---|---|
| Company website | `www.bzaudio.com` | Brand, equipment discovery, product information, support and quote requests | Existing root website; preserve |
| SystemOS | `os.bzaudio.com` | Universal show workspace, show-file transfer, scenes, routing and model-specific console integrations | Existing browser prototype; evolve in place |
| System Builder | `build.bzaudio.com` | Guided design of complete audio systems, equipment selection and quote-ready bill of materials | Scaffold only |
| Compatibility Center | `compat.bzaudio.com` | Evidence-based model, firmware, accessory and feature compatibility | Scaffold only |
| Show Workspace | `shows.bzaudio.com` | Venue/show projects, stage plots, input lists, equipment plans, revisions and documents | Scaffold only |\n| FX Lab | `fx.bzaudio.com` | Browser-based real-time EQ, compression, saturation, modulation, delay and reverb | Functional browser DSP prototype |\n| BZaudio ID | `id.bzaudio.com` | Identity roadmap, profile and entry point to connected products | Local profile preview only; no authentication or cloud sync |

Hostnames are proposed and require domain ownership, DNS and hosting configuration. Do not claim they are live until verified.

## Repository strategy

Use a **monorepo** in the existing GitHub repository:

- Keep the current company website at the repository root. Do not move or replace it as part of this milestone.
- Add independently scoped applications under `apps/`.
- Put reusable, framework-neutral contracts and design foundations under `packages/`.
- Keep SystemOS's current prototype files at the root until a separately tested migration plan exists. The `apps/systemos` README documents this boundary.
- Use one feature branch per meaningful milestone and GitHub Actions for repeatable validation.
- Keep product-specific release workflows isolated so one app can ship without deploying the others.

This avoids splitting the project prematurely while keeping a clean path to separate repositories later if team size, permissions, deployment or release cadence justify it.

## Shared platform principles

1. **One brand, focused products.** Consistent BZaudio navigation, visual language, terminology and support paths.
2. **Shared contracts, not shared assumptions.** Products exchange versioned project and equipment data through explicit schemas.
3. **Identity is a later platform capability.** A unified login requires a real authentication service, session/security design, privacy policy and account recovery. Do not simulate login or claim single sign-on before it exists.
4. **Shared customer data requires consent and access control.** Keep browser-local data local unless the user explicitly chooses a cloud feature. Enforce authorization server-side when cloud services are introduced.
5. **Evidence-based compatibility.** Separate confirmed, transformed, user-review, unsupported and unverified results. Every claim is traceable to a model, firmware, test or authoritative source.
6. **Browser-first.** The initial product experiences run in the browser. Hardware discovery/control is only exposed when browser permissions, device protocols and physical tests support it.
7. **No false completion states.** Never say a quote was sent, a device connected, a show transferred or data synchronized unless the operation actually succeeded.

## Shared data concepts

- **Product/equipment record:** manufacturer, model, category, specifications, source provenance and lifecycle state.
- **Compatibility assertion:** source model/firmware, destination model/firmware, feature/field, status, evidence, test date and known limitations.
- **System design:** application/venue, equipment selections, quantities, signal paths, power/network constraints, assumptions and quote revision.
- **Show project:** venue, show dates, input list, stage plot, equipment plan, files, notes, revisions and permissions.
- **SystemOS show package:** versioned neutral show model with vendor extensions preserved; see [universal SystemOS architecture](systemos-universal-architecture.md).

Shared schemas should be versioned and validated. Apps must not silently discard unknown fields when reading/writing shared packages.

## User journeys that connect the products

### Design to quote

1. Customer creates a system in System Builder.
2. Builder checks required components and queries Compatibility Center.
3. Customer reviews assumptions and unresolved compatibility warnings.
4. Builder creates an exportable bill of materials and quote request.
5. The company website handles the quote request. No checkout, stock or automatic quote delivery is implied.

### Purchased system to show

1. Customer creates a Show Workspace project.
2. Equipment selections and compatibility evidence can be attached to that project.
3. SystemOS can import supported show files and project context.
4. SystemOS validates transfers and presents a field-by-field report before export.
5. A show is marked transferred only after export and verification succeed.

### One account (future)

A single account may eventually provide access across products. This is a platform milestone, not a placeholder login UI. It requires an identity provider, account lifecycle, secure session handling, consent, data ownership and authorization tests.

## Technical and release boundaries

- Keep the current root website's GitHub Pages workflow unchanged until an independently verified deployment design is ready.
- A single GitHub Pages site cannot automatically publish five independently domain-mapped apps from five folders as five separate sites. Each subdomain needs an explicit hosting target and DNS record. Hosting may support monorepo app roots, or apps can later move to separate repositories.
- GitHub remains the source of truth for code, issues, pull requests, tests and release history.
- CI should validate each app independently plus shared contracts. A change to a shared package should trigger all dependent app checks.
- No credentials, domain secrets, provider tokens or customer data belong in source control.
- Production cutover remains gated; do not change DNS or production branch settings as part of this scaffold.

## Delivery sequence

### Milestone 1 — Monorepo foundation
- [x] Record application boundaries and subdomain map.
- [x] Preserve existing root website and SystemOS prototype.
- [ ] Add shared design tokens and cross-app navigation contract.
- [ ] Add versioned equipment, compatibility and project contracts.
- [ ] Add per-app quality checks and preview strategy.

### Milestone 2 — Compatibility data foundation
- [ ] Define evidence-backed equipment and compatibility schemas.
- [ ] Add provenance, firmware scope, test fixture and review workflow.
- [ ] Seed only facts with reliable sources; leave unknown values unknown.

### Milestone 3 — System Builder
- [ ] Guided venue/use-case intake.
- [ ] Equipment selection and dependency checks.
- [ ] Signal path, power/network and missing-component validation.
- [ ] Save/export system design and generate quote-ready bill of materials.

### Milestone 4 — Show Workspace
- [ ] Create and organize show/venue projects.
- [ ] Input lists, stage plots and equipment plans.
- [ ] Attach files, notes, revisions and compatibility reports.
- [ ] Connect to SystemOS through versioned packages.

### Milestone 5 — SystemOS integration
- [ ] Transfer Studio UI and explicit no-adapter state.
- [ ] First researched and tested source/destination adapter pair.
- [ ] Round-trip, malformed-file, preservation and data-loss tests.
- [ ] Live device integration only after model-specific physical verification.

### Milestone 6 — FX Lab, shared identity and production\n- [x] Build browser-local Web Audio FX chain with EQ, compressor, saturation, chorus, delay and reverb controls.\n- [x] Add test tone, local audio-file playback and permission-based microphone input.\n- [ ] Add DSP unit/browser tests, clipping/latency review and accessible control refinements.\n- [ ] Design and threat-model secure identity/backend architecture.
- [ ] Select and threat-model identity/backend architecture.
- [ ] Implement authentication, authorization, account recovery and consent.
- [ ] Configure and verify hosting, DNS and HTTPS per subdomain.
- [ ] Production smoke tests, monitoring, backups and rollback for each app.

## Definition of done for a subdomain

A subdomain is not considered launched until:
- Its app has a working primary user journey, not just a landing page.
- Automated unit, integration, browser, accessibility and security checks pass.
- Data persistence, privacy and failure states are documented.
- A hosting target, DNS record and HTTPS certificate are verified.
- Its custom domain opens the correct app and links to sibling products.
- Rollback and operational ownership are documented.
