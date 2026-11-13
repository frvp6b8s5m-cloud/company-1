# BZaudio FX Lab

**Hostname:** `fx.bzaudio.com` (proposed; DNS/hosting not configured)

FX Lab is a browser-local audio processor built on the Web Audio API.

## Current working sources
- Generated 220 Hz test tone
- User-selected local audio file through an HTML audio element
- Permission-based microphone input (HTTPS or localhost required)

## Processing chain
- Three-band low/mid/high EQ
- Save up to 20 custom presets in this browser, load/delete them, and import/export validated JSON preset files (64 KB import limit)
- Dynamics compressor (threshold, ratio, attack, release, knee)
- Parallel waveshaper saturation
- LFO-modulated chorus
- Feedback delay
- Generated stereo convolution reverb
- Compressor makeup gain and live gain-reduction meter
- Final output safety limiter, master output and peak meter

All processing is client-side. Audio is not uploaded. Browser support, device latency, audio routing and CPU limits vary. Microphone access is opt-in and can be revoked by the browser. The app does not connect to a physical console or export console plugin settings.

## Known boundaries
- This is a creative real-time processor, not a calibrated mastering processor.
- No native VST/AU/AAX plugin, standalone desktop app, cloud preset library, or hardware insert is provided.
- Reverb impulse responses are generated locally; commercial studio IR libraries are not included.
- Production readiness still requires listening tests across browsers/devices, latency and clipping review, and accessibility testing.
