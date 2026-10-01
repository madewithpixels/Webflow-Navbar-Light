# Portable background audit

On 1 October 2026, the published linked self-contained SmashBurger instance on [SB Test Four](https://sb-test-four.webflow.io/) exposed these Webflow class rules through the page CSSOM. The same two declarations were read back from the source MWP Component Library Designer's page CSSOM on the CDN test page:

| Class | Background declaration | Consequence |
| --- | --- | --- |
| `mwp-css-nav_panel` | `background-color: inherit` | The expanded panel takes the computed background of its parent rather than having its own surface. |
| `mwp-css-nav_submenu-list` | `background-color: inherit` | The submenu takes the panel's computed background; it may be transparent above unrelated page content. |

The linked Library prefixes both class names with `mwp-component-library--` on the consumer site. The source site uses the shared unprefixed classes, so the CDN and self-contained component editions inherit these same class declarations. The burger and submenu-chevron line classes use `background-color: currentColor`; that is intentional because those marks should follow their text colour. The linked instance's other observed component classes had no background declaration. Brand and link `color: inherit` declarations are intentional text inheritance, not background coupling.

The functional CSS gives a **collapsed** panel an explicit `--mwp-nav-panel-surface` value with a white fallback, and gives the collapsed overlay a separate dark surface. It does not replace the expanded panel's inherited Webflow background or the submenu's inherited background. The CSSOM inspection establishes the declarations; it does not yet prove their visual effect on light, dark and transparent destination wrappers.

For the source Library fix, replace the two inherited **background** declarations with explicit, component-scoped defaults that can be overridden through ordinary Webflow class styling and, later, Control Workbench colour or variable choices. Keep the `currentColor` icon marks and intentional text inheritance. Check both delivery editions in Designer, then verify expanded and collapsed states on light, dark and transparent wrappers before sharing the Library update. Do not substitute MWP Component Library demo-theme variables as defaults.
