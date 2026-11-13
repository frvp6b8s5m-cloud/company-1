# Technical Implementation Plan — BZaudio Public Website

**Status:** Prepared for owner review — implementation is not authorized yet.  
**Specification:** [SPEC.md](../SPEC.md), version 2.0  
**Strategic direction:** [BZaudio Vision](https://github.com/frvp6b8s5m-cloud/BZAUDIO-this-is-it1/blob/main/VISION.md) · [BZaudio Roadmap](https://github.com/frvp6b8s5m-cloud/BZAUDIO-this-is-it1/blob/main/ROADMAP.md)  
**Repository:** `frvp6b8s5m-cloud/company-1`  
**Working branch:** `feat/bzaudio-company-site`  
**Task list:** [todo.md](todo.md)

## 1. Overview

Re-align the existing BZaudio public website with the newly approved company vision. Preserve its architectural, cinematic identity and rich, carefully choreographed animation while making the experience substantially clearer and less overwhelming.

The website release is a focused company and customer-entry experience: Home, Products, Solutions, About, and Contact/Request a Quote. It is not the BZaudio Technology platform, an OS, or a directory of experimental applications. Future company capabilities may be introduced honestly and sparingly, but must not be represented as available products.

This plan replaces the earlier OS- and tool-heavy website implementation plan. The previous task list contained 63 unchecked items from the older scope. Those items are **superseded, not completed**; this re-plan preserves Git history and records only the new approved website scope below.

## 2. Repository inspection and baseline findings

Inspected the active feature branch and current repository content:

- The active website work is in `company-1`, branch `feat/bzaudio-company-site`. The separate `BZAUDIO-this-is-it1` repository contains the approved strategic `VISION.md`, `ROADMAP.md`, and strategy-level `SPEC.md`.
- The active branch contains a static HTML/CSS/vanilla JavaScript website, including `index.html`, `styles.css`, `experience.css`, `script.js`, `site-config.js`, and existing feature styles/scripts.
- A root `package.json` exists. It defines existing quality scripts including `npm run verify:site`, `npm run test:systemos`, `npm run check:systemos-app`, `npm run check:ecosystem-apps`, `npm run build:apps`, and `npm run check:all-apps`.
- `.github/workflows/quality.yml` runs static checks, browser smoke scripts, accessibility/performance checks, and app-workspace checks on the feature branch and pull requests.
- `.github/workflows/pages.yml` deploys the `main` branch only. Feature-branch checks do not publish the production site.
- Existing content and navigation still refer to BZaudio OS/SystemOS, SoundMatch, and experimental app destinations. Those references do not match the newly approved website specification and must not remain in the public website after implementation.
- Existing app workspaces and their tests are outside this website re-scope. They must not be deleted, rewritten, or silently migrated as part of the public website work.
- The current branch has an incomplete prior plan/task list. This plan and task list replace that earlier scope in place; prior commits remain available in Git history.

## 3. Architecture decisions

1. **Keep the existing static-first stack.** Continue with semantic HTML, CSS, and vanilla JavaScript on GitHub Pages. Do not migrate to React, Next.js, another framework, or a server platform without a new approved requirement.
2. **Keep the website independent from the app workspaces.** The public site is the company/customer entry point. Experimental browser apps and the future BZaudio Technology platform are not embedded into the website.
3. **Use a small, customer-led information architecture.** Keep the primary destinations to Home, Products, Solutions, About, and Contact/Quote. Prefer concise page/section structures over a large dashboard or tool directory. Decide anchor sections versus separate static pages after reviewing current markup and content volume; do not introduce client-side routing.
4. **Use progressive enhancement.** Core navigation and content must work without animation or nonessential JavaScript. JavaScript enhances navigation and approved interactions; it does not gate access to content.
5. **Create a coherent design and motion system.** Use shared CSS custom properties for typography, spacing, surfaces, color, grid, image treatment, easing, and duration. Keep the architectural/cinematic art direction, but use motion selectively so practical tasks remain calm.
6. **Keep product data evidence-based.** Show category-level information where model-level data is not verified. Never invent SKUs, specifications, pricing, stock, compatibility, or reviews.
7. **Keep inquiry delivery honest.** Preserve the configurable recipient and user-reviewed email-draft behavior until a real recipient and approved delivery service exist. No false “sent” confirmation.
8. **Protect deployment.** Work only on the feature branch. Do not change the Pages production workflow, merge to `main`, or deploy production without separate approval.
9. **Avoid scope creep.** No OS, SoundMatch, PA Designer quiz, Connection Lab, customer portal, checkout, authentication, backend, or app-subdomain launch in this website milestone.

## 4. Intended information architecture

- **Home:** concise promise, cinematic hero, clear introduction, selected customer pathways, one primary call to action.
- **Products:** category-led discovery, only verified details, quote actions.
- **Solutions:** customer applications and system approaches; clear limitations around engineering/design claims.
- **About:** mission, company approach, trust standards, brand belief.
- **Contact / Request a Quote:** simple inquiry with transparent email-draft or approved delivery behavior.

Keep the main navigation short. Avoid putting future initiatives or experimental tools in the primary nav. If a future capability is mentioned, use a concise, clearly labeled “in development” or “future direction” treatment and only where it helps explain the company.

## 5. Visual and motion implementation direction

### Preserve the architectural/cinematic identity

- Keep strong architectural geometry, asymmetric editorial composition, generous negative space, material contrast, confident typography, and authentic audio/venue photography.
- Build a distinctive visual rhythm: cinematic hero, quieter information sections, purposeful image-led moments, and restrained technical details.
- Do not replace the current direction with a generic SaaS template, a plain corporate layout, or a dense grid of cards.
- Use real, licensed/company-owned imagery. Track creator/source/license/permission and intended use in `docs/assets.md`.

### Build a consistent animation language

- Hero: staged but quick entrance for typography and imagery.
- Sections: restrained scroll reveals with content visible if motion is disabled or JavaScript is unavailable.
- Imagery: limited parallax/depth treatment where it adds atmosphere and remains smooth on mobile.
- Controls: precise hover, focus, active, and press feedback; touch interactions must have equivalent feedback.
- Navigation: clear, short transitions; no delayed access to links.
- Signal details: small, restrained animated line/frequency motifs where they reinforce audio identity.
- Avoid scroll hijacking, long intro gates, excessive looping movement, and animation on every element.

### Motion and performance gates

- Honor `prefers-reduced-motion` with reduced or static alternatives.
- Avoid layout-affecting animation; prefer transform/opacity for motion.
- Lazy-load below-the-fold imagery, set image dimensions/aspect ratios, and keep hero imagery prioritized.
- Verify at narrow mobile, tablet, and desktop widths.
- Target good Core Web Vitals; treat LCP under 2.5 seconds, CLS under 0.1, and INP under 200 ms as targets where field measurement is available. Lab checks are diagnostic, not a substitute for field data.

## 6. Dependency graph and build order

```
Approved scope + content inventory
            |
            v
Navigation / information architecture
            |
            v
Shared design tokens + motion/accessibility foundations
            |
            v
Home + Products + Solutions + About content
            |
            v
Contact / quote flow
            |
            v
Responsive, accessibility, motion and performance review
            |
            v
Feature-branch QA + owner review
            |
            v
Separate production-release approval
```

Product content depends on verified category/model data. Contact form behavior depends on the configured recipient and the approved delivery mechanism. Cinematic media depends on documented rights and responsive assets. These dependencies must be resolved before their related tasks are considered complete.

## 7. Implementation phases and tasks

Detailed acceptance criteria, verification, dependencies, and likely files are recorded in [todo.md](todo.md).

### Phase 0 — Scope and baseline reconciliation
- Confirm the active branch, current markup, package scripts, workflows, and known-good rollback commit.
- Reconcile the existing public navigation and content against the approved no-OS, no-tool-directory website scope.
- Keep the separate app workspaces untouched.

### Phase 1 — Information architecture and design foundations
- Simplify navigation and content hierarchy.
- Establish shared architectural design tokens and responsive layout rules.
- Define motion tokens and reusable reduced-motion-aware reveal/interaction patterns.

### Phase 2 — Core brand experience
- Refine the cinematic homepage while preserving the existing architectural direction.
- Build the concise company story and clear paths into Products, Solutions, About, and Contact.
- Keep visual moments rich but avoid content overload.

### Phase 3 — Products and solutions
- Present verified product categories and customer applications.
- Keep specifications and compatibility claims evidence-based.
- Route product and solution interest to a quote/contact path.

### Phase 4 — About and inquiry
- Present the mission, trust standards, and brand belief.
- Simplify the inquiry flow and explain the email-draft behavior accurately.
- Keep the contact destination configurable.

### Phase 5 — Integrated quality review
- Run existing static, browser, accessibility, performance, and workflow checks.
- Review mobile/desktop layouts, reduced motion, keyboard access, content accuracy, image rights, and navigation.
- Fix regressions without modifying unrelated apps.

### Phase 6 — Owner review and release readiness
- Present a verified feature-branch result and remaining release dependencies.
- Do not merge to `main` or deploy production until separately approved.

## 8. Verification commands and quality gates

Use the existing repository commands rather than inventing a new stack:

- `npm run verify:site` — website static verification.
- `npm run test:systemos`, `npm run check:systemos-app`, `npm run check:ecosystem-apps`, `npm run build:apps`, and `npm run check:all-apps` — preserve existing app checks when changes could affect shared repository tooling.
- Run the full `BZaudio site quality checks` GitHub Actions workflow on the feature branch.
- Use the existing Playwright/browser smoke scripts and accessibility/performance scripts in CI.
- Run a manual keyboard/focus review, reduced-motion review, and VoiceOver/NVDA spot check.
- Inspect responsive screenshots at phone, tablet, and desktop sizes.
- Verify every visible image against `docs/assets.md`; no image is production-ready based only on its URL.
- Confirm all links, quote paths, and contact states behave truthfully.
- Record actual command output and workflow run links in the task list; do not claim unrun checks passed.

## 9. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Old site content promotes OS/tools that conflict with strategy | High brand/scope risk | Remove OS/tool promotion from public website scope; keep experimental app code untouched |
| Over-simplification erases the distinctive cinematic identity | High brand risk | Preserve architectural composition, real photography, typography, and a rich but coherent motion system |
| Excessive animation harms usability/performance | High UX/accessibility risk | Shared motion tokens, reduced-motion alternatives, mobile checks, performance budgets |
| Product data is incomplete | High trust risk | Category-level copy only until reliable model data is available |
| Contact recipient is not configured | Medium conversion risk | Keep configuration explicit; use a user-reviewed email draft and never claim delivery |
| Public photography rights are unclear | High legal/brand risk | Use only verified licensed/company-owned assets and maintain provenance |
| Static hosting limits future platform features | Medium future architecture risk | Keep the website focused; design BZaudio Technology separately when its own spec is approved |
| Feature branch is not production deployment target | High release risk | Keep Pages workflow unchanged; require separate owner approval for merge/deploy |

## 10. Release and rollback

- Work only on `feat/bzaudio-company-site`.
- Preserve the current `main` branch and production Pages deployment.
- Capture the branch head before implementation begins.
- Keep changes small and reviewable; do not rewrite Git history.
- Confirm feature-branch quality checks before presenting a release candidate.
- Production merge/deployment is a separate approval gate.
- If a feature-branch change regresses the site, revert the specific commit or restore the last known-good feature-branch state, then rerun checks.

## 11. Open questions and external dependencies

- Exact initial product categories and which product data sources are approved.
- Approved inquiry recipient and whether email-draft handoff remains the launch behavior.
- Final approved photography set and any manufacturer/product image permissions.
- Whether any future Technology/Experience/Care initiative should be mentioned on the initial site; default is to keep such mentions brief and non-promotional.
- Final decision on anchor sections versus separate static pages after a code/content review.

## 12. Approval gate

This document is a proposed technical plan. **No implementation, refactor, content removal, feature deletion, deployment workflow change, merge, or production release is authorized until the owner reviews and approves this plan.**