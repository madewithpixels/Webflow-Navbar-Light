# Replacing an existing Webflow Navbar with SmashBurger

This guide covers the reusable lessons from replacing an already styled and rearranged native Webflow Navbar. The current released baseline is `v0.2.6` (see [release verification](v0.2.6-release-verification.md)). Project-specific navigation content, destinations and visual design deliberately remain outside this guide.

## Recommended workflow

1. Create a Webflow backup.
2. Keep the old Navbar temporarily as a visual and class reference, but do not leave two active navigation landmarks in the published page.
3. Insert `SmashBurger` or `SmashBurger CDN` from the shared Library.
4. Configure collapse, layout, motion and optional regions while the instance is still linked.
5. Verify the unstyled component in Preview: open, close, Escape, focus return and the required breakpoints.
6. Unlink the configured instance when the destination project needs structural or visual changes beyond the Library properties.
7. Confirm that the root retains `[data-mwp-navbar]` and the intended collapse value. For an always-collapsed local version, explicitly retain `data-collapse="always"`.
8. Keep the active enhancement or pinned CDN Embed. Do not leave both delivery modes active.
9. Transfer presentation classes to the existing native elements rather than replacing their semantics.
10. Add project-specific utility links as ordinary native Link Blocks.
11. Complete the CSS work and full behavior check before creating a destination-project component.
12. Remove the old reference Navbar before publishing.

## Show the unlinked panel for Canvas styling

After unlinking, the component's `Canvas: show open menu` property is no longer a reliable place to find the control. Use the native root element instead:

1. In the Navigator, select the outer `header.mwp-css-nav` with `data-mwp-navbar`. Do not select the `details` trigger or the `nav` panel.
2. Set the root's custom attribute **`data-collapse`** to the mode that was selected when you unlinked: `never`, `tablet`, `mobile-landscape`, `mobile-portrait` or `always`. A fresh Tablet unlink on 2026-10-08 removed the linked Webflow variant marker, so the Canvas helper could not infer its breakpoint until this static attribute was added. The runtime also reads this value. On a v0.2.6 unlink, changing this attribute alone does not replace the variant's Webflow layout classes; keep it aligned with the actual native layout.
3. Set **`data-canvas-open` to a static `true`** on the same root. A fresh Tablet unlink left this attribute as a legacy component-property binding that resolved to `null`. In the purple value dropdown, choose **Disconnect**, then enter `true` as the ordinary value; do not add a second attribute with the same name. The existing `SmashBurger Canvas helper` Embed then shows the collapsed panel on the Designer Canvas at the selected collapse breakpoint. Its links remain native, selectable elements for styling.
4. Set **`data-canvas-open` to `false`**, or remove the attribute, when finished. The collapsed Canvas view returns to Brand and trigger. Keep the helper Embed in the unlinked subtree.
5. Check Designer Preview at Desktop, Tablet and Mobile after a refresh. The helper is scoped to `html.wf-design-mode`, so the custom attribute should not force a runtime-open menu. Open and close the actual menu in Preview to verify it.

This is a **Canvas styling view**, not the menu's interactive `open` state. Do not force `open` on the native `details`, change `aria-expanded` or set `data-state` to style the panel. Those are runtime/accessibility state. The root attribute is a local, editable control that remains available after Library properties disappear; the current release does not recreate it as a grouped local component property.

Changing the collapse mechanism in the shared Library is still a [separate candidate](unlink-hardening-candidate.md) requiring a fresh unlink and no-JavaScript check.

If you turn an unlinked copy into a **site-local component**, check inherited Library bindings before using it as a new source. In the `Unlink test` trial, a later unlink converted a legacy-bound MENU label and 14 runtime settings values into Webflow placeholder text. Disconnect or replace those bindings with the intended static text (or deliberate new local props), then unlink a fresh duplicate to verify every value. Also preserve the root's `data-backdrop="true"` and `data-presets="true"` defaults: a blank `data-backdrop` removed the dropdown backdrop in Preview until the local component definition was corrected. The [trial record](unlink-hardening-candidate.md) lists the verified values and checks. Do not remove the native settings subtree simply to hide it; the runtime reads those values.

## Current structural contract

The current release expects this functional relationship:

```text
Navbar root
└─ Navbar inner
   ├─ Menu details
   │  └─ Menu trigger
   └─ Navigation panel
```

In v0.2.6, the enhanced open-state CSS also responds to the panel's own runtime `data-state`, so one ordinary wrapper around `Menu details` can work after enhancement. Keep `Menu details` and `Navigation panel` adjacent direct children of `Navbar inner` for the CSS/native Details fallback without JavaScript.

Keep the functional siblings intact and use Flex or Grid order, margins, gaps, alignment and positioning to achieve the required visual grouping. A published wrapped-trigger fixture verified the enhanced state rule; the adjacent-sibling structure remains the no-script baseline.

## Webflow-native restrictions

Webflow's native Menu Button belongs to its native Navbar and cannot be pasted freely into unrelated structure. SmashBurger does not need it: its trigger is a native `<summary>` with `[data-mwp-trigger]`.

To reuse an existing visual treatment:

- Apply ordinary project classes to the SmashBurger `Menu trigger`.
- Keep the `<summary>` element and its data hook.
- Recreate layout wrappers as ordinary Div Blocks.
- Copy ordinary Link Blocks and icon assets separately.
- Do not add Webflow's `w-nav-button` class or replace the trigger with a native Navbar Menu Button.

Unlinking a configured Library instance can create a long sequence of variant-derived combo classes such as `.always`, `.always-1`, `.always-2` and later numbered names. These are generated by Webflow from the selected component variant, not required naming conventions from the SmashBurger runtime. Some can still carry important authoring layout, breakpoint or component-property visibility rules. Treat them as static output from the chosen configuration and verify each contribution before renaming or removing it; do not bulk-delete the sequence during the initial restyle.

The first real-site audit found 35 materialized `Always` selectors across 102 individual element attachments. Thirty selectors and 97 attachments were declaration-free; five carried rules for the root, inner, menu, trigger or panel. On that instance, all 97 empty attachments were removed and the five functional declarations were transferred to the corresponding local base selectors, leaving no `Always` classes in the navigation subtree. Desktop and 393px Preview checks then passed pointer and keyboard activation, Escape focus return, ARIA/inert and backdrop state, panel containment and zero horizontal overflow. Those figures remain a useful fixture, not yet a guarantee for every configuration or Webflow release. The component-hardening roadmap includes repeating the audit on a fresh instance and fixing the source variants so future users do not need to repeat the cleanup. The planned clonable will start from a deliberately named local component rather than exposing this unlink-generated class trail to new users.

A 2026-10-08 read of both source components found real variant declarations on the inner, native menu and panel at collapse breakpoints, while the sampled `.mwp-css-nav_links` variant styles had no declarations. This confirms that a blanket variant-style removal would discard authoring layout. It does **not** establish that removing empty overrides, or replacing variants with a collapse property, prevents Webflow from generating numbered combo classes. See [the reversible candidate and fresh-unlink checklist](unlink-hardening-candidate.md).

The site-local one-Base-variant property candidate produced zero numbered selectors on five fresh unlinks, one selected to each collapse choice, in `Unlink test`. Fixture CSS supplies the authoring layout those variants formerly carried; linked and unlinked trial copies passed normal Preview and native Details checks. This is evidence for that local candidate, not a change to v0.2.6 or a guarantee for a future Library import.

There is also a tooling trap after unlinking: the imported namespaced Library selector and its new local counterpart can retain the same display name. The current MCP element-style action accepts names rather than style IDs and can therefore assign the imported selector when the local one was intended. Do not use name-only automated style replacement for this cleanup. Work from a backup, remove only verified empty combo tokens through the Designer, and recheck the resulting element classes and computed layout before continuing.

The Library currently shares `All Links` and `Body (All Pages)` tag styles alongside the component. The native Brand and navigation classes intentionally inherit typography and link presentation, so those tags can affect the appearance of a new destination site. Active consumers reported no visual regression at v0.2.6; preserve the tag styles during this hardening work and compare their cascade in any new clean-install fixture. Webflow's Asset settings only manages asset folders and cannot exclude tag styles.

When a functional combo must be consolidated locally, remove that combo from the element before editing the base selector. Webflow's Style panel continues writing to the final combo while it remains attached even if the base token appears active. Temporarily remove later semantic project classes where necessary, edit and verify the unambiguous base, then restore only deliberately named classes such as the destination project's trigger or authoring helper class.

The MWP Component Library source components (CDN and self-contained) have a default-on `Content / Show brand` Switch bound to the native Brand link's visibility. Designer readback in each edition showed `display: none` and a zero-size box when hidden, then restored the visible default. The two-component Library update was shared and accepted on SB Test Four: the linked self-contained instance exposed the new control and hid the Brand link from the Canvas accessibility tree when disabled. On a temporary published hidden-state test, Brand was absent from the DOM and the first Tab focused Facebook. The default was restored and republished; Brand returned as the first anchor and first Tab stop. The visible-default instance also passed a published mobile menu check at 600px with zero horizontal overflow. After unlinking, the Brand can still be deleted or hidden with ordinary Webflow controls without affecting the enhancement.

Older Library copies used `background-color: inherit` on the navigation panel and submenu list. The current source Library gives the expanded panel an explicit transparent background and the submenu a white surface with dark ink; see [the background audit](background-audit.md). Both are ordinary Webflow class values for a destination to override. On a dark destination wrapper, choose a light main-navigation ink as part of the site's styling; the submenu retains its own contrast.

Older Library copies carry a component-level `max-width: 80rem` on the navigation inner. That presentation choice can obstruct an existing project's container system. On 2026-10-01 the base `mwp-css-nav_inner` class in MWP Component Library was cleared; Designer readback shows `Max W: None` in both delivery editions. The CDN edition passed 1920px and Tablet Preview checks, and both editions passed wide and Tablet checks on the published Library staging site. The revised Library was shared and accepted on SB Test Four; its fresh linked self-contained instance filled a 1734px Preview canvas and worked at 600px in Preview and published staging. A second check wrapped that linked instance in a destination-owned 70rem container, then passed wide, Tablet and mobile Preview and published staging checks. See [the repeatable width fixture](width-regression-fixture.md) for measurements. For an older unlinked integration, remove or override the maximum on the local inner and apply any width constraint through a destination-project container class.

To constrain a destination header, give its own wrapper a project class such as `site-header_container`. Set that class to the project's chosen `max-width` and horizontal `margin: auto`; add the desired inline padding there. Keep `mwp-css-nav_inner` unrestricted. This preserves the full-width default for a fresh install while letting each site choose its own content width. Verify the resulting header at the widest project breakpoint and at Tablet, then open the menu to check that its panel placement still follows the selected layout.

## Panel placement and CSS priority

The legacy `v0.2.0` functional stylesheet supplies a right-aligned dropdown fallback with `position: absolute`, `right: 0`, `top: 100%`, `transform-origin: top right` and `width: var(--mwp-nav-panel-width)`. Its selector has the same specificity as one ordinary Webflow class, then wins because the CDN stylesheet loads later. These defaults are useful for an untouched component but should not dictate the geometry of a locally styled panel.

For a `v0.2.0` integration, add one deliberately named combo class to `mwp-css-nav_panel` and set the intended geometry there. For example, a full-width panel can set `left: 0`, `right: auto` and `width: 100%`. The two-class Webflow selector outranks the released fallback without custom code or `!important`.

`v0.2.1` separates state from presentation. Closed/open opacity, visibility, pointer handling and transitions remain functional rules, while panel display, positioning, insets, alignment, width and transform-origin are zero-specificity fallbacks. A normal Webflow panel class can therefore replace the default geometry even though the delivery stylesheet loads later. The immutable `v0.2.0` file remains available for rollback, but existing component Embeds must explicitly select `v0.2.1` to receive the correction.

## Stacking before clipping

An open navigation panel can appear clipped when sticky or positioned page content is actually painting above it. Inspect stacking before changing overflow, masks or containment.

The v0.2.3 delivery stylesheet positions the root and gives it a default z-index of `100` through `--mwp-nav-z-index`. Set that property directly on the navbar root to override the released default. The next source release also accepts a value inherited from a project wrapper, with `100` as its fallback. Check the actual stacking context in Preview before raising the value: a positioned ancestor can still keep the whole navigation below other page content.

## Backdrop behavior

In the current v0.2.3 release, the optional Backdrop is activated by the built-in Left drawer, Right drawer and Overlay layouts. It dims the page, sits behind the panel and closes the menu when selected. The next source candidate supports opt-in Dropdown and Full-width backdrops through `data-backdrop="True"` or `"true"`; enabling either does not implicitly lock page scroll. Both MWP Component Library source editions now bind `Show backdrop` to the native Backdrop visibility and this root attribute, but their Embeds still use v0.2.3 until the candidate is released. See [the published enhanced fixture](enhanced-layout-regression.md).

The Backdrop should remain a sibling within the SmashBurger root and retain `[data-mwp-backdrop]` plus `aria-hidden="true"`. Keep it non-blocking while closed. After unlinking, it can be removed when the destination project will never use it.

## Designer, Preview and delivery

The settings inspector and Embed remain visible on the Designer Canvas. The enhancement hides the settings inspector only after initialization in Preview or published output. A more compact authoring-infrastructure treatment is planned so the settings Div and Embed can remain selectable without occupying normal page layout while the navigation is styled.

Custom Navigator display names can make a polished component demo easier to scan, but they hide the class selectors authors need while adapting a real navigation. Future Webflow releases and the public clonable will therefore leave structural elements on Webflow's class-based Navigator labels. Their planned `sb-*` class names must be descriptive enough to serve as both the styling API and the useful Navigator label.

Use exactly one delivery mode:

- Self-contained Embed.
- Exact-version pinned CDN loader with matching integrity metadata.
- Self-hosted files generated from the same release.

Do not use a floating CDN tag or replace only one of the matching CSS/JavaScript files.

## Accessibility checks after adaptation

- The menu trigger retains an accessible name.
- `aria-expanded` changes when the menu opens and closes.
- The closed panel is `aria-hidden` and inert after enhancement.
- Escape closes the menu and returns focus to the trigger.
- Icon-only links have specific `aria-label` values.
- Decorative icons are hidden from assistive technology where appropriate.
- Every Link Block has a valid destination and keyboard-visible focus state.
- Only one navigation/header landmark remains in the published page.
- Desktop, Tablet, Mobile landscape and Mobile portrait are checked independently.

## Before creating the local component

Finish functional structure, CSS, destinations, accessible names and breakpoint testing first. Then create the destination-project component and roll it out to additional pages. Library updates do not automatically update an unlinked or newly local component, so future SmashBurger releases must be reviewed and deliberately backported where relevant.

## Planned public clonable

A free Webflow clonable, provisionally named `SmashBurger Lite`, is on the roadmap as an early public introduction to SmashBurger. It will avoid making new users repeat the Library-to-unlinked migration and will include a preconfigured editable local component, a plain baseline, a styled example, the pinned delivery Embed, a short safe-editing guide and a clone/install verification pass. Its structural `sb-*` classes will remain visible directly in the Navigator rather than being masked by custom display names. A dedicated workbench will keep prepared closed/open examples and a backdrop reference away from real page layouts, allowing shared Webflow classes to be styled without leaving production instances obstructing the Canvas.
