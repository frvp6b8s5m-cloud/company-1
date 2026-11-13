# BZaudio Website Security and Privacy Review

**Reviewed:** 2026-11-12  
**Scope:** Static website on the feature branch, including PA Designer, SoundMatch, quote handoff, Connection Lab and OS/SystemOS roadmap sections.

## Architecture and trust boundaries
- The site is static HTML, CSS and vanilla JavaScript. It has no server-side application, authentication, payment processor, database, customer CRM, analytics SDK or server-side form endpoint.
- User-entered PA Designer and SoundMatch fields are untrusted input. They are used to create local text summaries and user-reviewed email drafts.
- SoundMatch saved drafts are stored in the visitor's browser via localStorage under a versioned key. They are not uploaded, synchronized or available to BZaudio. Users can delete saved designs individually.
- The contact form validates fields in the browser and opens a mailto draft. The visitor reviews and sends the message in their own email application. The site does not claim that an inquiry was delivered.
- External assets are fetched over HTTPS from Pexels image CDN and Google Fonts. These providers receive ordinary asset requests; project form values and SoundMatch content are not sent to them.

## STRIDE review
| Threat | Exposure | Controls / residual risk |
|---|---|---|
| Spoofing | No user accounts or authenticated actions exist. | No authentication surface is exposed. Do not add accounts without a separate auth design and approval. |
| Tampering | Visitors can edit localStorage drafts or form values. | Treat saved drafts as untrusted; validate their shape and bounds when loading. Never use them as proof of product compatibility or quote approval. |
| Repudiation | No server-side inquiry record exists. | The mailto draft is user-reviewed and user-sent; BZaudio receives no audit trail until a real delivery service is implemented. |
| Information disclosure | User project notes may contain sensitive venue/system details. | Form values stay in page memory until the visitor opens their email app. SoundMatch drafts remain in browser-local storage. No remote analytics or backend submission is present. |
| Denial of service | User can add many equipment rows or drafts. | SoundMatch caps a design at 50 components and 10 saved drafts; form field lengths and numeric ranges are bounded. |
| Elevation of privilege | No privileged accounts, roles or device commands exist. | Connection Lab does not scan networks or send mixer commands; all compatibility remains unverified until model-specific hardware tests. |

## Input and output handling
- Native form controls constrain required values, enumerations and numeric ranges.
- SoundMatch saved data is parsed defensively, filtered to expected shapes and clamped on load.
- User-provided component names and brief content are rendered with textContent, not inserted as HTML.
- Email subject and body values are URL-encoded. The configured recipient is format-validated and the email address separator is kept intact in the mailto address.
- No eval, dynamic code execution, user-generated HTML rendering, file uploads, server-side URL fetches or user-controlled network requests are present.

## Privacy and product boundaries
- SoundMatch local storage is device/browser-local and does not sync. Visitors should avoid entering secrets or sensitive personal information into project notes.
- No payment, checkout, subscription enforcement, user account, cloud configuration vault, QR provisioning, live assistant, maintenance sync or mixer control is implemented.
- SystemOS and BZaudio OS are roadmap concepts. The Connection Lab compatibility matrix is an assessment roadmap, not a support certification.
- A configured inquiry recipient is required for a pre-addressed email draft. Until set, visitors must add the recipient manually before sending.

## Hosting limitations and release follow-up
- GitHub Pages serves static assets; this repository's HTML cannot set all response security headers (for example, CSP, HSTS and X-Content-Type-Options). Do not pretend a meta tag is equivalent to an HTTP response header. If the site later moves to a host that supports response-header configuration, add a restrictive CSP and the appropriate security headers there.
- Re-run dependency and security review whenever runtime dependencies, server-side features, account storage, payment processing or external integrations are added.
- Before enabling any mixer control, complete protocol-specific threat modeling, permission design, command validation, disconnect/recovery behavior and physical hardware testing.


## SystemOS browser workspace addendum — 2026-11-12

- SystemOS stores project records, equipment inventory, ordered signal-flow notes, document/reference metadata and maintenance entries in browser localStorage under the versioned key bzaudio.systemos.workspace.v1.
- The workspace has no server endpoint, account system, cloud synchronization, remote telemetry or third-party data transfer. Data remains in the current browser profile.
- JSON export creates a portable user-controlled backup. JSON import validates the backup envelope and bounds collection sizes before replacing the current local workspace. Users should keep their own backups; clearing browser storage or changing devices can remove access to local records.
- User-supplied record text is rendered through DOM textContent, not interpreted as HTML. Imported records are treated as untrusted data.
- SystemOS records signal flow as ordered documentation. It does not discover devices, validate network topology, calculate acoustic performance, or send control commands to consoles.
- Documents are currently reference links and notes, not uploaded binary file storage.
- The browser workspace is a functional local-first planning and service-record tool; it is not the dedicated-device operating system, Windows/macOS desktop application or touchscreen controller.



## SystemOS engineering modules addendum — 2026-11-12

The local workspace now supports structured asset specifications, patchbay maps, network endpoint records and commissioning evidence. All records remain in localStorage and in user-exported JSON backups. These modules do not execute network probes, discover devices, transmit console commands, measure SPL/frequency response/latency, validate electrical safety or certify work. Commissioning outcomes are user-entered records. IP/MAC/network data are stored as documentation and are not transmitted to a service. Imported records remain untrusted input and are rendered with textContent.



## FX Lab and BZaudio ID addendum — 2026-11-13

### FX Lab
- FX Lab processes user-selected local audio files, a generated test oscillator, or microphone input through the browser Web Audio API. The selected audio file is loaded through a browser object URL; it is not posted to a server.
- Microphone capture requires an explicit browser permission. The app stops media tracks when the user stops audio or leaves the page. Browser/device audio routing and latency vary; this is not a physical console connection or native plugin.
- User effect presets are stored in browser localStorage under a versioned key. Imported JSON is bounded to 64 KB, checked against a fixed schema, and range-validated against the UI control bounds. The local preset library is capped at 20 entries. Export is user-initiated.
- Presets are untrusted local data. They contain effect parameters only; they are not executable code and are never interpreted as HTML.

### BZaudio ID
- BZaudio ID stores only an optional display name, optional email address and role in browser localStorage. It collects no password, authentication token or verification code.
- A clear-profile control removes the local profile from the current browser. Browser storage is device/profile-specific and can be cleared by the browser or extensions.
- This preview is not authentication, account recovery, authorization, SSO or cloud sync. It must not be used to protect private data or privileged operations.
- A future identity launch requires a selected identity provider, server-side authorization, secure session lifecycle, verified account recovery, consent/privacy policy, security tests and operational monitoring.

### Cross-app navigation and release
- Preview navigation uses same-repository app paths; standalone build outputs rewrite sibling links to their proposed hostnames.
- Proposed hostnames are not live until DNS, hosting custom-domain configuration and HTTPS are verified. No secrets or DNS records are created by the static build.
