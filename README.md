# SmashBurger

SmashBurger is a CSS-first, Webflow-native replacement for the native Navbar component. It keeps one shared set of links for expanded and collapsed layouts, exposes the useful choices as component properties, and uses JavaScript only for progressive enhancement. The current `v0.2.1` files and compatibility API retain their original `Navbar Light` implementation names until the planned repository and package migration is released.

The maintained implementation exists in synchronized forms:

1. The self-contained `SmashBurger` component in the **MWP Component Library**, tested on the legacy **Navbar Light** acceptance page.
2. The optional pinned `SmashBurger CDN` component, isolated on the legacy **Navbar Light CDN** acceptance page.
3. This repository, containing the matching CSS, enhancement script, interactive reference demo, tests and generated Webflow embeds.

Published acceptance builds:

- Source library: <https://mwp-component-library.webflow.io/navbar-light>
- Clean Library installation: <https://smashburger-4b8f18.webflow.io/>

## Design constraints

- Visible structure is made from native Webflow elements.
- Links, submenu, submenu arrow, CTA, social/contact navigation and replaceable icon Images, backdrop, icon bars, settings and embed remain visible in Designer.
- There are no pseudo-elements.
- Webflow classes remain responsible for visual design.
- Custom CSS is limited to functional layout, state and motion behavior.
- Native `<details>`/`<summary>` plus CSS provide the no-script baseline.
- JavaScript adds state events, focus management, outside/link closing, inertness and scroll locking.

## Using the Webflow component

For cross-project installation, share the MWP Component Library with the destination site and insert `SmashBurger` or `SmashBurger CDN` from Webflow Libraries. This preserves component identity, all five variants, the complete property surface and replaceable icon bindings. Ordinary cross-site clipboard paste is only a flattened fallback: it transfers native elements and assets but does not preserve component properties or variants.

Insert `SmashBurger` or `SmashBurger CDN`, then select its collapse variant at the Base breakpoint:

- `Never`
- `Tablet`
- `Mobile landscape`
- `Mobile portrait`
- `Always`

The variant applies across the component instance. Do not choose a different variant at each responsive breakpoint unless an intentionally different instance configuration is required.

The test instance is left on `Tablet`, so it is expanded on Desktop and collapsed at Tablet and below.

`Never` deliberately preserves the expanded navigation at every width. At very narrow widths, the designer must ensure the chosen links fit, wrap the native inner/panel classes, or choose a collapsing variant; Navbar Light does not silently override that selection.

The live Webflow Canvas matrix has been checked for all five variants at Desktop, Tablet, Mobile landscape and Mobile portrait. Expanded variants keep the shared native panel visible; collapsed variants keep the burger and editable panel visible in their authoring layout. The published stylesheet and acceptance page were subsequently verified at both affected mobile widths, including keyboard open/Escape close, panel containment and zero page overflow.

### Component properties

| Group | Properties |
| --- | --- |
| Layout | Layout, Panel alignment, Panel width |
| Motion | Motion class, Opening duration, Closing duration, Distance, Easing, Item stagger, Icon duration, Submenu icon duration, Submenu icon easing, Submenu icon rotation |
| Trigger | Menu label, Show menu label, Icon lines, Show submenu arrows |
| Content | Show primary navigation, Show CTA, Show secondary navigation, Show socials, Show social labels, Show contact links, Show contact labels and Show backdrop; individual Facebook, Instagram, LinkedIn, TikTok, Threads, X, WhatsApp, Telephone and Email destinations, replaceable icon Images and visibility |
| Behavior | Focus first link, Close on outside click, Close on link click, Lock page scroll |

String values use CSS syntax where appropriate, for example `280ms`, `1.5rem`, `24rem` and `cubic-bezier(0.22, 1, 0.36, 1)`.

The native `Navbar Light settings` block mirrors values that the current Webflow API cannot bind directly to custom attributes. It and the enhancement Embed sit immediately below the native navbar row, deliberately visible and styleable in Designer without disrupting the navigation layout. The enhancement reads the settings and hides the block only in Preview/published runtime after initialization.

### Styling and destination-project inheritance

The included Webflow styles are deliberately structural: layout, spacing, touch targets, burger geometry, panel grouping, borders and small radii. Brand and navigation classes set only a modest type scale, weight and spacing; they do not set a font family or fixed text colour. The installed component therefore inherits the destination project's font and colour from its body/link tag styles. The burger bars, panel borders and outlined CTA use `currentColor` and follow that inherited colour automatically.

This means the component can look intentionally plain in the library. Apply project-specific presentation through the existing native `mwp-css-nav_*` classes after pasting; do not edit the delivery Embed or use `!important`. The legacy `v0.2.0` stylesheet had one cascade exception: its collapsed-panel placement and width selector tied a single Webflow class and won because the CDN loaded later. `v0.2.1` demotes panel display, placement, insets, alignment, width and transform-origin to zero-specificity fallbacks so the ordinary panel class can override them directly.

### Replacing an existing Webflow Navbar

A live migration trial has confirmed that SmashBurger can replace an already styled and rearranged native Webflow Navbar without reproducing that Navbar's dropdown structure. The dependable workflow is to configure the Library instance first, unlink it, retain the functional data hooks and delivery Embed, then move project-specific presentation and utility links onto the native SmashBurger elements.

The current release has one important structural constraint: `Menu details` and `Navigation panel` must remain adjacent, direct children of `Navbar inner`. Its CSS-only open state currently relies on that relationship. Style or reposition those elements with Flex, Grid, ordering and normal classes rather than wrapping the menu trigger separately. A future hardening release is planned to make enhanced open-state presentation respond directly to the panel's runtime `data-state` while preserving the canonical no-script structure.

Existing fixed or sticky page content can also paint over an otherwise open panel. Give the SmashBurger root a deliberate stacking level above normal page content before changing overflow or containment. See [the Webflow migration guide](webflow/migration-guide.md) for the complete public checklist, Webflow-native element restrictions and accessibility checks.

### MWP Component Library demo shell

The source site has a deliberately separate demo theme for presenting components. Its `MWP Demo Theme` variables, `mwp-site-*` classes and `mwp-home-*` classes style the library pages, not the Navbar Light component itself. Navbar Light does not reference those theme variables.

The native `/style-guide` page is both a visual reference and a class-retention page. It keeps the demo typography, semantic colours, layout primitives, buttons, pills and cards attached to real Canvas elements so Webflow's unused-class cleanup does not remove useful library-site styles. Project-specific presentation belongs on these host-page classes; portable component structure belongs on `mwp-css-nav_*`.

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

Dropdown centering uses the independent CSS `translate` property, so Custom mode can leave the animation `transform` property entirely under Webflow Interactions or GSAP control.

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

Collapsed panels use a functional grid so native panel children stack into usable rows. Nested submenu links use the same native grid stacking in expanded and collapsed layouts. The matching Webflow variant styles also place the visible panel below the brand/trigger row while editing at its collapse breakpoint.

The included submenu is a nested native `<details>` pattern. Duplicate the complete `Submenu details` element to add another. Its optional chevron is made from native Divs, uses no pseudo-elements, and follows `currentColor`; duration, easing and open-state rotation are editable properties.

The panel has two direct, independently styleable groups: `Secondary navigation` first and `Primary navigation` second. Primary navigation contains a `Navigation links` wrapper followed by the CTA as its final child. Secondary navigation contains a seven-link `Social links` wrapper followed by a two-link `Contact links` wrapper for Telephone and Email. This predictable nesting supports flex, grid, reordering and alignment changes without editing the enhancement Embed.

Every named entry keeps its native Webflow Link destination, replaceable icon Image and individual visibility toggle. `Show social labels` controls the seven native social label Divs; `Show contact labels` controls the Telephone and Email label Divs. Both controls leave their replaceable icons visible. The primary, CTA, secondary master, social and contact groups each have independent visibility properties. Webflow component properties cannot generate a repeatable list, so these named slots provide a useful default; duplicate or remove native links for a different set.

The supplied SVGs are stored as normal Webflow assets, so there is no runtime icon-CDN dependency and every Image can be replaced from the component properties. Brand defaults come from versioned Simple Icons assets except LinkedIn, which uses Font Awesome Free; Telephone and Email use Lucide. Respect each brand's usage guidelines. Simple Icons is distributed as CC0 with an explicit trademark/licensing disclaimer, Font Awesome Free Icons are CC BY 4.0, and Lucide is ISC-licensed.

In Designer, submenu links remain visible so they can be selected and styled. In Preview and published output, functional CSS restores native `<details>` behavior: a closed submenu list is removed from rendering and keyboard/screen-reader order until its summary is opened.

A component Slot was evaluated but not added: Webflow slots accept component instances rather than arbitrary native elements, which would make simple link editing more restrictive. Native panel regions remain the clearer default.

## Integration hooks

Stable selectors:

- `[data-mwp-navbar]`
- `[data-mwp-menu]`
- `[data-mwp-trigger]`
- `[data-mwp-panel]`
- `[data-mwp-item]`
- `[data-mwp-submenu]`
- `[data-mwp-submenu-icon]`
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
npm run build
npm run check:dist
```

Open [demo/index.html](demo/index.html) directly or through a local web server. Its controls exercise every layout and motion combination. `npm run build` regenerates the self-contained Webflow Embed, the demo's classic browser script and the release-ready `dist` files from the maintained source files. `npm run check:dist` fails when committed CDN artifacts no longer match the source.

## Optional CDN distribution

The CDN route uses exact semantic-version GitHub tags through jsDelivr. The live `v0.2.1` production files are:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/madewithpixels/Webflow-Navbar-Light@v0.2.1/dist/navbar-light.min.css">
<script defer src="https://cdn.jsdelivr.net/gh/madewithpixels/Webflow-Navbar-Light@v0.2.1/dist/navbar-light.min.js"></script>
```

Never use `latest`, a branch name or a version range in a production Webflow project. Exact jsDelivr versions are permanently cached, so a correction must receive a new version and tag. The generated [webflow/navbar-light-cdn-loader.html](webflow/navbar-light-cdn-loader.html) includes the exact URLs, SHA-384 integrity values, a readable runtime version and load/error state on the native link/script elements. A failed asset dispatches `mwp-navbar-light:cdn-error` and logs a diagnostic without hiding the native navigation content.

Sites with a Content Security Policy must allow `https://cdn.jsdelivr.net` in `style-src` and `script-src`. The loader's inline diagnostic handlers also need the site's permitted inline-handler policy; blocking those handlers suppresses the custom diagnostic but does not itself block the external CSS or JavaScript. The CDN necessarily receives ordinary request metadata needed to serve the files. Use the self-contained Embed or self-hosted files when third-party requests or the required CSP allowances are unsuitable.

### Switching delivery without rebuilding the navigation

The native Webflow structure and component properties are independent of the delivery choice. Change only the Canvas-visible delivery Embed; do not recreate the Brand, trigger, panel, links, wrappers, settings or backdrop.

- **Self-contained:** use [webflow/navbar-light-embed.html](webflow/navbar-light-embed.html). It carries the functional CSS and progressive-enhancement script together and makes no third-party runtime request.
- **Pinned CDN:** use [webflow/navbar-light-cdn-loader.html](webflow/navbar-light-cdn-loader.html). It loads the exact versioned `dist` files with Subresource Integrity.
- **Self-hosted:** upload or serve the matching `dist/navbar-light.min.css` and `dist/navbar-light.min.js`, then change only the two URLs in the CDN-shaped Embed. Keep the version markers, load/error state and diagnostic handlers; generate new integrity values whenever the bytes or origin change.

Never leave two delivery Embeds active. After switching, publish and verify `data-mwp-ready="true"`, the hidden runtime settings block, the expected asset requests and native open/close fallback. In a shared Library installation, make the Embed change in a versioned source component and apply the Library update; the future Designer Extension will automate this safely.

Navbar Light is released under the [MIT License](LICENSE), copyright © 2026 madewithpixels. The repository remains `private: true` as an npm package; npm distribution can be reconsidered after package naming and ownership are settled.

The `Navbar Light CDN` Webflow component contains this generated loader and is isolated on `/navbar-light-cdn` for testing. The original `Navbar Light` component and `/navbar-light` acceptance page retain the self-contained Embed.

The browser verification matrix covers all 35 layout/motion combinations, all five collapse choices at the four core Webflow widths, all three dropdown alignments and every centered motion preset. The published `v0.2.0` acceptance build has also been verified at Desktop and Tablet in both delivery modes: nine icon links and their destinations render, all Images load, submenu arrows rotate using the bound duration, nested and outer Escape restore focus, configuration hides only after initialization, and neither page produces horizontal overflow.

The dedicated `Smashburger` clean-install site has now passed the POC release check at 1280px, 984px, 767px and 393px. The Library-installed Tablet variant expands on Desktop, collapses below 991px, keeps zero horizontal overflow, loads all nine remapped icons, initializes both pinned CDN assets with their exact SRI metadata and hides the settings inspector only after `data-mwp-ready="true"`. A cache-bypassed download confirmed that both jsDelivr files are byte-identical to the committed release. Nested and outer Escape restore focus in two stages; closed panels use matching `aria-hidden` and `inert` state. The automated suite also exercises reduced-motion timing and CDN error diagnostics while confirming native fallback content remains present. The first linked-Library upgrade to `v0.2.1` was then accepted and published without unlinking; Tablet Preview reconfirmed contained panel geometry, ARIA/inert state, Escape close and trigger focus return. See [webflow/smashburger-poc-acceptance.md](webflow/smashburger-poc-acceptance.md).

The published Tablet variant has passed a genuine macOS VoiceOver keyboard-and-spoken-output check. VoiceOver announced the navigation trigger as collapsed and expanded, skipped the closed nested submenu, announced `Company` and `Team` only after `More` opened, returned focus to collapsed `More` on the first Escape, and returned focus to the collapsed navigation trigger on the second Escape. Windows NVDA verification remains outstanding.

## Repository map

```text
.
├── README.md
├── todo.md
├── dist
│   ├── navbar-light.css
│   ├── navbar-light.js
│   └── minified files and source maps
├── demo/index.html
├── demo/navbar-light.browser.js
├── examples
│   ├── gsap.js
│   └── webflow-interactions.md
├── scripts/build-webflow-embed.mjs
├── scripts/build-dist.mjs
├── scripts/build-cdn-loader.mjs
├── src
│   ├── navbar-light.css
│   └── navbar-light.js
├── tests/navbar-light.test.js
└── webflow
    ├── component-map.md
    ├── copy-paste-test.md
    ├── migration-guide.md
    ├── navbar-light-cdn-loader.html
    └── navbar-light-embed.html
```

## Webflow testing safety

Before structural changes, create a Webflow backup. The obsolete `CSS Navbar — Details` test component has been removed; `Navbar Light` remains the sole acceptance component on its page, while the optional CDN edition is isolated on a separate page. Publishing remains a deliberate user-controlled release step.

When testing an unlinked Library instance, do not use MCP name-only style replacement if imported and local selectors share the same Designer name. The current element-style action cannot distinguish those records by style ID or Library scope. Use the verified Designer cleanup workflow from [webflow/migration-guide.md](webflow/migration-guide.md), and confirm the actual element classes after every batch.

See [todo.md](todo.md) for the migration-hardening and public-clonable roadmap, the future explicit version-upgrade/rollback exercise and the remaining Windows NVDA verification.
