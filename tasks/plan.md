# Implementation Plan — BZaudio Website Replacement

**Status:** Draft for human approval  
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

### Phase 4 — PA Designer experience
- Build a guided project brief and system-planning intake.
- Clearly label outputs as preliminary planning, not acoustic prediction.
- Gate any numerical coverage/SPL/prediction or recommendations on validated methods and verified product data.
- Verify step navigation, validation, summary and reset.

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

## Open questions
1. Which email address should receive inquiries?
2. Is the initial equipment catalog a curated set of selected products, or should we wait for a supplier/product feed?
3. Do you have company-owned or licensed photography, or should the plan include sourcing stock photography?
4. Should checkout be deferred in favor of quote requests until payment and fulfillment are configured?
5. Confirm PA Designer starts as a guided brief rather than claiming acoustic prediction.
6. Which Allen & Heath models can be tested physically, and is a local companion app acceptable for Connection Lab networking?

## Task list
See [todo.md](todo.md) for ordered tasks and checkpoints.
