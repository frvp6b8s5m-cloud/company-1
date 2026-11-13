# BZaudio Public Website Specification

**Version:** 2.0 — approved by owner 2026-11-12  
**Repository:** \`frvp6b8s5m-cloud/company-1\`  
**Working branch:** \`feat/bzaudio-company-site\`  
**Strategic source:** [BZaudio Vision](https://github.com/frvp6b8s5m-cloud/BZAUDIO-this-is-it1/blob/main/VISION.md) · [BZaudio Roadmap](https://github.com/frvp6b8s5m-cloud/BZAUDIO-this-is-it1/blob/main/ROADMAP.md)  
**Status:** Requirements approved. Technical plan is prepared separately for owner review. **No implementation may begin until that plan is approved.**

## 1. Objective

Create a distinctive, premium BZaudio public website that helps people understand the company, explore professional-audio products and solutions, and confidently request a quote or assistance.

Brand belief: **MUSIC BRINGS LIFE. MUSIC IS EVERYTHING.**

The website is the public company and customer-entry experience. BZaudio Technology is a separate, independent software platform that may grow alongside the website. It is not an operating system. The website must not present or promote a BZaudio OS, dedicated-device OS, desktop OS, or touchscreen OS controller.

## 2. Strategic context

BZaudio's long-term company capabilities are:

- **BZaudio Systems:** equipment, product expertise, proposals, and professional audio solutions.
- **BZaudio Technology:** an independent platform for documenting, understanding, and managing audio systems.
- **BZaudio Experience:** demonstrations, listening experiences, and education.
- **BZaudio Care:** support, maintenance, documentation, training, and upgrades.

Signature long-term initiatives are **BZaudio System DNA**, **BZaudio Experience Lab**, and **BZaudio for Life**. These are strategic directions, not claims that those products or services are already available.

The initial public website should establish the company clearly and simply. It must not attempt to launch every division, app, or future capability at once.

## 3. Audience and customer promise

Serve a broad range of customers: individual buyers, musicians, creators, engineers, houses of worship, schools, studios, venues, production companies, and system integrators.

Desired customer reaction: **“I trust BZaudio with my entire audio system.”**

Earn that trust with accurate information, clear recommendations, transparent limitations, reliable contact paths, and an experience that feels considered rather than crowded.

## 4. Experience and simplicity requirements

The experience must feel powerful without being overwhelming.

- Visitors should understand what BZaudio does and the primary next step within moments.
- Keep primary navigation short, familiar, and organized around customer needs.
- Show essential information first; reveal technical depth progressively.
- Give each page or section one clear purpose and one primary action.
- Avoid crowded dashboards, excessive cards, competing calls to action, duplicate quizzes, and feature overload.
- Use plain language by default, with optional technical detail for professional users.
- Keep labels, controls, navigation, and interaction patterns consistent.
- Keep practical tasks—finding products, requesting a quote, and contacting BZaudio—calm and direct.
- Make mobile navigation and content as clear as desktop.
- Do not add a feature unless its customer benefit, source content, maintenance cost, and support implications are understood.

## 5. Visual identity and motion

### Art direction

**Preserve the architectural, cinematic BZaudio direction.** This is a core brand requirement, not a temporary styling option.

- Premium architectural/editorial composition with strong geometry, deliberate asymmetry, disciplined grids, and generous negative space.
- Cinematic scale and atmosphere: striking real-world audio and architectural photography, confident typography, layered depth, considered image crops, and strong light/material contrast.
- Genuine professional audio equipment, venues, studios, installations, and people at work. Use authentic, commercially licensed or company-owned imagery only.
- A restrained, coherent palette built around deep graphite/charcoal, warm light neutrals, material tones, and a disciplined signal accent. Final tokens are documented during implementation.
- Typography should feel confident, precise, editorial, and highly legible.
- Avoid generic SaaS templates, AI-generated or synthetic-looking imagery, chatbot aesthetics, fake dashboards, gradient blobs, excessive glassmorphism, and repetitive card grids.

### Motion and animation

The site should have a rich, memorable motion language with more polish and character than a typical template site, while remaining purposeful.

Approved motion vocabulary may include:
- Cinematic hero entrances and carefully staged text/image reveals.
- Layered transitions and restrained depth/parallax on selected imagery.
- Scroll-triggered section reveals that never hijack scrolling or hide essential content.
- Refined navigation transitions, hover states, button feedback, image treatments, and small signal-inspired motion details.
- Consistent easing, duration, and choreography so motion feels like one designed system.

Motion requirements:
- Animation must never delay navigation, block reading, or make controls difficult to use.
- Respect \`prefers-reduced-motion\` with meaningful reduced or static alternatives.
- Provide keyboard-visible focus and equivalent non-hover interactions.
- Avoid continuous movement that adds no information, excessive simultaneous animation, and heavy effects on low-powered mobile devices.
- Load large imagery responsibly; lazy-load below-the-fold media and reserve image dimensions to prevent layout shift.
- Validate animation performance on real mobile-sized viewports and ordinary devices.

## 6. Initial information architecture

The first release should have a short, understandable set of customer destinations:

1. **Home:** clear company proposition, concise introduction, selected pathways, and a primary quote/contact action.
2. **Products:** verified product categories and product information only where reliable data is available.
3. **Solutions:** customer applications and system approaches, with clear boundaries around engineering claims.
4. **About:** company purpose, values, trust standards, and brand belief.
5. **Contact / Request a Quote:** a clear inquiry path with transparent submission behavior.

**Resources** may be added only when there is a useful, verified initial collection. Do not create empty navigation destinations.

Future BZaudio Technology, Experience, and Care capabilities may be introduced briefly as future directions when useful, but must be clearly labeled as planned and must not crowd the primary navigation.

## 7. Functional requirements

- Responsive, accessible navigation and mobile menu.
- Product/category discovery based only on verified catalog information.
- Clear product and solution descriptions, with no fabricated specifications, prices, availability, reviews, certifications, or manufacturer relationships.
- Quote and contact inquiry flow with appropriate validation, clear success/error states, and transparent explanation of how the inquiry is delivered.
- Contact destination remains configurable. Until a real delivery service and recipient are configured, use a user-reviewed email-draft flow; never claim that a message was sent.
- SEO and social metadata, semantic headings, descriptive image alt text, and deployment-appropriate sitemap/robots configuration.
- Privacy-conscious analytics or error reporting only if deliberately configured and approved.
- No dead buttons, fake forms, placeholder production links, or misleading status indicators.

## 8. Explicit exclusions for this website release

The following are not part of this public website milestone:

- Any BZaudio OS, SystemOS product promotion, dedicated-device OS, desktop OS, or touchscreen OS controller.
- A second operating-system experience or an OS dashboard embedded in the website.
- SoundMatch or other duplicate guided quizzes/configurators.
- A separate PA Designer quiz or unvalidated acoustic prediction/calculation tool.
- Connection Lab hardware discovery, mixer monitoring, or mixer control.
- Public accounts, cloud synchronization, customer-record storage, authentication, or a customer portal.
- Ecommerce checkout, payment processing, inventory claims, or unverified pricing.
- Unreleased app/subdomain links presented as live products.
- Trading or barter functionality.

Existing experimental app code in the repository is outside this website scope. Do not delete, migrate, or change those apps as a side effect of the website work. Do not surface them as released products unless a separate product release is approved and verified.

## 9. Technical approach and repository facts

The active website is in the \`company-1\` repository on \`feat/bzaudio-company-site\`. The repository already contains a static HTML/CSS/vanilla JavaScript site, a package manifest, app workspaces, scripts, and GitHub Actions quality and GitHub Pages workflows.

- Preserve the existing static-first website and GitHub Pages deployment model unless the technical plan proves a requirement that needs a change.
- Do not introduce a frontend framework, backend, database, authentication, payment provider, analytics service, or new production dependency without documented rationale and owner approval.
- Keep the website boundary clear from the independent BZaudio Technology platform and experimental companion apps.
- Keep content, product data, configuration, design tokens, and behavior organized and maintainable.
- Preserve existing app workspace behavior and quality checks when those apps are outside the website scope.
- The Pages workflow deploys \`main\`; feature-branch checks do not automatically publish a public preview. Do not merge or deploy to production as part of plan approval.

## 10. Code and quality standards

- Semantic HTML and accessible native controls.
- CSS custom properties for design tokens; focused, maintainable styles.
- Small, feature-scoped JavaScript modules and progressive enhancement.
- Validate user-controlled form data at boundaries.
- Keep secrets and privileged credentials out of client code.
- Target WCAG 2.2 AA where practical, with WCAG 2.1 AA as the minimum baseline.
- Support keyboard navigation, screen readers, visible focus, readable contrast, touch targets, and reduced motion.
- Optimize images, scripts, fonts, and animation for mobile performance.
- Do not claim a quality check passed unless it was run and its result was observed.

## 11. Testing and verification

The technical plan must use the repository's real scripts and existing GitHub Actions workflow. Expected verification includes:

- Website static validation using the existing \`npm run verify:site\` script.
- JavaScript syntax checks for every changed script.
- Browser-level checks for navigation, quote/contact flow, responsive behavior, and important interactions.
- Keyboard and focus review, accessibility automation, reduced-motion checks, and a manual screen-reader spot check.
- Mobile/tablet/desktop layout and image-loading checks.
- Performance review for image weight, layout shift, animation cost, and Core Web Vitals.
- Existing independent app checks remain green; changes to the public website must not silently regress app workspaces.
- GitHub Actions quality workflow must pass on the feature branch.
- Production deployment and merge to \`main\) remain separate release gates.

## 12. Boundaries

### Always
- Follow the agent-skill repository workflow and human approval gates.
- Keep the architectural, cinematic art direction and refined animation language.
- Keep the website clear, simple, accessible, responsive, and performant.
- Use genuine licensed/company-owned photography and document provenance.
- Verify product and company claims.
- Keep quote/contact delivery behavior honest.
- Make small, reviewable changes and verify them.

### Ask first
- Framework migration or new production dependencies.
- Backend, database, customer accounts, authentication, cloud storage, analytics, or payment services.
- Domain/DNS changes, production deployment, or merge to the default branch.
- New major interactive tools, released app links, or material expansion of the initial website scope.
- Publishing product specifications, pricing, availability, compatibility, certifications, or engineering results without evidence.

### Never
- Start implementation before the technical plan is reviewed and approved.
- Present the website or BZaudio Technology as an operating system.
- Reintroduce an OS-branded website feature or dashboard.
- Use AI-generated or synthetic-looking public brand photography.
- Invent product data, compatibility, customer reviews, or service claims.
- Fake authentication, form delivery, device connectivity, or cloud synchronization.
- Commit secrets or private customer information.

## 13. Success criteria

1. Visitors understand BZaudio and the primary next step quickly.
2. The visual identity remains architectural, cinematic, premium, and unmistakably BZaudio.
3. Motion feels rich and intentional without harming usability, accessibility, or performance.
4. The site is not overwhelming: short navigation, clear hierarchy, progressive disclosure, and one primary purpose per section.
5. Visitors can find product/solution information and request a quote or contact BZaudio without confusion.
6. All published product/company claims and public images have verified sources/rights.
7. The site works across mobile, tablet, and desktop and passes accessibility and reduced-motion review.
8. No OS-branded product or unapproved experimental app is presented as a public website feature.
9. Existing independent app workspaces and GitHub Pages deployment behavior are not unintentionally broken.
10. No implementation or production deployment occurs before the owner approves the technical plan and later release gates.

## 14. Open items for the technical plan

- Confirm the initial verified product categories and any available manufacturer-approved data.
- Confirm the approved inquiry recipient when available; keep it configurable in the meantime.
- Confirm which genuine licensed/company-owned photography is approved for production.
- Confirm whether the first release should use concise anchor sections or separate static pages, based on the current code and content volume.
- Define the exact motion/performance budget and visual review checkpoints.
