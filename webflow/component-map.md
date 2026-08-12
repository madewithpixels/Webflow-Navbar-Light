# Webflow component map

## Site and test page

- Site: `MWP Component Library`
- Site ID: `6a0351de7c4e42148a81db6f`
- Test page: `Navbar Light`
- Page ID: `6a7cbbc9a6f261aef1113d91`
- Component: `CSS Navbar — Details`
- Component ID: `1d76b426-b460-6cb4-846a-f7ccfdb84379`

Do not refresh the `Navbar Light` Designer page without explicit user approval and confirmation of a backup.

## Target native structure

```text
Navbar Light [header.mwp-css-nav, data-mwp-navbar]
└── Inner [div.mwp-css-nav_inner]
    ├── Brand [Link]
    ├── Menu [details.mwp-css-nav_menu, data-mwp-menu]
    │   └── Trigger [summary.mwp-css-nav_summary, data-mwp-trigger]
    │       ├── Menu label [Text/Span, data-mwp-label]
    │       └── Icon [Div, data-mwp-icon]
    │           ├── Line [Div, data-mwp-line]
    │           ├── Line [Div, data-mwp-line]
    │           └── Line [Div, data-mwp-line]
    ├── Navigation panel [nav.mwp-css-nav_panel, data-mwp-panel]
    │   ├── Primary links [Div]
    │   ├── Optional nested details submenu(s)
    │   ├── Optional secondary links [Div]
    │   ├── Optional CTA [Link Block]
    │   └── Behaviour embed [Embed; hidden only because embeds are non-visual]
    └── Backdrop [Div, data-mwp-backdrop]
```

The navigation panel is one shared link set. Webflow breakpoint variants change the trigger and panel layout; they do not duplicate content.

## Existing collapse variants

- Never: `8e428172-dfcc-f6ba-a780-513395c62760`
- Tablet: `bbd82321-47e8-40dc-3cef-2f4c6afdd8e5`
- Mobile landscape/base: `base`
- Mobile portrait: `7cfe06db-5ac8-557c-7582-19da7661a617`
- Always: `715b5503-8766-ee6e-192c-93bdf6827801`

## Stable integration hooks

- `[data-mwp-navbar]`: root and public API host.
- `[data-mwp-menu]`: native details state owner.
- `[data-mwp-trigger]`: native summary trigger.
- `[data-mwp-panel]`: shared navigation panel.
- `[data-mwp-item]`: optional stagger item.
- `[data-mwp-submenu]`: native nested details submenu.
- `[data-mwp-backdrop]`: native backdrop div.
- `data-state`: `expanded`, `opening`, `open`, `closing` or `closed`.
- Events: `mwp-nav:open`, `mwp-nav:opened`, `mwp-nav:close` and `mwp-nav:closed`.
- API: `element.mwpNavbarLight.open()`, `.close()`, `.toggle()` and `.destroy()`.
