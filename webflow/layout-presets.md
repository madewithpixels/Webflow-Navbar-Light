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
