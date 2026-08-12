# Webflow component map

## Site and test page

- Site: `MWP Component Library`
- Site ID: `6a0351de7c4e42148a81db6f`
- Test page: `Navbar Light`
- Page ID: `6a7cbbc9a6f261aef1113d91`
- New component: `Navbar Light`
- Component ID: `5e7a8748-7a91-3b5a-7978-b6a45d39743d`
- Test instance ID: `b515420b-9d87-fa20-e8ef-c40cc492eb86`
- Published acceptance URL: `https://mwp-component-library.webflow.io/navbar-light`

The obsolete `CSS Navbar — Details` test component and instance were removed by the user after creating a backup. `Navbar Light` is the sole acceptance component on the test page.

## Native structure

```text
Navbar Light [header.mwp-css-nav, data-mwp-navbar]
├── Navbar inner [div.mwp-css-nav_inner]
    ├── Brand [Link]
    ├── Menu details [details.mwp-css-nav_menu, data-mwp-menu]
    │   └── Menu trigger [summary.mwp-css-nav_summary, data-mwp-trigger]
    │       ├── Menu label [Text Block, data-mwp-label]
    │       └── Menu icon [Div, data-mwp-icon]
    │           ├── Icon line — top [Div, data-mwp-line]
    │           ├── Icon line — middle [Div, data-mwp-line]
    │           └── Icon line — bottom [Div, data-mwp-line]
    └── Navigation panel [nav.mwp-css-nav_panel, data-mwp-panel]
    │   ├── Primary Link elements [data-mwp-item]
    │   ├── Submenu details [nested details, data-mwp-submenu]
    │   ├── Secondary navigation [native Div + Link]
    │   └── Call to action [native Link]
├── Navbar Light CSS + enhancement [visible Embed]
├── Navbar Light settings [visible native Text Blocks, data-mwp-config]
└── Backdrop [native Div, data-mwp-backdrop]
```

The panel is the single source of navigation content for desktop and collapsed layouts. Its Base/Desktop native style is `display: flex` and `position: static`, keeping every link visible on Canvas. The embed and settings are root-level siblings below the navbar row: they remain visible in Designer without inflating the panel, and the settings block is hidden only after runtime initialization.

## Collapse variants

| Variant | ID |
| --- | --- |
| Never | `1a87b135-2b26-2213-8dfc-81db05e757c4` |
| Tablet | `1a87b135-2b26-2213-8dfc-81db05e757c5` |
| Mobile landscape (base) | `base` |
| Mobile portrait | `1a87b135-2b26-2213-8dfc-81db05e757c6` |
| Always | `1a87b135-2b26-2213-8dfc-81db05e757c7` |

Variant property ID: `1a87b135-2b26-2213-8dfc-81db05e757c3`.

Webflow emits the selected marker as `data-wf--navbar-light--variant`. The CSS fallback uses that native marker, so the breakpoint choice works without JavaScript.

## Component properties

| Name | Property ID | Default |
| --- | --- | --- |
| Motion class | `346df753-005a-96c7-bd2e-2275697b89d4` | `mwp-motion-dropdown` |
| Distance | `45fdc7cb-1398-d110-f2a7-eee03edca48d` | `1.5rem` |
| Easing | `ff7fde08-fbf9-a244-393b-f03e5f62a6c7` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Opening duration | `05cb1a10-9b01-8755-ca71-324b4a171d00` | `280ms` |
| Closing duration | `95378566-9727-f434-0c6a-e283b5c7b553` | `220ms` |
| Item stagger | `72cbbba1-d84c-a080-0e05-7dc12ac47147` | `0ms` |
| Icon duration | `ef1d9ebe-b94e-6fef-0be2-a482e5944841` | `220ms` |
| Layout | `0839ed53-9994-732d-9d4c-92383986a424` | `dropdown` |
| Panel alignment | `5d81da5e-6b11-f274-f1cc-9a2d4ef63c77` | `right` |
| Panel width | `92b1e06b-5aa4-b15e-0436-0d38f2273f63` | `24rem` |
| Menu label | `2cb57f7a-8e9d-6200-62f2-05fc5c605914` | `Menu` |
| Show menu label | `f75aee9a-81ff-58ae-64fd-e85355895e01` | `true` |
| Icon lines | `6cf61d70-aee7-639c-bc80-f9585c8a4e21` | `3` |
| Show backdrop | `9871e897-6fd5-0f74-6cb5-99605db04a36` | `true` |
| Show CTA | `7b69f228-da14-643d-f422-a3f1c6ceb79f` | `true` |
| Show secondary links | `6ef12627-487b-0aa3-a20a-4fc4d08bddad` | `true` |
| Focus first link | `3b9ea944-640f-6d21-c69f-42b92487c106` | `false` |
| Close on outside click | `76b3f040-5c5f-50ec-0b79-960d070ce9b6` | `true` |
| Close on link click | `3e2a98bd-1b72-4f1c-134e-8b456c698593` | `true` |
| Lock page scroll | `43909a2f-ec89-bc03-e6ad-ddd4dd63e2fc` | `auto` |

Behavior values are strings because the current Webflow binding surface does not expose those custom-attribute values as boolean bindings. The visible settings block provides the native Canvas-editable bridge.

## Stable integration hooks

- `[data-mwp-navbar]`: root and public API host.
- `[data-mwp-menu]`: native details state owner.
- `[data-mwp-trigger]`: native summary trigger.
- `[data-mwp-panel]`: shared navigation panel.
- `[data-mwp-item]`: stagger item.
- `[data-mwp-submenu]`: nested details submenu.
- `[data-mwp-backdrop]`: native backdrop Div.
- `data-state`: `expanded`, `opening`, `open`, `closing` or `closed`.
- Events: `mwp-nav:open`, `mwp-nav:opened`, `mwp-nav:close`, `mwp-nav:closed`.
- API: `element.mwpNavbarLight.open()`, `.close()`, `.toggle()`, `.destroy()`.

## Generated embed

`webflow/navbar-light-embed.html` is generated from `src/navbar-light.css` and `src/navbar-light.js`. Never edit the generated embed as the source of truth; run `npm run build:webflow`, then synchronize the resulting content to the visible Webflow Embed.
