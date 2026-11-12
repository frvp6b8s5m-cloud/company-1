# Asset Provenance and Rights Ledger

Production imagery must be authentic real-world photography of professional audio equipment, venues, studios, installation work or architecture. No AI-generated imagery or synthetic sci-fi artwork.

## Publishing rules
- Use only assets with a clear commercial-use license or written permission suitable for this website. The Pexels License permits website use, commercial use and modification without required attribution, subject to its restrictions.
- Verify the license terms and download/source page at the time the asset is selected.
- Keep the original source URL, creator/photographer, license name, license URL or permission record, download date, asset filename, dimensions and optimization derivatives in the project asset ledger.
- Do not publish attribution/source labels on the website unless the license requires visible attribution or the user later requests it. License-required attribution always takes precedence.
- Never assume that a search result, social post, manufacturer product page or image URL grants reuse rights.
- Manufacturer product images require applicable permission or terms that allow the intended commercial display. Pexels imagery must not imply endorsement by a depicted person or brand; identifiable people must not be portrayed in a bad light or offensively. Do not use Pexels images as BZaudio trademarks, trade names or service marks.\n- License reference checked 2026-11-12: https://www.pexels.com/license/.
- Optimize responsive derivatives and preserve a high-quality source copy outside the public asset path where appropriate.

## Ledger
| Asset path | Subject / intended use | Creator | Source | License / permission | Checked | Derivatives |
|---|---|---|---|---|---|---|
| Hero / console detail (responsive Pexels CDN) | Live sound engineer operating a digital mixing console | Caleb Oquendo | https://www.pexels.com/photo/sound-engineer-at-concert-soundboard-setup-34612567/ | Pexels License — free commercial use; attribution not required; check depicted-person/brand rights | 2026-11-12 | Responsive CDN variants referenced in image srcset |
| PA / system design photography | Large line-array speakers suspended outdoors | Caleb Oquendo | https://www.pexels.com/photo/outdoor-concert-speaker-system-setup-34585137/ | Pexels License — free commercial use; attribution not required; check depicted-brand/property rights | 2026-11-12 | Responsive CDN variants referenced in image srcset |
| Equipment detail photography | Professional audio equipment at live event | German Suarez | https://www.pexels.com/photo/professional-audio-equipment-setup-at-live-event-34594386/ | Pexels License — free commercial use; attribution not required; check depicted-brand/property rights | 2026-11-12 | Responsive CDN variants referenced in image srcset |

## Review gate
An image is not production-ready until its rights are documented and its visual content is checked for authenticity, accuracy and relevance.

## Current implementation note
The current implementation uses semantic image elements with responsive Pexels CDN srcset candidates, high fetch priority for the hero and lazy loading for below-the-fold images. Initial release decision: retain the Pexels CDN with responsive srcset candidates rather than copying stock files into the repository. This keeps the static repo lean and delegates responsive resizing to the source CDN. The CI checks representative CDN responses and verifies that all seven image elements load in Chromium. Revisit local copies only if CDN stability, licensing or hosting requirements change. No visible credit labels are planned because the Pexels license does not require attribution; any separate rights or license requirement takes precedence.
