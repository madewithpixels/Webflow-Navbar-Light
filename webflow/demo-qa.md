# SmashBurger demo acceptance — 26 September 2026

## Current state

Six pages exist in the Smashburger Webflow site: `/demo`, `/demo-dropdown`,
`/demo-full-width`, `/demo-left-drawer`, `/demo-right-drawer`, and
`/demo-overlay`. They contain one linked CDN component instance each, basic
page typography and navigation between examples. All six are drafts while the
new default layouts are being integrated. The published `/demo` URL returns
404; the original Home page remains published.

The source Library's self-contained component has the v0.2.3 candidate
Embed and new structural data hooks. The CDN Library edition and its linked
Smashburger instances still load v0.2.2. The Library style corrections have
been saved but have not been shared with installed sites.

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

## Webflow animation fixtures

The Dropdown page has page-scoped native GSAP open and close interactions and
a footer bridge from `mwp-nav:open` / `mwp-nav:close` DOM events to IX3 custom
triggers. The Overview page has a page-scoped scroll reveal interaction on
its dark card. Interaction definitions were stored, but their published
playback remains unverified. The v0.2.3 candidate fixes Custom mode's closed
visibility and lets configured open/close durations cover the GSAP timelines.

## Acceptance still required

1. Release the exact v0.2.3 CDN assets, then update the Library CDN Embed to
   that pinned version and SRI values.
2. Share the two changed Library components, apply the update on Smashburger,
   and verify that no unrelated Library resources are accepted.
3. Publish the six demo pages on the Smashburger Webflow subdomain and check
   every layout, breakpoint, keyboard/focus/ARIA/inert behavior, and both
   native GSAP interactions on the linked consumer build.

The user approved the v0.2.3 release, sharing both Library components, and
applying the update only to the Smashburger test site. Installed-site
acceptance and published consumer verification remain to be recorded here.
