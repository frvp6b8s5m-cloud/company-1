# BZaudio applications

This directory contains independently scoped applications in the BZaudio monorepo.

| Directory | Intended application | Hostname |
|---|---|---|
| `systemos/` | Universal audio show operating platform | `os.bzaudio.com` |
| `system-builder/` | Complete audio system design and quote preparation | `build.bzaudio.com` |
| `compatibility-center/` | Evidence-based equipment compatibility | `compat.bzaudio.com` |
| `show-workspace/` | Show, venue and production project management | `shows.bzaudio.com` |

These are application boundaries and development homes, not claims that all apps are already implemented or deployed. Each app must own its build, tests, configuration and release workflow. Shared contracts and design foundations belong in `packages/`.

The existing company website remains at the repository root. The existing SystemOS prototype also remains at the root until a tested migration is approved.
