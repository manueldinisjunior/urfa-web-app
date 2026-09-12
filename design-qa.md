# Design QA

## Comparison set

| Page | Source reference | Implementation capture | Viewport / state |
| --- | --- | --- | --- |
| Home | `/workspace/scratch/f49a71a922f7/upload/1f0be704-71d5-49d8-957d-8e2f043d4bab.png` (1280×768) | `cloud-browser:/tmp/urfa-qa/home-desktop.png` | 1363×936, top of page, empty cart |
| Menu | `/workspace/scratch/f49a71a922f7/upload/https-kasushi.co.mz-menu-.png` (693×2048) | `cloud-browser:/tmp/urfa-qa/menu-desktop.png` | 1363×936, all categories, six products |
| About | `/workspace/scratch/f49a71a922f7/upload/https-kasushi.co.mz-sobre-.png` (1280×815) | `cloud-browser:/tmp/urfa-qa/about-desktop.png` | 1363×936, top of page |
| Contact | `/workspace/scratch/f49a71a922f7/upload/https-kasushi.co.mz-contacto-.png` (1280×1789) | `cloud-browser:/tmp/urfa-qa/contact-desktop.png` | 1363×936, top of page |
| Careers | `/workspace/scratch/f49a71a922f7/upload/https-kasushi.co.mz-carreiras-.png` (1280×1053) | `cloud-browser:/tmp/urfa-qa/careers-desktop.png` | 1363×936, first role expanded |

The source and implementation captures were opened together for direct visual comparison. Additional supplied references for the split feature, red service, gallery, and location sections were checked against the corresponding home-page sections.

## Interactions tested

- Header menu opens, closes, and exposes all page routes.
- Global search routes to the menu and filters `Falafel` to one result.
- Category tabs filter the menu.
- Product cards route to a complete product detail page.
- Add-to-cart, quantity increase, calculated total, cart persistence, and local demo confirmation work.
- Careers accordion and validated local-only application form work.
- Contact CTA and validated local-only message form work.
- Route changes reset scroll position to the top.
- Responsive CSS was reviewed at the 1080, 760, and 480 pixel breakpoints; navigation, grids, split layouts, forms, and cart rows collapse without fixed-width overflow.

## Console

No application-origin console errors or warnings were found. The cloud browser reported repeated `chrome-extension://` metadata errors from its own extension; these are outside the application.

## Findings and fixes

1. **P1 — empty map panel:** the external map iframe did not render in the preview environment. Replaced it with a local, art-directed map image so the split contact composition is deterministic and deploy-safe.
2. **P1 — route scroll retention:** navigating from a lower home section could keep the previous scroll offset. Added route-level scroll reset.
3. **P2 — mobile search unavailable:** the search control was hidden below 760px. Kept it visible and retained the horizontally scrollable menu categories.
4. **P2 — cart accessibility copy:** corrected the singular label from `1 Artikeln` to `1 Artikel`.
5. **P2 — legacy cart schema:** versioned the local-storage key so carts created before image-backed products cannot render broken thumbnails.

## Visual result

- Header proportions, centered wordmark, icon cells, condensed display type, red accent, gray catalog surface, product-card rhythm, dark footer, and generous whitespace closely follow the supplied visual system.
- Sushi imagery and Portuguese copy were intentionally translated into Turkish grill photography and German content while preserving the reference composition and hierarchy.
- All product and section imagery is local; no placeholder, emoji, or third-party runtime image dependency remains.

final result: passed
