# BZaudio Website Replacement — Task List

**Spec:** [SPEC.md](../SPEC.md)  
**Plan:** [plan.md](plan.md)  
**Status:** Plan approved 2026-11-12. Phase 0 is complete; Phase 1 first implementation pass is in place and awaiting browser/device review.

## Phase 0 — Repository and release baseline
- [x] **Task 0.1: Record repository baseline**
  - Acceptance: branch, current commit, root files, Pages workflow and current preview/deployment behavior are documented; `main` is unchanged.
  - Verify: inspect GitHub branch and workflow; confirm feature branch head and deployment target.
  - Dependencies: None.
  - Files: `docs/repository-baseline.md`.
  - Result: captured in `docs/repository-baseline.md`; Pages workflow currently deploys only on `main`, so a safe feature-branch preview must be planned.
  - Scope: S.
- [x] **Task 0.2: Establish asset rights and validation conventions**
  - Acceptance: asset provenance ledger and repeatable static validation commands are documented.
  - Verify: sample asset entry has source, license/permission, dimensions and optimization status; JS syntax check works.
  - Dependencies: 0.1.
  - Files: `docs/assets.md`, validation config/scripts as needed.
  - Result: rights ledger and publishing rules captured in `docs/assets.md`; no production assets have been approved yet.
  - Scope: S.

## Checkpoint A — Baseline
- [x] Existing deployment path understood.
- [x] Rollback point recorded in Git history (pre-replacement commit remains on the feature branch).
- [x] Asset rights process documented; candidate photography sourced and recorded.

## Phase 1 — Brand experience
- [ ] **Task 1.1: Build design tokens and responsive shell**
  - Acceptance: semantic page shell, responsive navigation, focus styles, type scale and color/material tokens are consistent.
  - Verify: HTML/static validation; keyboard and mobile menu smoke tests.
  - Dependencies: Phase 0.
  - Files: `index.html`, `styles/tokens.css`, `styles/layout.css`, `scripts/navigation.js`.
  - Scope: M.
- [ ] **Task 1.2: Create cinematic photographic homepage**
  - Acceptance: real licensed architectural/audio photography, editorial hero, clear company proposition and service entry points; no AI-style graphics.
  - Verify: asset ledger complete; responsive image sizes; mobile/desktop visual review; reduced-motion check.
  - Dependencies: 1.1.
  - Files: `index.html`, `styles/home.css`, `assets/*`.
  - Scope: M.
- [ ] **Task 1.3: Build shared footer and navigation states**
  - Acceptance: all navigation targets resolve, mobile menu closes correctly, footer links work.
  - Verify: browser smoke test at mobile and desktop widths; keyboard test.
  - Dependencies: 1.1–1.2.
  - Files: shared layout/style/script files.
  - Scope: S.

## Phase 1 progress note (2026-11-12)
- Initial cinematic photographic homepage, responsive navigation, service sections, equipment quote categories, Connection Lab status, BZaudio OS roadmap and contact flow have been implemented on the feature branch.
- Guided PA Designer wizard has been included with three validated intake steps, a reviewable project brief, copy action and quote-request handoff.
- Static source checks pass in the current review: JavaScript syntax, unique HTML IDs, internal anchor targets, explicit button types, balanced CSS braces, responsive breakpoint, reduced-motion rule, configurable inquiry email, PA Designer field/summary coverage, and asset-ledger references.
- Added `scripts/verify-site.mjs` and a feature-branch GitHub Actions quality workflow. No CI status has been returned yet, so the workflow result is not claimed as passing.
- Browser/device interaction, screen-reader, actual CDN image delivery, local asset optimization and performance checks remain outstanding; do not mark Phase 1 complete until those checks pass.

## Checkpoint B — Brand experience
- [ ] Homepage and navigation work at mobile/tablet/desktop.
- [ ] No broken image or navigation targets.
- [ ] Reduced-motion and keyboard behavior verified.

## Phase 2 — Services and customer inquiry
- [ ] **Task 2.1: Build PA services and process pages/sections**
  - Acceptance: design, installation, tuning and support are accurately explained with clear project paths.
  - Verify: content/link review and responsive smoke test.
  - Dependencies: Phase 1.
  - Files: service page/section and scoped styles.
  - Scope: M.
- [ ] **Task 2.2: Implement accessible project inquiry flow**
  - Acceptance: form validates, produces a reviewable email draft until an approved delivery service exists, and never claims the inquiry was sent.
  - Verify: invalid/valid form tests; test mailto composition without sending; keyboard and status announcement review.
  - Dependencies: 2.1.
  - Files: inquiry markup, script and tests.
  - Scope: M.

## Checkpoint C — Services and inquiry
- [ ] Service links and inquiry flow work.
- [ ] No personal information is stored or transmitted by the static site.
- [ ] User-facing submission status is truthful.

## Phase 3 — Equipment discovery
- [ ] **Task 3.1: Define verified catalog schema and category browsing**
  - Acceptance: product fields are data-driven and optional unknown data is omitted; categories work.
  - Verify: schema/data validation and category navigation tests.
  - Dependencies: Phase 1; product source decision.
  - Files: catalog data, catalog UI, tests.
  - Scope: M.
- [ ] **Task 3.2: Add search, filters and product details**
  - Acceptance: search/filter states, empty states and product detail links work with verified data.
  - Verify: unit tests for filtering and browser interaction tests.
  - Dependencies: 3.1.
  - Files: catalog scripts/components/styles and tests.
  - Scope: M.
- [ ] **Task 3.3: Add quote-request paths**
  - Acceptance: every product CTA leads to a truthful quote/contact flow; no fake checkout/pricing/stock.
  - Verify: all CTA destinations and form context are tested.
  - Dependencies: 2.2, 3.2.
  - Files: product details and inquiry integration.
  - Scope: S.

## Checkpoint D — Equipment
- [ ] Search, filters, details and quote path verified.
- [ ] Catalog content has source provenance.
- [ ] No unsupported commerce claims.

## Phase 4 — PA Designer
- [ ] **Task 4.1: Build guided PA project brief (approved scope)**
  - Acceptance: user can enter venue/application, room dimensions, audience/use, coverage goals, system priorities, constraints and budget; receives an editable preliminary project summary.
  - Verify: step validation, back/next, reset and summary tests.
  - Dependencies: Phase 2.
  - Files: designer UI, styles, logic and tests.
  - Scope: M.
- [ ] **Task 4.2: Add transparent project summary**
  - Acceptance: summary is useful for quote preparation, clearly labels preliminary planning and avoids unvalidated acoustic predictions. Validated acoustic calculations are a separate later gate.
  - Verify: output review for missing/invalid data and disclaimer visibility.
  - Dependencies: 4.1.
  - Files: designer summary and tests.
  - Scope: S.

## Checkpoint E — PA Designer
- [ ] Guided brief works end-to-end.
- [ ] No unsupported acoustic prediction or engineering-grade claim.

## Phase 5 — Free Connection Lab
- [ ] **Task 5.1: Build free Connection Lab information and model-status UI**
  - Acceptance: free access is clear; supported/verified/unverified statuses are model-specific; no simulated live connection.
  - Verify: compatibility data source review and status-state tests.
  - Dependencies: Phase 1; verified model matrix.
  - Files: Connection Lab page/section, compatibility data, tests.
  - Scope: M.
- [ ] **Task 5.2: Protocol and companion feasibility gate**
  - Acceptance: documented model-by-model protocol matrix, permission/security model, browser limitations, recovery strategy and physical test plan.
  - Verify: documentation review; no network control implementation before sign-off.
  - Dependencies: 5.1.
  - Files: `docs/connection-lab-compatibility.md`.
  - Scope: M.
- [ ] **Task 5.3: Implement only verified connection capabilities**
  - Acceptance: only model/hardware-tested capabilities are exposed; monitoring and control permissions are distinct; safe disconnect/recovery works.
  - Verify: real-hardware test log per model and regression tests.
  - Dependencies: 5.2 and separate human approval.
  - Files: companion/connection modules and tests, only after architecture approval.
  - Scope: L; break down further after feasibility gate.

## Checkpoint F — Connection Lab
- [ ] Free access confirmed.
- [ ] No false connection/compatibility claims.
- [ ] Physical test evidence recorded before live networking/control.

## Phase 6 — BZaudio OS
- [ ] **Task 6.1: Build accurate ecosystem overview**
  - Acceptance: dedicated OS, desktop platform and touchscreen controller are presented as planned/in development unless actually released.
  - Verify: roadmap labels and links reviewed.
  - Dependencies: Phase 1.
  - Files: OS page/section and styles.
  - Scope: S.

## Phase 7 — Integrated QA and release candidate
- [ ] **Task 7.1: Automated quality checks**
  - Acceptance: static validation, JS syntax, unit tests and browser smoke tests run in repeatable workflow.
  - Verify: CI results are green and artifacts/logs are available.
  - Dependencies: all shipped modules.
  - Files: test harness, CI workflow and test files.
  - Scope: M.
- [ ] **Task 7.2: Accessibility, performance and security review**
  - Acceptance: no critical accessibility/security defects; responsive media and motion meet budgets.
  - Verify: documented keyboard/screen reader spot checks, Lighthouse/Core Web Vitals and dependency/security review.
  - Dependencies: 7.1.
  - Files: findings and remediations.
  - Scope: M.
- [ ] **Task 7.3: Deployment and rollback verification**
  - Acceptance: feature-branch preview/deploy verified, rollback documented, production cutover remains gated.
  - Verify: GitHub Pages Actions result, live smoke test and rollback procedure review.
  - Dependencies: 7.2.
  - Files: deployment docs/workflow only if required.
  - Scope: S.

## Final checkpoint — Release candidate
- [ ] All approved acceptance criteria pass.
- [ ] No critical/high security, accessibility or functional defects remain.
- [ ] Product/asset/compatibility facts are sourced.
- [ ] Rollback path is verified.
- [ ] Human approves production cutover separately.
