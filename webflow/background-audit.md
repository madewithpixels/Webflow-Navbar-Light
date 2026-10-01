# Portable background audit

On 1 October 2026, the published linked self-contained SmashBurger instance on [SB Test Four](https://sb-test-four.webflow.io/) exposed these Webflow class rules through the page CSSOM. The same two declarations were read back from the source MWP Component Library Designer's page CSSOM on the CDN test page:

| Class | Background declaration | Consequence |
| --- | --- | --- |
| `mwp-css-nav_panel` | `background-color: inherit` | The expanded panel takes the computed background of its parent rather than having its own surface. |
| `mwp-css-nav_submenu-list` | `background-color: inherit` | The submenu takes the panel's computed background; it may be transparent above unrelated page content. |

The linked Library prefixes both class names with `mwp-component-library--` on the consumer site. The source site uses the shared unprefixed classes, so the CDN and self-contained component editions inherit these same class declarations. The burger and submenu-chevron line classes use `background-color: currentColor`; that is intentional because those marks should follow their text colour. The linked instance's other observed component classes had no background declaration. Brand and link `color: inherit` declarations are intentional text inheritance, not background coupling.

The functional CSS gives a **collapsed** panel an explicit `--mwp-nav-panel-surface` value with a white fallback, and gives the collapsed overlay a separate dark surface. It did not replace the expanded panel's inherited Webflow background or the submenu's inherited background.

## Source correction and acceptance

On 1 October 2026, the shared source classes were changed on the **base** component variant:

- `mwp-css-nav_panel`: `background-color: transparent`.
- `mwp-css-nav_submenu-list`: `background-color: #ffffff` and `color: #1d2022`.

The changes are ordinary Webflow class values, so a destination can replace them in Designer. No MWP demo-theme variable was used. The intentional `currentColor` icon marks and other text inheritance were retained. An initial Tablet-only edit was undone; final source CSSOM readback contained only the two base selectors above, with no variant background override.

Both self-contained and CDN source editions passed published staging checks at desktop and 667px. Their submenu opened with white background, dark links and no horizontal overflow; the collapsed panel remained white and readable. The Library share contained only the two SmashBurger editions. SB Test Four accepted it, retained a linked namespaced component and passed a published desktop plus 600px open-menu check.

On the SB Test Four destination wrapper, Designer Preview showed the submenu stayed white with dark ink against light (`#f4f4f1`) and dark (`#17231d`) wrapper surfaces; the wrapper was restored to transparent afterward. The published transparent-wrapper fixture also passed. The expanded panel remains transparent in each case. With a dark wrapper, the **main navigation ink** remained dark because that separate colour has not been configured for a dark site. A dark-site install must choose its nav ink in Designer or the planned Control Workbench. This audit verifies surface independence, not automatic contrast selection for arbitrary host themes.
