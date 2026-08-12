# Webflow Navbar Light

Navbar Light is a CSS-first replacement for Webflow's native Navbar. It is designed to retain the useful native behaviour while remaining transparent, editable and styleable in Webflow Designer.

The component is being developed in two synchronized forms:

1. A native component in the **MWP Component Library** Webflow site, tested on the **Navbar Light** page.
2. A repository reference implementation containing the matching CSS, progressive JavaScript, examples and tests.

## Principles

- Native Webflow elements form the visible component.
- All editable content remains visible on the Canvas.
- Webflow classes, component variants and component properties are preferred.
- No pseudo-elements are used.
- CSS supplies the baseline behaviour and presentation.
- JavaScript adds progressive enhancements such as focus management, outside-click closing and scroll locking.
- Webflow Interactions or GSAP can replace the built-in motion without replacing state or accessibility behaviour.

## Planned capabilities

- One shared navigation link set for expanded and collapsed layouts.
- Configurable collapse breakpoint: Never, Tablet, Mobile landscape, Mobile portrait or Always.
- Dropdown, full-width, left drawer, right drawer and full-screen layouts.
- Dropdown, slide left, slide right, slide up, fade, none and custom motion presets.
- Editable native burger bars with an optional Menu label and close-icon transformation.
- Nested native-details submenus, optional CTA and secondary content regions.
- Escape, outside-click and link-click closing.
- Optional first-link focus and body scroll locking.
- Reduced-motion support.
- Stable lifecycle events and programmatic controls for Webflow Interactions and GSAP.

The maintained implementation checklist is in [todo.md](todo.md).

## Intended repository structure

```text
.
├── README.md
├── todo.md
├── src
│   ├── navbar-light.css
│   └── navbar-light.js
├── demo
│   └── index.html
├── tests
│   └── navbar-light.test.js
└── webflow
    └── component-map.md
```

## Baseline architecture

The final component uses a single navigation panel rather than separate desktop and mobile link lists. At expanded breakpoints the panel participates in the header layout. At collapsed breakpoints the same panel is controlled by a native `<details>`/`<summary>` trigger and the selected CSS layout/motion preset.

The embedded script does not create or replace visible elements. It only synchronises state and provides optional behaviour that CSS and native details cannot supply consistently.

## Webflow testing safety

The **Navbar Light** test page must not be refreshed without the user's explicit approval and confirmation that a backup has been taken. Testing should use Webflow data/Designer operations, Preview toggling and targeted inspection without reloading the Designer document.

## Status

Planning and repository setup are in progress. See [todo.md](todo.md) for the current checklist.

