# Implementation Plan — BZaudio Website Replacement

**Status:** Approved for implementation on 2026-11-12  
**Spec:** [SPEC.md](../SPEC.md)  
**Branch:** `feat/bzaudio-company-site`  
**Task list:** [todo.md](todo.md)

## Overview
Replace the current single-page HTML/CSS/JS starter in independently testable vertical slices. Keep GitHub Pages and the static stack unless repository inspection or a verified requirement justifies a change. Do not deploy to the default branch during implementation.

## Repository findings
- Current branch contains `index.html`, `styles.css`, `script.js`, `README.md`, and `.github/workflows/pages.yml`.
- Existing page is a static single-page site; no `package.json`, test runner, backend, catalog, product data, or real contact recipient was found at the root.
- Current visual system uses CSS-generated abstract graphics; this is to be replaced by licensed real-world photography and editorial architecture.
- Existing workflow is GitHub Pages; inspect it before changing deployment behavior.
- `tasks/` did not exist at the inspected branch root, so no pre-existing plan/task checklist was overwritten.

## Architecture decisions
1. **Static-first:** retain HTML/CSS/vanilla JS and GitHub Pages initially; this minimizes migration risk and suits a content-led site. Revisit only if real commerce/backend requirements are approved.
2. **Progressive enhancement:** semantic HTML is usable without animation; JS adds menu, filtering and guided flows.
3. **Feature-scoped source:** organize CSS and JS by concern while keeping deployment simple; avoid premature framework/dependency additions.
4. **Content/data separation:** store verified product and compatibility metadata in structured local data; unknown fields remain absent, never fabricated.
5. **Safe integrations:** quote/contact flows first. No payment, customer storage, network scanning or mixer control until providers, permissions, protocols and test hardware are approved.
6. **Photography governance:** every production image must have documented source, license/permission and responsive optimized variants.

## Dependency graph
`brand tokens + semantic shell → shared navigation/layout → module page/section slices → form/data behavior → integrated accessibility/performance review → Pages staging verification → release`.

Connection Lab has an additional dependency: `verified protocol/model matrix + safe test plan + real hardware`. Without those, only an honest informational/roadmap experience may be shipped.

## Vertical-slice phases

### Phase 0 — Repository and release baseline
- Capture current branch head and inspect the Pages workflow.
- Record baseline behavior and preserve a rollback point.
- Define asset source/rights ledger and validation commands.

### Phase 1 — Brand experience
- Replace starter visuals with approved cinematic architectural art direction.
- Build responsive header, navigation, hero, typography, section rhythm and footer.
- Use real licensed images only; optimize loading and provide fallbacks.
- Verify mobile menu, keyboard operation, reduced motion and layout.

### Phase 2 — Services and customer inquiry
- Create coherent PA design, installation, tuning and support content.
- Build accessible guided project brief.
- Keep submission behavior transparent; email-draft until a real delivery service is approved.
- Verify required fields, email validation and no false sent confirmation.

### Phase 3 — Equipment discovery
- Add category navigation and search/filter interactions over verified catalog records.
- Create product detail presentation with specifications only from reliable source data.
- Provide quote/contact paths; no checkout or invented prices/stock.
- Verify empty states, filters, product detail links and keyboard use.

### Phase 4 — PA Designer experience (included)
- Build an advanced, guided project-planning wizard with venue/application, dimensions, audience/use, coverage goals, system priorities, constraints and budget inputs.
- Provide a useful, editable project summary and equipment/quote brief from user inputs; clearly label this as preliminary planning, not acoustic prediction.
- Gate any numerical coverage/SPL/prediction or automated equipment recommendations on validated methods, verified product data and engineering review.
- Verify step navigation, validation, conditional questions, back/next, save/export behavior if implemented, summary and reset.

### Phase 5 — Free Connection Lab
- Build free entry point and verified model/capability status presentation.
- Separate discovery, monitoring and control permissions.
- Only implement browser/local companion connectivity after protocol research, permission design, recovery behavior and physical hardware tests.
- No simulated live devices or unsupported family-wide claims.

### Phase 6 — BZaudio OS and ecosystem
- Present dedicated device OS, Windows/macOS software and touchscreen controller.
- Distinguish planned, prototype and available capabilities.
- Verify links, roadmap labels and mobile layout.

### Phase 7 — Integrated QA and release candidate
- Run automated static checks, unit tests and browser smoke tests.
- Audit accessibility, reduced motion, responsive behavior, image licensing, performance and security.
- Test GitHub Pages build/deploy on feature branch or preview.
- Prepare release notes and rollback instructions. Do not merge to `main` or publish a production cutover without explicit approval.

## Task sizing and checkpoints
Tasks are deliberately split into small feature slices (usually 1–5 files per task). Each task in `todo.md` includes acceptance criteria, verification, dependencies and likely files. Stop at each checkpoint for test results and human review before moving to the next high-risk phase.

## Risks and mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| No licensed photo library provided | High visual-quality / legal risk | Source approved licensed assets and track provenance; don't ship unlicensed images |
| No product catalog or pricing feed | High accuracy risk | Build data-driven UI with verified data only; quote path instead of fabricated pricing |
| Checkout requirements unspecified | High integration/security risk | Keep checkout out of scope until provider and fulfillment are approved |
| Browser local-network restrictions | High Connection Lab risk | Companion-app architecture; no fake browser scanning |
| Allen & Heath protocols vary by model | High hardware safety risk | Model-by-model capability matrix and real-hardware tests; monitoring/control separated |
| PA acoustic calculations need validated inputs | High safety/reliability risk | Start with intake/planning; don't present unvalidated predictions |
| Static site may not support future dynamic features | Medium architecture risk | Keep boundaries modular; reassess only with an approved backend requirement |
| Heavy cinematic media/animation | Medium performance/accessibility risk | Responsive images, lazy loading, reduced-motion mode, performance budgets |

## Release / rollback
- Keep work on `feat/bzaudio-company-site`.
- Use GitHub Pages preview/branch deployment if configured; inspect workflow before changing it.
- Record the known-good commit before replacement.
- Roll back by reverting the feature-branch commit(s) or restoring the previous Pages artifact; verify the published page and Actions status.
- Production cutover/default-branch merge is a separate approval.

## Confirmed decisions and remaining dependencies
- Equipment sales begin with quote requests; checkout is deferred.
- Source licensed real-world photography. Track provenance and rights internally; do not show source labels publicly unless the license requires it.
- PA Designer is included as a guided PA-planning wizard and project summary. Validated acoustic calculations are a later engineering milestone, not a launch promise.
- Contact inquiry recipient email remains configurable. Until an address or delivery backend is provided, generate a reviewable email draft; never claim delivery.
- Remaining dependencies: verified product catalog/source, approved contact recipient, physical Allen & Heath test models, and the Connection Lab companion/network architecture.

## Task list
See [todo.md](todo.md) for ordered tasks and checkpoints.


## User-approved clarifications (2026-11-12)
- Quote requests initially; no checkout.
- Licensed authentic photography; provenance stored in project docs, no visible source labels unless required by license.
- PA Designer included as a guided planning wizard first. Validated acoustic calculations remain a separately verified milestone.
- Contact recipient is configurable; email draft until a real delivery address/service is approved.


## Authorization and execution update — 2026-11-12
The project owner has authorized continued implementation, verification, review, repository integration and launch work going forward. This supersedes the earlier requirement to stop for a separate approval before each ordinary project step. Safety and factual gates remain: do not invent contact details, product data, compatibility, measured acoustic results or external credentials; do not enable mixer write/control without model-specific hardware verification; do not incur paid-service costs without a real configured account and budget authority.

The current implementation remains static-first and quote-request-led. The site has no product data feed, confirmed contact recipient, backend delivery service or validated acoustic engine. These are explicit capability boundaries, not defects to conceal. Work may proceed to a production release only after the release checklist, contact handoff decision, image-rights inspection and deployment verification are complete.
