# SmashBurger layout presets

The same native Webflow links and panel are used in every layout. The Layout
property selects the placement and basic presentation when the navbar is
collapsed. Expanded navigation remains an ordinary horizontal Webflow header.

| Layout | Default collapsed presentation |
| --- | --- |
| Dropdown | Compact panel anchored to the menu button, with stacked links. |
| Full width | Viewport-width panel below the header; two content columns at tablet and wider, one column at mobile landscape and smaller. |
| Left drawer | Viewport-height panel from the left, with a visible close button and secondary links at the bottom. |
| Right drawer | Same drawer from the right. |
| Overlay | Viewport-filling dark panel with large, centred links and a visible close button. |

## Layout presets switch (v0.2.5)

The collapsed presentation has two parts. **Structural** rules always apply:
placement, width and height, viewport-bounded scrolling, stacking, the grid
tracks for Full width and the drawers, and keeping the close button reachable
while a drawer or overlay is open. **Visual** preset rules can be switched off:
panel surface, border, shadow and ink; panel, group and link spacing; link row
sizing; the Full-width and secondary dividers; overlay typography, centring and
icon filter; and the drawer/overlay close-button styling.

Set `data-presets="false"` on the navbar root, or turn off the `Layout presets`
component property (Webflow emits `False`; the match is case-insensitive), to
let ordinary Webflow classes own the entire collapsed look. Presets are on
when the attribute is absent, so existing installs keep their appearance.
Use Off for a custom-designed site; use On, plus the tokens below, for a quick
neutral result.

Both MWP Component Library source components expose this as `Layout` →
`Layout presets` (default On), bound to the root `data-presets` attribute
(property IDs: self-contained `4eec2e32-eff5-80f8-5368-2785eae1af7a`, CDN
`1cfa4e51-4af3-d818-6c5b-a56df6f3b79a`). Published check, 2026-10-03, on the
self-contained source page (Left drawer, 600px): the rendered Embed hashed to
the v0.2.5 build. With `True`, the open panel had the preset white surface,
shadow, 16px padding and gap, and the dark close button. With `False`, the
native `mwp-css-nav_panel` class styling showed through (transparent, 4px
padding, 2px gap, no shadow, plain trigger), while the structure was
unchanged: fixed, full height, 384px wide, scrollable.

After the `v0.2.5` tag was pushed and the Library update was shared and
accepted, the published CDN source page, SB Test Five
`/smashburger-cdn-import-proof` and Smashburger `/` all loaded both `v0.2.5`
assets with SRI enforced. Each emitted `data-presets="True"` and had Primary
before Secondary. On SB Test Five (Dropdown, 600px), On gave the white surface,
shadow and 16px padding; switching the attribute to `False` in a test frame
gave the linked class styling (transparent, 4px padding, no shadow), with the
panel still 384px wide, right-anchored and scrollable, and no overflow.
Smashburger's Dropdown opened with the preset look and no overflow.

The neutral baseline uses these optional CSS custom properties on the navbar
root or a project wrapper: `--mwp-nav-panel-surface`,
`--mwp-nav-panel-ink`, `--mwp-nav-panel-border`,
`--mwp-nav-panel-shadow`, `--mwp-nav-overlay-surface`,
`--mwp-nav-overlay-ink`, `--mwp-nav-close-surface`,
`--mwp-nav-close-ink`, `--mwp-nav-close-border`,
`--mwp-nav-header-height`, `--mwp-nav-z-index`, and
`--mwp-nav-overlay-icon-filter`. The existing
`--mwp-nav-panel-width` controls the
dropdown and drawer width. Native Webflow classes remain editable for the
brand, links, icons, CTA and project-specific typography.

The Library versions include `data-mwp-inner`, `data-mwp-primary`,
`data-mwp-links`, and `data-mwp-secondary` hooks. These keep the preset CSS
stable when Webflow prefixes class names on a linked Library instance. Keep
the hooks if making a local copy.

For Webflow GSAP/IX3 motion, set Motion class to `mwp-motion-custom`. The
component keeps a closed panel hidden and allows the configured open/close
duration for the external timeline. The component emits `mwp-nav:open` and
`mwp-nav:close` DOM events; an IX3 custom trigger needs a small event bridge.
The dropdown demo contains the bridge and two page-scoped native GSAP
interactions. Reduced-motion preference still makes the component state
transition immediate.

These presets ship in the v0.2.3 source and generated distribution files.
The linked Webflow Library update must be accepted on each site before its
installed components use the new native styles and CDN Embed. See the
[demo acceptance record](demo-qa.md) for the Smashburger consumer checks.

The next source candidate supports an explicit `data-backdrop="true"` on the
navbar root for Dropdown and Full width. It does not change the existing
drawer/overlay backdrop behavior or enable scroll locking. This source hook
is not yet bound to a native Webflow property or included in pinned v0.2.3;
verify it in Preview and on a published test page before distribution.
