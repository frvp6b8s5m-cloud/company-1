# BZaudio Public Website — Implementation Task List

**Plan:** [plan.md](plan.md)  
**Specification:** [SPEC.md](../SPEC.md)  
**Branch:** `feat/bzaudio-company-site`  
**Status:** Awaiting owner approval of the revised technical plan. **No implementation may begin yet.**

## Re-plan notice — 2026-11-12

This task list supersedes the previous OS- and tool-heavy website task list. The previous list had 63 unchecked tasks. They are **superseded, not completed**; the previous versions remain available in Git history.

The new scope is the approved public BZaudio website: architectural/cinematic brand experience, refined animation, simple navigation, verified product and solution information, About, and quote/contact. The website will not promote or contain an OS, SystemOS, duplicate quizzes, PA Designer, Connection Lab, customer portal, checkout, or experimental app directory. Existing independent app workspaces remain untouched by this website plan.

No task below may start until the owner approves [tasks/plan.md](plan.md).

## Phase 0 — Scope and baseline reconciliation

### Task 0.1 — Confirm branch baseline and rollback point
- [ ] **Acceptance:** active branch head, existing workflows, package scripts, and rollback point are recorded before code changes.
- [ ] **Verify:** inspect Git branch/head and current GitHub Actions status; record the commit SHA.
- **Dependencies:** None.
- **Files likely touched:** `docs/repository-baseline.md`.
- **Scope:** Small.

### Task 0.2 — Reconcile public-site information architecture
- [ ] **Acceptance:** public navigation and content map contain only Home, Products, Solutions, About, and Contact/Quote; OS and experimental app promotions are excluded from the public-site plan.
- [ ] **Verify:** review all current navigation links and visible calls to action against SPEC.md; confirm no required destination is missing.
- **Dependencies:** 0.1.
- **Files likely touched:** `index.html`, `SPEC.md`, `tasks/plan.md`.
- **Scope:** Medium.

## Phase 1 — Design and motion foundations

### Task 1.1 — Establish architectural design tokens
- [ ] **Acceptance:** typography, spacing, grid, surfaces, color, borders, image treatment, and responsive breakpoints use a consistent token system.
- [ ] **Verify:** inspect representative sections at phone, tablet, and desktop widths; check contrast and hierarchy.
- **Dependencies:** Phase 0.
- **Files likely touched:** existing site stylesheet(s), with a focused token file if needed.
- **Scope:** Medium.

### Task 1.2 — Define the BZaudio motion system
- [ ] **Acceptance:** hero, section reveal, navigation, image, and control animations share consistent easing/duration; reduced-motion alternatives are included.
- [ ] **Verify:** test with normal motion and `prefers-reduced-motion: reduce`; confirm no scroll hijacking, hidden content, or navigation delay.
- **Dependencies:** 1.1.
- **Files likely touched:** existing site stylesheet(s), `script.js` or a focused motion script.
- **Scope:** Medium.

## Checkpoint A — Foundations
- [ ] Navigation and content hierarchy approved against the updated specification.
- [ ] Architectural/cinematic identity visibly preserved.
- [ ] Motion system and reduced-motion behavior reviewed before expanding the pages.

## Phase 2 — Core brand experience

### Task 2.1 — Refine the cinematic homepage
- [ ] **Acceptance:** homepage communicates what BZaudio does, uses genuine licensed photography, has a clear primary action, and preserves the architectural/cinematic art direction.
- [ ] **Verify:** responsive visual review, image-rights ledger review, hero load and layout-shift checks.
- **Dependencies:** Phase 1.
- **Files likely touched:** `index.html`, site CSS, image/asset references, `docs/assets.md`.
- **Scope:** Medium.

### Task 2.2 — Simplify navigation and section flow
- [ ] **Acceptance:** short primary navigation leads to Home, Products, Solutions, About, and Contact/Quote; mobile menu is clear and fully operable.
- [ ] **Verify:** browser tests for all links, mobile open/close, Escape behavior, keyboard focus, and touch interaction.
- **Dependencies:** 2.1.
- **Files likely touched:** `index.html`, `script.js`, site CSS.
- **Scope:** Medium.

## Checkpoint B — Brand experience
- [ ] Primary proposition is immediately understandable.
- [ ] Visitors can reach products, solutions, about information, and quote/contact without confusion.
- [ ] Mobile and desktop layouts preserve the same hierarchy.

## Phase 3 — Products and solutions

### Task 3.1 — Build verified product-category discovery
- [ ] **Acceptance:** product categories are understandable, accurate, and linked to quote/contact; no fabricated SKUs, specs, prices, stock, reviews, or compatibility claims.
- [ ] **Verify:** content/source audit, link checks, keyboard navigation, and responsive review.
- **Dependencies:** Phase 2.
- **Files likely touched:** product content/markup, site CSS, `site-config.js` only if configuration is needed.
- **Scope:** Medium.

### Task 3.2 — Present customer solutions clearly
- [ ] **Acceptance:** solutions explain relevant applications and service approaches in plain language with optional technical depth; no unvalidated engineering guarantees.
- [ ] **Verify:** review each claim against available evidence; test all inquiry links and mobile layouts.
- **Dependencies:** 3.1.
- **Files likely touched:** solution content/markup and site CSS.
- **Scope:** Medium.

## Checkpoint C — Product and solution clarity
- [ ] Product and solution claims have source evidence or are clearly qualified.
- [ ] Quote paths work from relevant product and solution contexts.
- [ ] No future/experimental capability is represented as available.

## Phase 4 — About and customer inquiry

### Task 4.1 — Present the BZaudio company story
- [ ] **Acceptance:** About content reflects the approved mission, customer promise, brand belief, and trust standards without overwhelming visitors.
- [ ] **Verify:** compare published copy to VISION.md; check readability and mobile hierarchy.
- **Dependencies:** Phase 2.
- **Files likely touched:** About content/markup and site CSS.
- **Scope:** Small.

### Task 4.2 — Refine quote and contact handoff
- [ ] **Acceptance:** inquiry fields are clear and proportionate; validation is accessible; destination remains configurable; the user is told exactly whether a draft is opened or a message is actually delivered.
- [ ] **Verify:** valid/invalid input tests, email-draft behavior, empty-recipient behavior, keyboard and screen-reader labels; no false sent state.
- **Dependencies:** 4.1.
- **Files likely touched:** contact markup, `script.js`, `site-config.js`, site CSS.
- **Scope:** Medium.

## Checkpoint D — Customer journey
- [ ] Quote/contact journey is understandable and truthful.
- [ ] No personal information is stored or transmitted unexpectedly.
- [ ] Contact destination is configurable and no address is invented.

## Phase 5 — Integrated quality review

### Task 5.1 — Run website and repository quality checks
- [ ] **Acceptance:** website verification and existing feature-branch quality workflow pass; unrelated app workspaces are not regressed.
- [ ] **Verify:** run `npm run verify:site` and the full GitHub Actions quality workflow; record actual results.
- **Dependencies:** Phases 2–4.
- **Files likely touched:** test scripts only if a demonstrated coverage gap needs an approved change.
- **Scope:** Medium.

### Task 5.2 — Complete accessibility, motion, and responsive review
- [ ] **Acceptance:** keyboard/focus, screen-reader labels, contrast, reduced motion, touch behavior, and mobile/tablet/desktop layouts meet the approved baseline.
- [ ] **Verify:** automated accessibility checks, VoiceOver/NVDA spot check, and manual viewport review.
- **Dependencies:** 5.1.
- **Files likely touched:** only files required to fix verified defects.
- **Scope:** Medium.

### Task 5.3 — Complete media rights and performance review
- [ ] **Acceptance:** all public imagery has documented rights/provenance; image and animation performance meet agreed budgets.
- [ ] **Verify:** audit `docs/assets.md`, check responsive image loading, layout shift, animation smoothness, and lab performance diagnostics.
- **Dependencies:** 5.1.
- **Files likely touched:** `docs/assets.md`, image references, site CSS/JS as needed.
- **Scope:** Medium.

## Checkpoint E — Owner review
- [ ] All acceptance criteria are evidenced.
- [ ] No critical accessibility, functional, content-rights, or security issues remain.
- [ ] Feature branch is ready for owner review.
- [ ] Owner separately approves any production merge/deployment.

## Explicitly out of scope
- No OS or SystemOS website feature.
- No SoundMatch or duplicate quiz.
- No PA Designer quiz or unvalidated acoustic calculator.
- No Connection Lab device discovery/control.
- No accounts, customer portal, backend, database, or cloud synchronization.
- No ecommerce checkout, payment provider, or inventory/pricing claims.
- No experimental app directory or unverified subdomain links.
- No changes to experimental app workspaces as a side effect of this website re-scope.
