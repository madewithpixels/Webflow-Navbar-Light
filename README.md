# Webflow Navbar Light

Navbar Light is a CSS-first, Webflow-native replacement for the native Navbar component. It keeps one shared set of links for expanded and collapsed layouts, exposes the useful choices as component properties, and uses JavaScript only for progressive enhancement.

The maintained implementation exists in two synchronized forms:

1. The `Navbar Light` component in the **MWP Component Library**, tested on the **Navbar Light** page.
2. This repository, containing the matching CSS, enhancement script, interactive reference demo, tests and generated Webflow embed.

Published acceptance build: <https://mwp-component-library.webflow.io/navbar-light>.

## Design constraints

- Visible structure is made from native Webflow elements.
- Links, submenu, CTA, secondary navigation, backdrop, icon bars, settings and embed remain visible in Designer.
- There are no pseudo-elements.
- Webflow classes remain responsible for visual design.
- Custom CSS is limited to functional layout, state and motion behavior.
- Native `<details>`/`<summary>` plus CSS provide the no-script baseline.
- JavaScript adds state events, focus management, outside/link closing, inertness and scroll locking.

## Using the Webflow component

Insert `Navbar Light`, then select its collapse variant at the Base breakpoint:

- `Never`
- `Tablet`
- `Mobile landscape`
- `Mobile portrait`
- `Always`

The variant applies across the component instance. Do not choose a different variant at each responsive breakpoint unless an intentionally different instance configuration is required.

The test instance is left on `Tablet`, so it is expanded on Desktop and collapsed at Tablet and below.

### Component properties

| Group | Properties |
| --- | --- |
| Layout | Layout, Panel alignment, Panel width |
| Motion | Motion class, Opening duration, Closing duration, Distance, Easing, Item stagger, Icon duration |
| Trigger | Menu label, Show menu label, Icon lines |
| Content | Show CTA, Show secondary links, Show backdrop |
| Behavior | Focus first link, Close on outside click, Close on link click, Lock page scroll |

String values use CSS syntax where appropriate, for example `280ms`, `1.5rem`, `24rem` and `cubic-bezier(0.22, 1, 0.36, 1)`.

The native `Navbar Light settings` block mirrors values that the current Webflow API cannot bind directly to custom attributes. It and the enhancement Embed sit immediately below the native navbar row, deliberately visible and styleable in Designer without disrupting the navigation layout. The enhancement reads the settings and hides the block only in Preview/published runtime after initialization.

## Layout and motion presets

Layouts:

- `dropdown`
- `full-width`
- `left`
- `right`
- `overlay`

Motion classes:

- `mwp-motion-dropdown`
- `mwp-motion-left`
- `mwp-motion-right`
- `mwp-motion-up`
- `mwp-motion-fade`
- `mwp-motion-none`
- `mwp-motion-custom`

`Custom` removes built-in panel transforms and transitions. State, ARIA, inertness, focus behavior and lifecycle events continue to work, leaving Webflow Interactions or GSAP free to own the visual animation.

## CSS baseline and progressive enhancement

| Capability | CSS/native | Enhancement script |
| --- | --- | --- |
| Selected collapse breakpoint | Yes, using Webflow's native variant marker | Observes breakpoint changes and synchronizes state |
| Open/close from trigger | Native `<details>` | Adds lifecycle state and accessibility links |
| Dropdown/slide/fade motion | Yes when its class/attribute is available | Applies property-bound configuration values |
| Escape close and focus return | Browser-dependent for native details | Yes |
| Outside/link close | No | Optional |
| Panel inertness | No | Yes |
| First-link focus | No | Optional |
| Drawer/overlay scroll lock | No | Optional/automatic |
| Lifecycle events and API | No | Yes |

The stylesheet-only fallback was verified in Webflow Preview with the script removed: the Tablet variant started closed and opened using the native summary trigger.

## Editing native content

The `Navigation panel` is the single source of links for desktop and collapsed layouts. Edit, reorder or duplicate its native Link elements normally. The current-page class continues to be applied by Webflow.

The included submenu is a nested native `<details>` pattern. Duplicate the complete `Submenu details` element to add another. CTA and secondary navigation have component visibility properties.

A component Slot was evaluated but not added: Webflow slots accept component instances rather than arbitrary native elements, which would make simple link editing more restrictive. Native panel regions remain the clearer default.

## Integration hooks

Stable selectors:

- `[data-mwp-navbar]`
- `[data-mwp-menu]`
- `[data-mwp-trigger]`
- `[data-mwp-panel]`
- `[data-mwp-item]`
- `[data-mwp-submenu]`
- `[data-mwp-backdrop]`

Runtime `data-state` values are `expanded`, `opening`, `open`, `closing` and `closed`.

Lifecycle events bubble from the root:

- `mwp-nav:open`
- `mwp-nav:opened`
- `mwp-nav:close`
- `mwp-nav:closed`

Programmatic controls are exposed on the root:

```js
const navbar = document.querySelector('[data-mwp-navbar]').mwpNavbarLight;
navbar.open({ focusFirst: true });
navbar.close({ focusTrigger: true });
navbar.toggle();
```

See [examples/gsap.js](examples/gsap.js) for a Custom-mode GSAP handoff and [examples/webflow-interactions.md](examples/webflow-interactions.md) for the Webflow Interactions setup and its event limitations.

## Local development

```text
npm install
npm test
npm run check
npm run build:webflow
```

Open [demo/index.html](demo/index.html) through a local web server. Its controls exercise every layout and motion combination. `npm run build:webflow` regenerates `webflow/navbar-light-embed.html` from the maintained source files.

## Repository map

```text
.
├── README.md
├── todo.md
├── demo/index.html
├── examples
│   ├── gsap.js
│   └── webflow-interactions.md
├── scripts/build-webflow-embed.mjs
├── src
│   ├── navbar-light.css
│   └── navbar-light.js
├── tests/navbar-light.test.js
└── webflow
    ├── component-map.md
    └── navbar-light-embed.html
```

## Webflow testing safety

Before structural changes, create a Webflow backup. The obsolete `CSS Navbar — Details` test component has been removed; `Navbar Light` is now the sole acceptance component on the page. Publishing remains a deliberate user-controlled release step.

See [todo.md](todo.md) for completed work and the remaining visual/assistive-technology verification.
