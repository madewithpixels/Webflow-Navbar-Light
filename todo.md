# Navbar Light roadmap

This checklist is the implementation plan and ongoing status record for Navbar Light. Keep it current as work progresses; completed work must be checked only after local and Webflow verification.

## Project constraints

- [ ] Build the visible component from native Webflow elements.
- [ ] Keep all editable content and styling visible on the Webflow Canvas.
- [ ] Prefer Webflow classes, variants and component properties over custom code.
- [ ] Use no pseudo-elements.
- [ ] Keep CSS as the functional baseline; JavaScript is progressive enhancement only.
- [ ] Keep the component usable if JavaScript fails or is removed.
- [ ] Allow Webflow Interactions and GSAP to replace the built-in animation.
- [ ] Do not refresh the Webflow `Navbar Light` test page without the user's explicit approval and backup confirmation.
- [ ] Keep this roadmap and `README.md` aligned with the implementation.

## 1. Foundation and shared content

- [ ] Refactor desktop and collapsed navigation to use one shared set of navigation links.
- [ ] Keep the shared navigation statically visible on wide screens.
- [ ] Convert the same navigation into the collapsible panel at the selected breakpoint.
- [ ] Preserve Webflow's current-page class and styling.
- [ ] Give every structural element a clear Navigator display name.
- [ ] Keep the panel open and fully styleable in Designer while runtime Preview starts closed.
- [ ] Add a documented style-guide configuration that exposes every editable region.

## 2. Trigger and accessibility

- [ ] Use a native summary trigger with a full-size interactive hit area.
- [ ] Build the burger from editable native divs.
- [ ] Support two-bar and three-bar icon configurations.
- [ ] Add an optional visible Menu label.
- [ ] Animate the burger into a close icon with transforms only.
- [ ] Synchronise `open`, `data-state`, `aria-expanded` and panel inertness.
- [ ] Close on Escape and return focus to the trigger.
- [ ] Optionally focus the first navigation link when opened.
- [ ] Optionally close on outside click.
- [ ] Optionally close after a navigation link is selected.
- [ ] Optionally lock body scrolling for drawer and overlay layouts.
- [ ] Restore body scrolling reliably on close, resize and teardown.
- [ ] Respect `prefers-reduced-motion`.

## 3. Responsive behaviour

- [ ] Keep collapse breakpoint configurable through Webflow component variants.
- [ ] Support Never, Tablet, Mobile landscape, Mobile portrait and Always.
- [ ] Confirm each choice at every Webflow breakpoint.
- [ ] Reset an open collapsed menu safely when crossing into the expanded layout.

## 4. Layout variants

- [ ] Dropdown panel.
- [ ] Full-width panel below the header.
- [ ] Left drawer.
- [ ] Right drawer.
- [ ] Full-screen overlay.
- [ ] Left, centre and right panel alignment where applicable.
- [ ] Configurable panel width using a Webflow component property/CSS variable.
- [ ] Optional native backdrop element, editable on Canvas.
- [ ] Configurable panel padding, gap, border, radius and shadow through Webflow styles.

## 5. Navigation content

- [ ] Add a native nested-details submenu pattern.
- [ ] Support keyboard access and independent submenu state.
- [ ] Add an optional CTA region.
- [ ] Add optional secondary/social navigation regions.
- [ ] Evaluate a native Component Slot for arbitrary panel content without hiding it from Canvas.
- [ ] Document safe duplication and editing of links and submenus.

## 6. Built-in motion

- [ ] Dropdown.
- [ ] Slide left.
- [ ] Slide right.
- [ ] Slide up.
- [ ] Fade.
- [ ] No motion.
- [ ] Custom/externally controlled motion.
- [ ] Expose duration, distance and easing.
- [ ] Add separate opening and closing durations.
- [ ] Add optional backdrop fade.
- [ ] Add optional navigation-item stagger.
- [ ] Add configurable burger-to-close duration.
- [ ] Ensure visibility changes do not truncate closing transitions.

## 7. Webflow Interactions and GSAP integration

- [ ] Provide stable `data-*` hooks for root, trigger, panel, backdrop and items.
- [ ] Emit documented open, opened, close and closed events.
- [ ] Expose documented `open()`, `close()` and `toggle()` controls.
- [ ] Make Custom mode remove built-in transforms and transitions completely.
- [ ] Keep state, accessibility and lifecycle events working in Custom mode.
- [ ] Supply Webflow Interactions and GSAP integration examples.

## 8. Component properties

- [ ] Collapse breakpoint variant.
- [ ] Layout class.
- [ ] Motion class.
- [ ] Duration, opening duration and closing duration.
- [ ] Distance and easing.
- [ ] Panel width and alignment.
- [ ] Menu label visibility/content.
- [ ] Focus-first-link toggle.
- [ ] Outside-click toggle.
- [ ] Link-click close toggle.
- [ ] Scroll-lock toggle.
- [ ] Item-stagger value.
- [ ] Designer-open guidance and property tooltips.

## 9. Repository deliverables

- [ ] Maintain a standalone CSS file matching the Webflow embed CSS.
- [ ] Maintain a standalone progressive-enhancement JavaScript file matching the Webflow embed script.
- [ ] Maintain an accessible native HTML reference implementation.
- [ ] Add a local test/demo page covering all layout and motion combinations.
- [ ] Add automated DOM/state tests for open, close, focus and scroll behaviour.
- [ ] Document Webflow structure, classes, properties, variants and integration hooks.

## 10. Verification

- [ ] Verify the complete component without JavaScript.
- [ ] Verify keyboard-only operation.
- [ ] Verify screen-reader state and focus management.
- [ ] Verify reduced motion.
- [ ] Verify every Webflow breakpoint and collapse variant.
- [ ] Verify every layout and motion preset.
- [ ] Verify outside-click, link-close and scroll-lock options.
- [ ] Verify nested submenus.
- [ ] Verify Custom mode with Webflow Interactions.
- [ ] Verify Custom mode with GSAP.
- [ ] Verify editable content remains visible in Webflow Designer.
- [ ] Verify Preview and staging behaviour without refreshing `Navbar Light`.
- [ ] Restore the test instance to documented defaults.
- [ ] Confirm no publish action was taken unless explicitly requested.

