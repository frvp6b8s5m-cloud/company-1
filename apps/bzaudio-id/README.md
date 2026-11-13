# BZaudio ID

**Hostname:** `id.bzaudio.com` (proposed; DNS/hosting not configured)

BZaudio ID currently provides an ecosystem landing page and an optional local profile preview.

## Current behavior
- Save and restore a display name, optional email and role in this browser's local storage.
- Clear the local profile from the current browser.
- Navigate to BZaudio product apps.
- No passwords or authentication credentials are collected.

## Not implemented
- Secure sign-in, email verification, password reset or account recovery
- Cross-device profile sync or cloud storage
- Team membership, roles/permissions or shared projects
- Server-side authorization or identity provider integration

Do not represent the preview as an account or single sign-on. Before production identity launch, choose an identity provider, define the threat model and privacy/consent flows, configure secure sessions and account recovery, enforce server-side authorization, and add security tests.
