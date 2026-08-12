# Navbar Light roadmap

This checklist is the implementation plan and status record. Completed work is checked only after source or Webflow verification.

## Project constraints

- [x] Build visible structure from native Webflow elements.
- [x] Keep editable content, settings and the embed visible on the Webflow Canvas.
- [x] Prefer Webflow classes, variants and properties over custom code.
- [x] Use no pseudo-elements.
- [x] Keep CSS/native details as the functional baseline.
- [x] Use JavaScript only for progressive behavior and accessibility enhancement.
- [x] Allow Webflow Interactions and GSAP to replace built-in panel animation.
- [x] Do not refresh the Webflow `Navbar Light` test page without explicit approval and a confirmed backup.
- [x] Keep this roadmap and `README.md` aligned with implementation.

## 1. Foundation and shared content

- [x] Use one shared set of navigation links for desktop and collapsed layouts.
- [x] Keep the shared panel statically visible on expanded breakpoints.
- [x] Convert the same panel to collapsed behavior at the selected breakpoint.
- [x] Preserve Webflow's automatic current-page class behavior.
- [x] Give structural elements clear Navigator display names.
- [x] Keep panel content and configuration visible in Designer while Preview starts closed.
- [x] Keep the CSS/enhancement Embed visible in Designer.

## 2. Trigger and accessibility

- [x] Use native details/summary with a full-size interactive hit area.
- [x] Build the burger from editable native Divs.
- [x] Support two-bar and three-bar icon configurations.
- [x] Add an optional visible Menu label.
- [x] Transform the burger into a close icon without pseudo-elements.
- [x] Synchronize native open state, lifecycle state, ARIA and panel inertness.
- [x] Close on Escape and return focus to the trigger.
- [x] Add optional first-link focus, outside close and link close.
- [x] Add automatic/optional body scroll locking and reliable restoration.
- [x] Respect `prefers-reduced-motion`.

## 3. Responsive behavior

- [x] Configure collapse through native Webflow component variants.
- [x] Support Never, Tablet, Mobile landscape, Mobile portrait and Always.
- [x] Use Webflow's emitted variant marker for CSS-only behavior.
- [x] Reset native open state safely when crossing between collapsed and expanded layouts.
- [ ] Complete a visual pass of all five variants at all four core Webflow breakpoints.

## 4. Layouts and content

- [x] Dropdown, full-width, left drawer, right drawer and overlay layouts.
- [x] Left, center and right dropdown alignment.
- [x] Configurable panel width.
- [x] Native editable backdrop.
- [x] Panel padding, gap, border, radius and shadow remain normal Webflow class styles.
- [x] Native nested-details submenu with independent Escape handling.
- [x] Optional CTA and secondary/social regions.
- [x] Evaluate a Component Slot. Decision: do not add one because slots accept component instances rather than arbitrary native link elements.
- [x] Document safe link and submenu editing.

## 5. Built-in motion

- [x] Dropdown, slide left, slide right, slide up, fade, none and custom presets.
- [x] Expose opening/closing duration, distance and easing.
- [x] Add backdrop fade, item stagger and icon duration.
- [x] Preserve closing transitions before final closed state.
- [x] Fix Custom/Fade specificity so external animation can fully replace drawer transforms.

## 6. Webflow Interactions and GSAP

- [x] Provide stable hooks for root, trigger, panel, backdrop and items.
- [x] Emit open, opened, close and closed events.
- [x] Expose open, close, toggle and destroy controls.
- [x] Keep state and accessibility working in Custom mode.
- [x] Document the Webflow Interactions two-click setup and its custom-event limitation.
- [x] Supply an event-driven GSAP example.

## 7. Component properties

- [x] Collapse breakpoint variant.
- [x] Layout, alignment and width.
- [x] Motion, opening/closing duration, distance, easing and stagger.
- [x] Menu label content/visibility and two/three icon bars.
- [x] CTA, secondary region and backdrop visibility.
- [x] Focus, outside close, link close and scroll-lock behavior.
- [x] Add clear property groups and tooltips.
- [x] Keep non-attribute-bindable values visible through native Text Blocks.

## 8. Repository deliverables

- [x] Maintain standalone CSS and progressive JavaScript sources.
- [x] Generate the Webflow embed from those sources.
- [x] Maintain an accessible native HTML reference implementation.
- [x] Add an interactive demo covering all layout/motion selections.
- [x] Add automated state, focus, outside/link close, backdrop and scroll-lock tests.
- [x] Document structure, classes, properties, variants, hooks and integration patterns.

## 9. Verification

- [x] Verify the CSS-only Tablet fallback in Webflow Preview.
- [x] Verify keyboard open, Escape close and focus return.
- [x] Verify ARIA state and inertness programmatically.
- [x] Verify drawer/fade, two-line icon, stagger, first-link focus, backdrop and scroll lock in Webflow Preview.
- [x] Verify nested submenu Escape behavior.
- [x] Verify Custom mode removes built-in transform and transition while state continues.
- [x] Verify editable configuration and Embed remain visible in Designer.
- [x] Restore the test instance to Tablet + Dropdown documented defaults.
- [x] Confirm no refresh or publish action was taken during this milestone.
- [ ] Run the final local automated suite after repository synchronization.
- [ ] Complete manual screen-reader testing with VoiceOver/NVDA.
- [ ] Complete the full visual matrix pass for every layout and motion preset.
- [ ] Obtain user approval before removing the preserved original test instance.
