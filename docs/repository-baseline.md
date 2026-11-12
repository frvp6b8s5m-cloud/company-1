# Repository Baseline

**Captured:** 2026-11-12  
**Repository:** `frvp6b8s5m-cloud/company-1`  
**Working branch:** `feat/bzaudio-company-site`  
**Default branch:** `main`  
**Scope:** Existing website repository only. Git history is preserved.

## Inspected branch contents
- `index.html` — existing single-page company site.
- `styles.css` — monolithic stylesheet with dark/acid-green palette and abstract CSS-generated hero/section illustrations.
- `script.js` — decorative wave/meter generation, mobile navigation, current-year footer, and a mailto inquiry handler.
- `README.md` — minimal placeholder.
- `.github/workflows/pages.yml` — GitHub Pages workflow.
- `SPEC.md`, `tasks/plan.md`, `tasks/todo.md` — approved specification and plan records.

## Deployment workflow finding
The current Pages workflow triggers on pushes to `main` and manual dispatch only. It does **not** automatically deploy the feature branch. Do not merge to `main` just to preview. Before any preview/release, decide and test a safe preview method (e.g. Pages artifact/preview workflow on the feature branch or a separate preview environment). Production remains gated by explicit approval.

## Baseline behavior
- Navigation links use same-page anchors.
- Mobile navigation toggles an `open` class and updates `aria-expanded`.
- Footer year is populated client-side.
- Inquiry form validates native required/email fields and opens a mailto draft.
- The current mailto recipient is blank; the future recipient must be configurable and the UI must not claim delivery.
- Abstract generated visuals are not aligned with the approved real-photography direction.

## Architecture baseline
- Static HTML/CSS/vanilla JavaScript.
- No package manifest, automated test runner, backend, product catalog feed, payment integration, or configured inquiry recipient was found at the inspected root.
- Keep the static-first approach unless an approved requirement proves otherwise.

## Safety and rollback
- Preserve the existing feature-branch commit history and record the pre-replacement branch head in the commit history before replacing implementation files.
- Work only on `feat/bzaudio-company-site`; do not modify `main` or unrelated repositories.
- No deployment or production cutover is performed by this baseline capture.
