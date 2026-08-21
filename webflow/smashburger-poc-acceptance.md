# SmashBurger POC acceptance

Date: 14 August 2026  
Updated: 21 August 2026
Destination: [Smashburger — Home](https://smashburger-4b8f18.webflow.io/)  
Installed component: `SmashBurger CDN` from the MWP Component Library  
Runtime release: `v0.2.1`

## Installation and Canvas

- The destination contains one genuine Library component instance.
- The Library schema retains five collapse variants and all 57 property IDs/defaults.
- The instance remains on the user-selected `Tablet` variant.
- The temporary `Show primary navigation: false` test override was restored to `true` before publication.
- Nine social/contact SVGs are remapped to destination-local Webflow assets and remain replaceable through properties.
- The native structure, property-bound settings inspector and Canvas-visible CDN Embed remain available in Designer.

## Published runtime

The release was checked at the four core Webflow widths:

| Width | Expected state | Result |
| --- | --- | --- |
| 1280px | Expanded | Pass |
| 984px | Collapsed | Pass |
| 767px | Collapsed | Pass |
| 393px | Collapsed | Pass |

Every width produced zero horizontal overflow. The runtime set `data-mwp-ready="true"`; the settings inspector then hid, all nine images loaded, and the console contained no warnings or errors.

The collapsed state uses `aria-expanded="false"`, `aria-hidden="true"` and `inert`; opening reverses those values. The nested submenu closes on the first Escape and restores focus to `More`; the outer menu closes on the second Escape and restores focus to the navigation trigger. The source acceptance build separately passed genuine macOS VoiceOver keyboard and spoken-output testing.

## CDN, reduced motion and fallback

- Both published loader elements reported `data-mwp-status="loaded"`, version `0.2.1`, `crossorigin="anonymous"` and the committed SHA-384 integrity values.
- Cache-bypassed downloads of both jsDelivr files were byte-identical to `dist/navbar-light.min.css` and `dist/navbar-light.min.js`.
- Automated failure checks dispatch the CSS and JavaScript diagnostic events, set both loader statuses to `error`, and confirm native navigation content is not removed.
- Reduced-motion coverage confirms the JavaScript transition wait becomes zero; the CSS media query removes transition delays and reduces durations to `0.01ms`.
- A fresh published load after the failure-path test returned both assets to `loaded` state.

## Library update safety

The canonical MWP Library component and destination component were compared after publication. Component description, five variants, all 57 property IDs, groups, tooltips and defaults match; only image defaults correctly point at the destination's remapped asset IDs. This confirms the installed schema remains linked and update-compatible.

The first real linked-Library upgrade was completed on 21 August 2026. The source Library shared the `v0.2.1` component update, the destination accepted it without unlinking, and the published page loaded both pinned assets successfully. At the linked Tablet breakpoint, the panel opened within its destination container, updated `aria-expanded`, `aria-hidden` and `inert` correctly, closed on Escape and returned focus to the trigger. An explicit rollback remains a product-phase validation task.

## Result

The proof of concept is accepted for handover to the Webflow Designer Extension phase. Windows NVDA spoken-output testing and an explicit semantic-version rollback remain product-phase validation tasks.
