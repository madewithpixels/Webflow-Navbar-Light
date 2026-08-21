# SmashBurger roadmap

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

## Current handoff — 21 August 2026

- [x] Complete a real replacement trial on the in-progress madewithpixels Home page using an installed `SmashBurger CDN` instance, configured to Always collapse and then unlinked for local editing.
- [x] Confirm the unlinked trigger opens and closes, Escape restores focus, utility Link Blocks can be recreated with native Div wrappers, and existing project button classes can style the native SmashBurger summary.
- [x] Identify two migration hazards: page content can paint over a panel when the root has no deliberate z-index, and moving `Menu details` away from its adjacent `Navigation panel` breaks the current CSS presentation even though enhanced ARIA, inertness and runtime state still update.
- [x] Restore the required direct-sibling structure and leave the replacement functionally working. The Brand has been removed locally; project CSS, local component creation and rollout to further pages remain for a later session.
- [x] Park the old Header component in a `display:none` reference wrapper temporarily. Remove it before publication and ensure temporary shared-class changes are reverted.
- [x] Leave the source Library components, repository runtime and released CDN files unchanged during this trial.
- [x] Audit the unlinked Always variant output on the madewithpixels instance: 35 generated selectors across 102 element attachments, comprising 97 declaration-free attachments and five functional root/inner/menu/trigger/panel attachments.
- [x] Remove all 97 declaration-free attachments through the Designer, move the five required declarations onto the local base classes, and verify that the complete 111-node navigation subtree contains no `Always` classes.
- [x] Remove the local inner's fixed `80rem` maximum, retain the Always layout with `max-width: none`, and consolidate root stacking, wrapping, menu visibility, trigger border reset and panel grid/flex sizing onto stable local selectors.
- [x] Verify the cleaned local instance in Webflow Preview at Desktop and 393px: pointer and keyboard open, Escape focus return, ARIA/inert and backdrop state, panel containment and zero horizontal overflow.
- [x] Inspect the published madewithpixels staging cascade and confirm that the pinned `v0.2.0` collapsed-panel selector forces the 24rem right-aligned fallback because `[data-mwp-panel]` sits outside `:where(...)`, ties a normal Webflow class and loads later.
- [x] Refactor the maintained next-release CSS source so panel display, position, insets, alignment, width and transform-origin are zero-specificity fallbacks, while open/closed opacity, visibility, pointer handling and transitions remain protected functional state.
- [x] Add a source regression test that rejects higher-specificity panel geometry and actual `!important` declarations; verify the candidate in a real browser with a full-width destination rule, pointer opening, Escape focus return and synchronized ARIA/inert state.
- [x] Leave the madewithpixels project, MWP Component Library, generated `dist` files, CDN loader and immutable `v0.2.0` assets unchanged. Ship the source correction only through a new semantic release, then deliberately backport it to the local madewithpixels component.

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
- [ ] Refactor the open icon geometry so the first and final native line Divs converge on exactly the same centre instead of relying on one fixed `--mwp-nav-icon-shift`; keep the X symmetrical when destination projects change line thickness, gap or icon scale.
- [ ] Add visual regression checks for the open two-line and three-line icons at common device-pixel ratios, including odd/even line thicknesses and project-overridden spacing.
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
- [x] Complete a visual pass of all five native Webflow variants at all four core Webflow breakpoints (20/20 live Canvas cases).
- [x] Verify all five collapse modes across the four core widths in the local reference matrix (20/20 functional state cases).

## 4. Layouts and content

- [x] Dropdown, full-width, left drawer, right drawer and overlay layouts.
- [x] Left, center and right dropdown alignment.
- [x] Configurable panel width.
- [x] Native editable backdrop.
- [ ] When `Show backdrop` is enabled, support it consistently in every collapsed layout, including Dropdown and Full width as well as Left drawer, Right drawer and Overlay; do not make a dropdown backdrop imply page scroll locking.
- [x] Panel padding, gap, border, radius and shadow remain normal Webflow class styles.
- [x] Native nested-details submenu with independent Escape handling.
- [x] Optional CTA and secondary/social regions.
- [x] Add a native Div chevron to each included submenu with optional visibility and configurable duration, easing and rotation.
- [x] Add optional native Facebook, Instagram, LinkedIn, TikTok, Threads, X, WhatsApp, Telephone and Email Link Blocks with destination props, replaceable icon-image props and visibility toggles.
- [x] Restructure the panel into Secondary navigation then Primary navigation; nest Social and Contact wrappers inside Secondary, and Navigation links plus a final CTA inside Primary.
- [x] Add independent Show primary navigation, Show CTA, Show secondary navigation, Show socials, Show social labels, Show contact links and Show contact labels properties to both delivery editions.
- [x] Evaluate a Component Slot. Decision: do not add one because slots accept component instances rather than arbitrary native link elements.
- [x] Document safe link and submenu editing.

## 5. Built-in motion

- [x] Dropdown, slide left, slide right, slide up, fade, none and custom presets.
- [x] Expose opening/closing duration, distance and easing.
- [x] Add backdrop fade, item stagger and icon duration.
- [x] Preserve closing transitions before final closed state.
- [x] Fix Custom/Fade specificity so external animation can fully replace drawer transforms.
- [x] Keep center alignment independent of animation transforms, including Custom mode.

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
- [x] Submenu arrow visibility and motion values.
- [x] Named social/contact link destinations, replaceable icon Images and individual visibility toggles; keep labels as ordinary native text.
- [x] Focus, outside close, link close and scroll-lock behavior.
- [ ] Add a `Show brand` boolean property to both delivery editions, on by default, which fully hides the Brand from layout, keyboard and accessibility navigation when disabled.
- [x] Add clear property groups and tooltips.
- [x] Keep non-attribute-bindable values visible through native Text Blocks.
- [x] Convert `.mwp-css-nav_config` into a compact native Details-based `Smashburger settings` inspector: collapsed by default so it stays out of the author's working Canvas, expandable for a real-time property summary, readable in the Navigator, and hidden after runtime initialization in Preview and published output.

## 8. Repository deliverables

- [x] Maintain standalone CSS and progressive JavaScript sources.
- [x] Generate the Webflow embed from those sources.
- [x] Maintain an accessible native HTML reference implementation.
- [x] Add an interactive demo covering all layout/motion selections.
- [x] Make the interactive demo work when opened directly from the filesystem without ES-module/CORS failure.
- [x] Prevent the demo's external toggle control from immediately triggering outside-close.
- [x] Preserve standalone root `data-close-duration` configuration.
- [x] Add automated state, focus, outside/link close, backdrop and scroll-lock tests.
- [x] Document structure, classes, properties, variants, hooks and integration patterns.
- [x] Document the reusable existing-Navbar replacement workflow, current structural contract, stacking diagnosis, native Menu Button restriction and accessibility checks in `webflow/migration-guide.md`.

## 9. Optional jsDelivr distribution

Keep the current Canvas-visible, self-contained Embed as the dependable default. Add a second, explicitly optional distribution mode that loads versioned CSS and progressive-enhancement JavaScript from jsDelivr while leaving the native Webflow structure, classes, component properties and no-script behavior intact.

- [x] Choose public exact-version GitHub tags for the first release; reconsider npm after package naming and ownership are settled.
- [x] Owner selected and added the MIT licence before the first public tag.
- [x] Produce release-ready `dist` CSS and JavaScript files, minified files and source maps from the maintained source.
- [x] Generate exact semantic-version URLs; never generate `latest`, branch or floating version-range URLs.
- [x] Add a small Canvas-visible CDN loader Embed with a readable runtime version while normal editable Webflow settings remain native.
- [x] Preserve useful CSS/native behavior if the enhancement script is blocked, late or unavailable.
- [x] Define non-destructive CSS/JavaScript load diagnostics without hiding native navigation content.
- [x] Add generated SHA-384 Subresource Integrity and `crossorigin="anonymous"`; document that CSP must allow the pinned jsDelivr style/script origin and that jsDelivr receives normal CDN request metadata.
- [x] Add automated release checks that compare CDN artifacts with the repository build before publishing a tag/package.
- [x] Publish and byte-verify the immutable `v0.1.0` GitHub/jsDelivr release.
- [x] Publish and byte-verify the immutable `v0.2.0` GitHub/jsDelivr release; update the CDN component's exact URLs, SRI values and metadata.
- [x] Create a separate `Navbar Light CDN` Webflow component and `/navbar-light-cdn` test page after backup `V1.0.0 First Release`; keep the self-contained component/page untouched.
- [x] Add a minimal native Webflow visual baseline limited to structure, spacing, hit areas and `currentColor`; leave typography, text colour and decoration to destination-project base styles.
- [x] Build a native MWP Component Library demo shell with Webflow variables, base typography, a restrained homepage and a `/style-guide` class-retention page, while keeping its theme classes out of Navbar Light.
- [ ] Visually approve the new Home and Style Guide pages in Designer/Preview, then publish them from Webflow.
- [x] Create a clean Webflow site named `Smashburger` and install `SmashBurger CDN` from the shared MWP Component Library. Verify that component identity, all five variants, all 57 property values/bindings, native Canvas rendering and nine remapped SVG assets survive; confirm ordinary clipboard paste is flattened and is not the supported installation route.
- [x] Test the pinned `v0.2.0` cold-load path on the clean `Smashburger` site, byte-compare cache-bypassed jsDelivr responses, exercise CSS/JavaScript error diagnostics without removing native fallback content, and confirm successful published recovery.
- [ ] Test an explicit rollback and semantic-version upgrade on cloned Webflow sites after the first release from the renamed canonical repository.
- [x] Document switching safely between self-contained Embed, pinned CDN and self-hosted delivery without rebuilding the component.
- [ ] Let the future Designer Extension choose the delivery mode and pin the installed version explicitly.

### SmashBurger repository and local-folder rename

- [x] Commit and push all current portability, Library-installation and cleanup documentation before changing repository identity (`58e1407`).
- [ ] Create `madewithpixels/SmashBurger-Webflow-Navbar` as the new canonical GitHub repository with the complete Git history; use `smashburger-webflow-navbar` for the package name.
- [ ] Keep `madewithpixels/Webflow-Navbar-Light` available as an archived compatibility repository so existing immutable `v0.1.0` and `v0.2.0` jsDelivr URLs continue to resolve; do not rely on GitHub repository redirects for the third-party CDN contract.
- [ ] Update repository, package, documentation, generator and test references to the new canonical name without changing the established `mwp-*` public integration hooks.
- [ ] Audit public-facing HTML, CSS and JavaScript comments, diagnostics, demo copy and generated banners for stale `Navbar Light` wording. Use `SmashBurger` for the product name while retaining versioned filenames, CDN URLs, Webflow variant markers and compatibility API aliases until an explicitly tested migration can replace them.
- [ ] Build, test and publish a new semantic release from `SmashBurger-Webflow-Navbar`; generate exact new jsDelivr URLs and SHA-384 integrity values.
- [ ] Update both MWP Component Library editions and the `Smashburger` clean-install instance through the Library workflow; verify properties, variants, assets, CDN loading, rollback and update linkage.
- [ ] Archive the old compatibility repository only after the new release and old pinned URLs have both been independently verified.
- [ ] Rename the local folder last to `/Users/michaelauty/Work on Macbook/SmashBurger Webflow Navbar`, update the Git remote and reopen Codex from the new workspace path.

## 10. Migration hardening and public clonable

### Component hardening

- [ ] Audit the `.always`, `.always-1`, `.always-2` and further variant-derived combo classes materialized when a configured Library instance is unlinked. Record which rules are functional, authoring-only, visibility-related or redundant before removing or consolidating any of them.
- [ ] Use the madewithpixels trial audit as the first fixture: 35 `Always` selectors were materialized across 102 element attachments; 30 selectors and 97 attachments were declaration-free, while only the root, inner, menu, trigger and panel variants carried declarations. Confirm those counts against a fresh Library instance before treating them as release facts.
- [ ] Minimize variant-specific Webflow styles in the source components where stable base classes, data attributes or functional CSS can provide the same behavior, reducing generated class clutter without weakening the CSS/native fallback.
- [ ] Prevent declaration-free variant selectors from being emitted on unlink where Webflow permits it. Consolidate genuinely required Always behavior into stable, deliberately named base/state selectors and aim to leave no numbered `Always` combo trail in a newly unlinked instance.
- [ ] Add an unlink-cleanup checklist and a before/after regression fixture that proves an Always-collapsed instance retains layout, visibility, accessibility and Preview behavior after only demonstrably redundant generated classes are removed.
- [ ] Document and test the duplicate-name hazard created by unlinking a Library component: imported namespaced selectors and local selectors can share a Designer display name, while MCP `set_style` resolves only by name. Do not automate class replacement through MCP until Webflow supports deterministic style-ID/library-scope targeting; use a fresh backup and Designer-native removal for the verified cleanup path.
- [ ] Rebuild the source Library variants so a newly configured/unlinked instance reproduces the cleaned madewithpixels result without manual removal: stable base declarations, no fixed `80rem` maximum and no generated declaration-free `Always` trail.
- [x] Demote functional-CSS panel geometry defaults beneath ordinary Webflow classes: `display`, `position`, physical insets, width, maximum width, alignment translation and transform origin must use zero-specificity selectors at every collapse breakpoint and layout.
- [x] Keep panel interaction state separate from those presentation defaults so closed panels remain hidden and non-interactive and open panels retain their selected motion.
- [x] Build the cascade correction into `v0.2.1`, regenerate matching distribution files and integrity metadata, tag and publish the immutable release, and verify cache-bypassed jsDelivr CSS and JavaScript are byte-identical to the committed assets.
- [x] Update both MWP Component Library source Embeds to the exact `v0.2.1` self-contained bundle and pinned CDN loader, then read them back to confirm exact persistence.
- [x] Retroactively update the unlinked madewithpixels (`MWP'26`) loader to `v0.2.1`, publish staging and verify loaded CDN assets, full-width project styling, open/closed state, ARIA state, Escape close and trigger focus return.
- [ ] Share the pending MWP Component Library update and apply it to the linked `Smashburger` clean-install fixture after the unrelated pending `Faulty Terminal BG` Library change has been reviewed or isolated; then repeat the clean-install acceptance check.
- [ ] Audit the portable Webflow component classes for `background: inherit` and other inherited presentation values that create accidental coupling to destination wrappers. Replace component backgrounds with explicit, component-scoped colour properties/tokens and safe fallbacks that remain easy to override in Designer.
- [ ] Verify the revised background defaults in light, dark and transparent destination wrappers without referencing MWP Component Library demo-theme variables.
- [ ] Remove the fixed `max-width: 80rem` from the portable navigation inner base. Default to the available width and let destination projects add their own container class, variable or project-specific maximum.
- [ ] Add wide-layout regression coverage proving the component itself does not impose a content width while an optional destination container can still constrain and centre it.
- [ ] Make enhanced collapsed-panel presentation respond to `[data-mwp-panel][data-state="opening"]` and `[data-mwp-panel][data-state="open"]` rather than depending only on `[data-mwp-menu][open] + [data-mwp-panel]`.
- [ ] Retain and test the canonical adjacent-sibling selector as the CSS/native no-script baseline.
- [ ] Add a native-like `--mwp-nav-z-index` custom property with a documented default and confirm it can be overridden by destination projects.
- [ ] Add regression coverage for a trigger moved inside one ordinary layout wrapper while the panel remains elsewhere under the same root.
- [ ] Add regression coverage for panel state presentation above ordinary sticky content and for the `Show brand` property in both delivery editions.
- [ ] Add regression coverage for optional Dropdown and Full-width backdrops: opening/closing presentation, stacking below the panel, click-to-close with trigger focus return, and no unintended scroll lock.
- [ ] Re-run the complete layout/motion, collapse-breakpoint, keyboard, focus, ARIA/inert, reduced-motion and distribution checks before releasing these changes.
- [ ] After every relevant source-component release, review and deliberately backport the change to the unlinked/local madewithpixels implementation created from this trial; verify it there before rolling that local component across the project.

### Canvas authoring experience

- [ ] Prototype moving the Canvas-visible Code Embed inside one compact `SmashBurger infrastructure` or settings Details element, collapsed by default, and verify that its style/script output still executes and its property-bound configuration remains readable in Preview and published output.
- [ ] Remove the settings inspector Div from normal Canvas flow when it is not being used. Keep it compact/collapsible, selectable from the Navigator and available on demand without letting its summary or property rows push page content down while the navigation is styled.
- [ ] Test Webflow's `Keep in HTML when hidden` behavior before relying on a hidden authoring wrapper; the runtime must never disappear because an author hid the Canvas helper.
- [ ] Keep the real Backdrop non-blocking and visually absent on the Designer Canvas, while retaining normal selection through the Navigator and runtime activation in Preview/published output.
- [ ] Build a dedicated Navbar workbench page with separate closed-state and forced-open authoring instances. Shared classes should let designers style both states without repeatedly changing production-instance settings or leaving a menu open over page content.
- [ ] Include a small backdrop style swatch/reference on the workbench instead of making the fixed runtime Backdrop cover the Canvas while it is styled.
- [ ] Treat visible open/closed buttons inside production element settings as a fallback, not the preferred SmashBurger authoring experience.
- [ ] In the future Designer Extension prototype, investigate whether open/closed/isolate authoring controls can be genuinely temporary and non-publishing before promising app-managed state.

### Free Webflow clonable

- [ ] Define a deliberately basic clonable scope that demonstrates SmashBurger without turning the Library component into a site-specific header system.
- [ ] Supply a preconfigured, editable local Webflow component so clonable users do not need to install, configure and unlink a shared-Library instance first.
- [ ] Ensure the clonable's local component does not ship with the Library unlink workflow's generated `.always*` combo-class trail; retain only deliberately named, explainable classes.
- [ ] Include a plain baseline and a separately styled example, with one shared set of native links and no duplicated desktop/mobile navigation.
- [ ] Include the Navbar workbench with prepared closed/open examples and a backdrop reference so common styling work does not obstruct the clonable's real pages.
- [ ] Install one exact-version pinned CDN Embed with integrity metadata and keep the settings/structure understandable on the Canvas.
- [ ] Include a short in-project safe-editing guide covering functional data hooks, the trigger/panel relationship, native Menu Button restrictions, stacking, icon-only accessible names and final duplicate-header removal.
- [ ] Verify the clone flow into a blank test project, including Canvas editability, all four core breakpoints, keyboard behavior, asset loading, zero overflow and a clean console.
- [ ] Prepare the clonable as an early-exposure route for the SmashBurger site launch, with a clear route from the free baseline to the Library component and future app.

## 11. Webflow app product track

The preferred app form is a Webflow Designer Extension that installs and configures a native SmashBurger component. It must remain a generator and maintenance tool rather than a proprietary runtime widget: generated links, Divs, classes, variables, variants, properties and the Canvas-visible enhancement Embed must remain editable and continue working when the app is closed or uninstalled.

### Capability prototype

- [ ] Scaffold a private Designer Extension with the Webflow CLI.
- [ ] Prove end-to-end creation of native elements, existing/new classes and responsive styles.
- [ ] Prove component creation, all five collapse variants and component property bindings.
- [ ] Prove insertion of the Canvas-visible CSS/enhancement Embed.
- [ ] Confirm generated output remains functional and editable without the extension running.
- [ ] Confirm repeated installation is idempotent and does not duplicate components, classes or runtime code.

### Private installer MVP

- [ ] Add an Insert SmashBurger workflow.
- [ ] Expose collapse breakpoint, layout, alignment, panel width and motion settings.
- [ ] Expose duration, easing, distance, stagger, icon and accessibility/behaviour settings.
- [ ] Generate a reusable native Webflow component with clear Navigator names and property groups.
- [ ] Add installation diagnostics for missing structure, classes, attributes, props and runtime version.
- [ ] Store an explicit SmashBurger schema/runtime version marker while preserving compatibility with established runtime hooks.

### Safe maintenance and distribution

- [ ] Design conservative migrations that preserve user-authored content and intentional style overrides.
- [ ] Add a preview/diff step before modifying an existing installation.
- [ ] Validate the installer and migrations against cloned test sites before enabling updates.
- [ ] Decide whether licensing, hosted libraries, telemetry or managed templates justify a hybrid backend.
- [ ] Prepare onboarding, documentation, error handling, privacy/security material and a demonstration for Marketplace review.
- [ ] Pursue public Marketplace distribution only after the private extension has been tested with real users.

## 12. Optional mega-menu product track

Treat a mega-menu as a separate component or extension-installed premium feature rather than adding structural complexity to SmashBurger's default instance.

- [ ] Define the free/light boundary and a paid feature proposition.
- [ ] Prototype native configurable columns, group headings, link lists and optional promotional cards.
- [ ] Evaluate native component composition and slots without making ordinary link editing restrictive.
- [ ] Support desktop hover/focus intent while retaining click-first keyboard and touch behavior.
- [ ] Define collapsed reflow as nested disclosure groups rather than a desktop panel squeezed onto mobile.
- [ ] Explore optional CMS-fed groups while keeping a useful static native-element baseline.
- [ ] Expose layout, alignment, column count, widths, gaps and motion as ordinary Webflow styles/properties where possible.
- [ ] Preserve the same accessibility, lifecycle events, Custom-motion handoff and progressive-enhancement contract.
- [ ] Make the future Designer Extension own installation, validation and safe schema migrations.
- [ ] Test whether premium value is best delivered through the extension, paid templates/components, or a hybrid.

## 13. Verification

- [x] Publish the dedicated `Smashburger` site as the clean-install deployment target. Library installation, native Canvas editability, all 57 property bindings, five variants, inherited destination-project styles, nine remapped assets, responsive behavior, cold-load bytes, CDN failure diagnostics and recovery are verified.
- [x] Verify the CSS-only Tablet fallback in Webflow Preview.
- [x] Verify keyboard open, Escape close and focus return.
- [x] Verify ARIA state and inertness programmatically.
- [x] Verify drawer/fade, two-line icon, stagger, first-link focus, backdrop and scroll lock in Webflow Preview.
- [x] Verify nested submenu Escape behavior.
- [x] Audit collapsed/open accessibility state, ARIA relationships, focus order and focus restoration on the published component.
- [x] Keep closed nested-submenu descendants out of rendering and keyboard/screen-reader order while preserving Canvas visibility.
- [x] Verify Custom mode removes built-in transform and transition while state continues.
- [x] Verify editable configuration and Embed remain visible in Designer.
- [x] Verify shared navigation entries remain visible in Desktop Designer without relying on runtime CSS.
- [x] Keep collapsed variant panels visible but wrapped below the header row in Designer.
- [x] Restore the collapsed variant authoring overrides after the rebuilt component lost them.
- [x] Stack direct native panel children with the minimal functional collapsed-grid rule.
- [x] Stack native nested-submenu links after the published matrix exposed their inline fallback.
- [x] Restore the test instance to Tablet + Dropdown documented defaults.
- [x] User created a backup, refreshed, removed the obsolete component and published the acceptance page.
- [x] Run the automated suite after repository synchronization (18/18 passing, including direct-file demo startup, closed nested-submenu rendering state, pinned CDN artifact/loader verification, reduced-motion timing and CDN failure fallback).
- [x] Complete genuine macOS VoiceOver keyboard and spoken-output testing on the published Tablet variant: collapsed/expanded trigger announcements, closed-submenu omission, nested-link order and two-stage Escape focus restoration all pass.
- [ ] Complete spoken-output testing with NVDA on Windows.
- [x] Verify submenu arrow open/close motion, reduced-motion CSS and Canvas editability in both Webflow components and both published delivery modes.
- [x] Verify all nine social/contact destinations and default icon Images on both published pages; audit every visibility and replaceable icon-image prop binding in both components.
- [x] Verify `v0.2.0` at Desktop and Tablet in both delivery modes: enhancement state, outer and nested Escape focus return, loaded icon assets, hidden runtime config and zero horizontal overflow.
- [x] Complete the full layout/motion matrix (35/35 open, presentation, geometry, overflow and re-close cases).
- [x] Verify all three dropdown alignments and all seven centered motion presets.
- [x] Obsolete original test component removed by the user after backup.
- [x] Verify the published Desktop acceptance build initializes, expands the Tablet variant, renders shared links and hides authoring settings.
- [x] Verify published nested-submenu keyboard open/Escape behavior.
- [x] Publish and verify the direct collapsed-grid fix at Desktop, Tablet, Mobile landscape and Mobile portrait.
- [x] Publish and verify the nested-submenu grid fix, including two-stage Escape and focus restoration.
- [x] Publish and verify the center-alignment and close-duration Embed update.
- [x] Audit the five native collapse variants' stored Desktop, Tablet, Mobile landscape and Mobile portrait overrides; restore the test instance to Tablet afterward.
- [x] Replace obsolete expanded-variant mobile overrides that hid the shared panel in Never and Mobile portrait; re-run the affected Canvas cases.
- [x] Publish and verify the expanded-panel variant correction at Mobile landscape and Mobile portrait widths.
- [x] Restore the clean-install instance's unintended hidden-primary-navigation test override while retaining the user-selected Tablet variant.
- [x] Verify the published `Smashburger` clean install at 1280px, 984px, 767px and 393px: correct collapse state, zero overflow, loaded icons, hidden runtime settings, ARIA/inert synchronization, nested/outer Escape focus restoration and clean console.
- [x] Compare the MWP Library source and destination component schemas: the same five variants and 57 property IDs/defaults remain linked, with destination-local icon asset remapping intact.
- [x] Declare the Navbar Light/SmashBurger POC ready to hand over to the Webflow Designer Extension phase; keep Windows NVDA and the first real version rollback/upgrade as explicit product-phase validation.
