# SmashBurger demo acceptance — 27 September 2026

## Current state

Six pages are published on the Smashburger Webflow subdomain: `/demo`,
`/demo-dropdown`, `/demo-full-width`, `/demo-left-drawer`,
`/demo-right-drawer`, and `/demo-overlay`. They contain one linked CDN
component instance each, basic page typography and navigation between
examples. The original Home page remains published.

Version 0.2.3 is tagged and published. Both source Library components have
the new structural data hooks and layout corrections. The source CDN edition
loads the exact pinned v0.2.3 files. The two component changes were shared
from the MWP Component Library, then the update was accepted only on the
Smashburger test site. Other installed sites were not updated.

## Source runtime checks

The self-contained Library test page was temporarily set to Always collapse
and each layout in turn, published to the Webflow subdomain, and checked in a
browser. Its original Tablet / left / left-motion settings were restored and
republished afterward.

| Layout | Checked widths | Result |
| --- | --- | --- |
| Dropdown | 320, 991, 1920px | Compact absolute panel; 72px closed header; no horizontal overflow. |
| Full width | 320, 767, 991, 1920px | One column on phones, two at 991px; corrected to 1920px viewport width at XXL; no overflow. |
| Left drawer | 320, 479, 767, 991, 1279, 1280, 1440, 1920px | Fixed side panel, visible contrasting close control, 72px closed header; no overflow. |
| Right drawer | 320, 479, 767, 991, 1280, 1920px | Fixed side panel, visible close control; no closed or open horizontal overflow. |
| Overlay | 320, 479, 767, 991, 1920px | Full viewport dark panel, centred links, contrasting close control and social icons; no overflow. |

At 320px, the open left drawer and overlay were also reviewed visually. The
source runtime's closed panel immediately computes to `visibility:hidden`,
`opacity:0` and `transition-duration:0s`, avoiding an initial flash. Local
tests: `npm test` (21 passed), `npm run check`, and `git diff --check` passed.
The v0.2.3 tag passed `npm run check:dist`; both jsDelivr assets matched the
committed files byte for byte. The published source CDN page loaded both
assets with SRI, reached `data-mwp-ready="true"`, and had no page overflow at
320, 479, 767, 991, 1280, 1440, or 1920px. Its closed header was 72px
through 991px and its expanded header was 92px at wider widths.

## Webflow animation fixtures

The Dropdown page has page-scoped native GSAP open and close interactions and
a footer bridge from `mwp-nav:open` / `mwp-nav:close` DOM events to IX3 custom
triggers. The Overview page has a page-scoped scroll reveal interaction on
its dark card. On the published Dropdown page, the bridge reached `ready`,
`open`, and `close`; the native GSAP timeline changed panel opacity and
transform in both directions. The panel ended hidden with `aria-hidden=true`
and `inert`, and Escape returned focus to the menu trigger. On the published
Overview page, the dark card began at opacity 0 and 28px vertical offset,
then animated into view on scroll. Custom mode keeps the closed panel hidden
and uses the configured open/close durations for the GSAP timelines.

## Linked consumer acceptance

All six published pages loaded both CDN assets at v0.2.3, reached
`data-mwp-ready="true"`, and showed the expected layout. Their copy now names
v0.2.3; no old v0.2.2 text remains. Each layout page was tested closed and
open at 320, 479, 767, 991, 1279, 1280, 1440, and 1920px. The header was
72px closed, panel placement matched its layout, and there was no horizontal
page overflow. Full width filled the viewport at each width; drawers were
384px wide except when limited by a smaller viewport; the overlay covered
the viewport. The dropdown, full width, both drawers, and overlay were also
reviewed visually at representative mobile or tablet sizes.

At 320px on Overview, the first Escape closed the nested submenu and kept
focus on its summary. The second Escape closed the main menu, set its panel
to `aria-hidden=true` and `inert`, and returned focus to the trigger. An open
drawer set `overflow:hidden` on the document element; it was released on
close. The initial closed panel was hidden on the published pages. Automated
tests remain 21/21 passing. A fresh assistive-technology check of the v0.2.3
consumer and Windows NVDA verification have not yet been performed.
