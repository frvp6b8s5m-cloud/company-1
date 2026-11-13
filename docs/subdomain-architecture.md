# BZaudio GitHub application and subdomain architecture

**Status:** Approved direction, implementation staged  
**Source repository:** `frvp6b8s5m-cloud/company-1`  
**Working branch:** `feat/bzaudio-company-site`

## Decision

GitHub is the source of truth for BZaudio application code, documentation, review, automated quality checks, and release history. Keep the existing company website in this repository and do not replace or disrupt it.

The customer-facing ecosystem is composed of independently deployable applications under one BZaudio identity:

| Product | Intended hostname | Responsibility |
|---|---|---|
| Company website | `www.bzaudio.com` | Brand, equipment catalog, product information, support and quote requests |
| SystemOS | `os.bzaudio.com` | Universal show workspace and manufacturer adapter platform |
| System Builder | `build.bzaudio.com` | Guided complete-system design and equipment selection |
| Compatibility Center | `compat.bzaudio.com` | Evidence-based equipment, model, firmware and connection compatibility |
| Show Workspace | `shows.bzaudio.com` | Venue, show, stage plot, input list and project organization |
| FX Lab | `fx.bzaudio.com` | Browser-local EQ, dynamics, saturation, modulation, delay and reverb |
| BZaudio ID | `id.bzaudio.com` | Local profile preview and future shared identity entry point |

These are proposed hostnames, not claims that DNS or hosting has been configured.

## Repository strategy

Use a GitHub-managed monorepo as the canonical source while preserving the current website at the repository root during the first migration-safe phase. New applications should be added under:

```text
apps/
  systemos/
  system-builder/
  compatibility/
  show-workspace/
packages/
  design-system/
  shared-types/
  shared-validation/
  auth-contracts/
docs/
  systemos-universal-architecture.md
  subdomain-architecture.md
```

Do not move the existing root website until an independently tested migration plan exists. Avoid duplicating shared UI, schemas and compatibility data across applications.

## GitHub deployment reality

The current repository's GitHub Pages workflow deploys one site from `main`. A single GitHub Pages site cannot independently serve five unrelated custom-domain subdomains from one Pages configuration.

Therefore:
1. Keep the company site deployment unchanged.
2. Develop and test each app in this monorepo with its own quality checks and build output.
3. Choose a GitHub-compatible hosting target for each app. Options include separate GitHub Pages repositories/sites or GitHub Actions deploying each app to an approved hosting provider.
4. Configure each subdomain's DNS record and the matching hosting custom-domain setting only when the domain/DNS provider and hosting target are available.
5. Keep deployment credentials in GitHub Actions secrets/environments; never commit tokens or credentials.
6. Use preview deployments and automated smoke/accessibility checks before any production release.

Do not create fake DNS records, claim a hostname is live, or alter the existing Pages workflow to deploy an unbuilt app.

## Shared platform contracts

- One BZaudio design system and navigation language.
- A future shared identity provider and single sign-on; do not pretend static GitHub Pages alone provides secure cross-subdomain authentication.
- Versioned shared data contracts for products, equipment, compatibility evidence, show packages and project references.
- Explicit app-to-app links and import/export contracts first; authenticated shared APIs only after a backend and identity provider are selected.
- Least-privilege access, secure session handling, privacy boundaries and auditable releases.
- Each application can be tested and deployed independently without breaking the others.

## Product boundaries

### SystemOS
The flagship professional audio platform. Manufacturer-neutral core; model- and firmware-specific adapters; show-file import/translation/export with semantic validation. Live hardware control remains a separate capability and is only advertised after real-device tests.

### System Builder
Guided system design, equipment selection, requirement checks, missing-component warnings and quote-ready equipment lists. It must not claim validated acoustic prediction until that calculation engine is implemented and verified.

### Compatibility Center
A source-backed compatibility knowledge base. Every relationship carries a confidence/status and evidence: tested, manufacturer-documented, transformed/conditional, user-review, unsupported or unknown. Never infer compatibility from connector shape alone.

### Show Workspace
Organizes show and venue information, stage plots, input lists, equipment inventory, revisions and references. It should reuse the same versioned show/equipment contracts as SystemOS.

## Delivery sequence

1. Preserve and continue validating the existing company website.
2. Establish shared contracts, design tokens and app shell.
3. Build SystemOS core and Transfer Studio foundations.
4. Build the Compatibility Center's evidence model and search experience.
5. Build System Builder using verified catalog and compatibility data.
6. Build Show Workspace on shared project/show data.
7. Add secure identity and shared services only after selecting a real backend.
8. Configure subdomain hosting and DNS, then deploy each app independently.
9. Run end-to-end tests across the ecosystem before public launch.

## Release gates

- No production DNS or domain changes without confirmed domain/DNS access.
- No production deployment from the feature branch.
- No untested cross-manufacturer translation claims.
- No fake live device status, meters, control or compatibility.
- Each app must pass syntax/build, browser, accessibility, security and responsive checks.
- Main website remains deployable independently throughout the work.
