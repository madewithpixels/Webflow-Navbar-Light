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

## Current handoff — 27 September 2026

- [x] Ship and verify the pinned `v0.2.3` layout defaults and the six-page Smashburger demo area. The five layout pages passed closed/open checks at the recorded widths; Dropdown native GSAP and Overview Webflow scroll interactions passed on the published site. Evidence: `webflow/demo-qa.md`, `682257b`, `98b6de6`.
- [x] Prove the private Designer Extension can create and configure a project-native draft component. The API Lab now has one Base variant, three sample links, a compact native Details around the pinned Embed, and 20 grouped/bound properties. Tablet Preview with the app closed covered all five layouts without horizontal overflow; selected content, destination, panel-width and focus overrides were checked and reset. Evidence: `smashburger-designer-extension/README.md`, `3205093`, `0e02a63`, `8be9e8b`.
- [x] Keep the `SmashBurger App API Lab` page unpublished. The existing linked Library source and other consumer sites were not changed by the extension trial.
- [ ] Build the complete native generator: production content and property schema, five functional collapse variants, all layout/motion combinations, and safe repeat-install behavior on a clean site.
- [ ] Prove published behavior of the generated component, including its pinned Embed, keyboard/focus/ARIA state and an app-independent editing path. Resolve the Library `Make local` limitation or provide a precise Designer handoff.

The current released installation path remains the MWP Component Library. The private extension is a capability trial, not a released installer. Implementation snapshot reviewed at `8be9e8b`; local checks passed 21 runtime tests, `check:dist`, extension type checking, linting and bundling. Next useful action: design and test the generator's complete native tree and property schema on a disposable clean-site fixture before offering installation to other sites. No publication is needed for the draft API Lab at this stage.

## Earlier handoff — 21 August 2026

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
- [x] Initially give structural elements custom Navigator display names. The later real-site integration showed that these labels obscure the selectors authors actually need; future Webflow releases will remove them.
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
- [ ] When `Show backdrop` is enabled, support it consistently in every collapsed layout, including Dropdown and Full width as well as Left drawer, Right drawer and Overlay; do not make a dropdown backdrop imply page scroll locking. The scoped private-alpha Embed passed Designer Preview at 820px for Dropdown and Full width. Source CSS now includes those two layouts, and computed-style/runtime regression checks pass (24/24). The pinned v0.2.3 release is unchanged; versioned build and published checks remain.
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
- [ ] After the current Designer Extension alpha validation, run a separate, versioned naming migration to replace `Navbar Light` / `navbar-light` with `SmashBurger` across the repository, package and app metadata, generated files, documentation and Webflow-facing names. Inventory compatibility-sensitive filenames, CDN URLs and runtime hooks first; keep existing pinned releases working throughout. The detailed steps below govern this work. Do not start it during the active alpha installer work.
- [ ] Create `madewithpixels/SmashBurger-Webflow-Navbar` as the new canonical GitHub repository with the complete Git history; use `smashburger-webflow-navbar` for the package name.
- [ ] Keep `madewithpixels/Webflow-Navbar-Light` available as an archived compatibility repository so existing immutable `v0.1.0` and `v0.2.0` jsDelivr URLs continue to resolve; do not rely on GitHub repository redirects for the third-party CDN contract.
- [ ] Rename every portable component class from the legacy `mwp-*` / `mwp-css-nav_*` namespace to a documented `sb-*` namespace (`SmashBurger`) as part of the canonical repository rename. Update source HTML/CSS/JavaScript, generated Embeds, demos, Webflow components, clonable, documentation and tests together; treat this as an explicit versioned class migration rather than silently changing an existing release. Reserve `SmashBurger Lite` for the free clonable's product name, not its class prefix.
- [ ] Audit non-class public hooks separately during the rename. Do not assume that `data-mwp-*` attributes, `--mwp-*` custom properties or JavaScript compatibility aliases must change merely because the Webflow class namespace moves to `sb-*`; document the retained compatibility contract and any later migration deliberately.
- [ ] Add a generated-output assertion that a clean renamed release contains no legacy `mwp-*` class tokens while still rejecting accidental changes to retained runtime attributes or compatibility hooks.
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
- [x] Share the MWP Component Library update, apply it to the linked `Smashburger` clean-install fixture, publish it and verify `v0.2.1` CDN loading, linked Tablet behavior, contained panel geometry, ARIA/inert state, Escape close and trigger focus return.
- [ ] Audit the portable Webflow component classes for `background: inherit` and other inherited presentation values that create accidental coupling to destination wrappers. Both unpublished Library source roots now use `var(--mwp-nav-surface, #ffffff)` and `var(--mwp-nav-ink, #111827)`, replacing the inherited near-black surface that obscured black SVGs. CDN and self-hosted Desktop/Mobile Preview showed readable links and icons, but destination wrapper overrides, clean-site installation and publication remain unverified.
- [ ] Verify the revised background defaults in light, dark and transparent destination wrappers without referencing MWP Component Library demo-theme variables. The light fallback passed source Designer Canvas and Preview; dark and transparent wrapper overrides still need proof.
- [ ] Remove the fixed `max-width: 80rem` from the portable navigation inner base. On 30 September, both `SmashBurger CDN` and self-hosted `SmashBurger` source components had `mwp-css-nav_inner` Max W set to None in Designer, and both values survived a full Designer reload. The CDN Canvas looked contained at 1920+, 1440+, 1280+, Tablet and Mobile portrait. Neither change has been published, Library-shared or checked on a clean destination site. Let destination projects add their own container class, variable or project-specific maximum.
- [ ] Add wide-layout regression coverage proving the component itself does not impose a content width while an optional destination container can still constrain and centre it. A local CSSOM regression now confirms the source inner has no maximum and a destination class can add `max-width: 72rem` with automatic inline margins. This does not prove rendered width at 1920px; destination browser and published checks remain.
- [ ] Make enhanced collapsed-panel presentation respond to runtime open state rather than depending only on `[data-mwp-menu][open] + [data-mwp-panel]`. Source CSS now responds to panel `data-state="opening"|"open"`; a wrapper-separated trigger/panel test passes even without the root state attribute. Versioned output and Webflow placement remain unchecked.
- [x] Retain and test the canonical adjacent-sibling selector as the CSS/native no-script baseline. A computed-style test passes with an open native Details and no runtime state.
- [ ] Confirm the existing `--mwp-nav-z-index: 100` default can be overridden by destination projects. It is already present in source CSS, the pinned v0.2.3 distribution CSS and the Webflow Embed; the destination-project override has not been verified.
- [x] Add regression coverage for a trigger moved inside one ordinary layout wrapper while the panel remains elsewhere under the same root. The runtime opens the panel and computed visibility, opacity, pointer events and transform pass locally.
- [ ] Add regression coverage for panel state presentation above ordinary sticky content and for the `Show brand` property in both delivery editions.
- [ ] Add regression coverage for optional Dropdown and Full-width backdrops: opening/closing presentation, stacking below the panel, click-to-close with trigger focus return, and no unintended scroll lock. Computed-style tests now cover closed/opening/open presentation and stacking for all five layouts; runtime tests cover no automatic scroll lock and backdrop dismissal for Dropdown and Full width (24/24 suite passing). The private alpha also passed a manual 820px Preview check on 30 September. Published output remains unchecked.
- [ ] Re-run the complete layout/motion, collapse-breakpoint, keyboard, focus, ARIA/inert, reduced-motion and distribution checks before releasing these changes.
- [ ] After every relevant source-component release, review and deliberately backport the change to the unlinked/local madewithpixels implementation created from this trial; verify it there before rolling that local component across the project.

### Canvas authoring experience

- [ ] Remove custom Navigator display names from portable Webflow release elements so Webflow shows the actual `sb-*` class names authors need for styling and structural work. Make the class names themselves clear enough to describe the element.
- [ ] Verify the source Library, linked clean-install instance, unlinked/local instance and public clonable all expose the expected class names directly in the Navigator, without friendly labels masking their selectors.
- [ ] Prototype moving the Canvas-visible Code Embed inside one compact `SmashBurger infrastructure` or settings Details element, collapsed by default, and verify that its style/script output still executes and its property-bound configuration remains readable in Preview and published output. The draft native-core trial now has a closed infrastructure Details with its one Embed nested inside. Webflow readback confirms the saved structure; Desktop Canvas shows a roughly 20px summary instead of the tall Embed warning. Tablet Preview with the Extension closed confirms the hidden Details still executes the loader, opens the menu and returns focus on Escape. Published output remains untested.
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
- [ ] Leave structural elements on their default class-based Navigator labels; do not add custom display names that hide the clonable's `sb-*` selectors.
- [ ] Include a plain baseline and a separately styled example, with one shared set of native links and no duplicated desktop/mobile navigation.
- [ ] Include the Navbar workbench with prepared closed/open examples and a backdrop reference so common styling work does not obstruct the clonable's real pages.
- [ ] Install one exact-version pinned CDN Embed with integrity metadata and keep the settings/structure understandable on the Canvas.
- [ ] Include a short in-project safe-editing guide covering functional data hooks, the trigger/panel relationship, native Menu Button restrictions, stacking, icon-only accessible names and final duplicate-header removal.
- [ ] Verify the clone flow into a blank test project, including Canvas editability, all four core breakpoints, keyboard behavior, asset loading, zero overflow and a clean console.
- [ ] Prepare the clonable as an early-exposure route for the SmashBurger site launch, with a clear route from the free baseline to the Library component and future app.

## 11. Webflow app product track

The preferred app form is a Webflow Designer Extension that installs and configures a native SmashBurger component. It must remain a generator and maintenance tool rather than a proprietary runtime widget: generated links, Divs, classes, variables, variants, properties and the Canvas-visible enhancement Embed must remain editable and continue working when the app is closed or uninstalled. A headline differentiator should be helping an author graduate a managed or adapted SmashBurger instance into a clean project-native component rather than merely installing it.

### Capability prototype

- [x] Scaffold and locally bundle a private Designer Extension with the Webflow CLI (`smashburger-designer-extension/`); install it on Smashburger and verify live linked-component inspection across all seven breakpoints.
- [x] Prove end-to-end creation of native elements and site classes, with the saved proof styles verified by the Extension at all seven Smashburger breakpoints, including Tablet row wrapping.
- [x] Prove project component creation, all five named variants, grouped string properties and native `aria-label` bindings on the Smashburger draft lab; verify the saved bindings through both the Extension and Webflow data readback.
- [x] Prove native brand and link content bindings on the draft core: four `textContent` and four `link` props were saved and read back on the brand and three links. Canvas instance overrides changed the first link's text and destination, then were reset; a second app run added no duplicates. With the Extension closed, Tablet Preview rendered the default links and all five layout presets opened without horizontal overflow. Layout and collapse were reset to their component defaults afterward.
- [x] Bind native panel width, first-link focus, outside-click close, link-click close and scroll lock on the draft core. Webflow readback confirms the five new root attributes and the component's 20 authored properties. A `20rem` drawer rendered at 320px with no overflow; turning on first-link focus moved focus to Home. Both instance overrides were reset.
- [ ] Prove the Extension API can inspect a selected linked or unlinked instance, create a project-level component, create and group properties, and reconnect those properties to existing elements. Document any Designer-only steps immediately if the API cannot perform them safely.
- [ ] Resolve Make local for a linked Library instance: the live Designer Extension inserted a disposable linked copy but `unlinkComponent()` rejected it with `Library components cannot be modified`; the copy was removed. Test a native-template route or specify the precise Designer UI handoff.
- [ ] Build a native generator for the private installer. WHTML export/import is absent in the live Designer despite the installed typings. The draft direct-append core now has one Embed with scoped display rules plus the exact pinned loader, 20 grouped/bound native properties, and idempotent configuration readback. Eight properties cover the trial brand and three links; five more expose panel width and behavior. Its corrected icon/backdrop Canvas geometry passes at all seven breakpoints without horizontal overflow. Tablet/Dropdown Preview passes pointer open, Escape/focus return, ARIA/inert state and no overflow with the extension closed. The Collapse property also drives an Always-collapsed Desktop Preview, and Layout drives all five presets at Tablet width without overflow. A scoped Embed rule keeps the default Desktop Designer Canvas to the intended brand/link row while allowing Always to open in Preview. The Embed now sits in a compact native Details: its script runs while closed in Tablet Preview, and the Details itself is hidden there. Full production content/schema, five functional variants, all layout/motion combinations, clean-site install and published behavior remain pending.
- [x] Confirm the Extension-inserted Code Embed remains visible on the draft Canvas and in the Navigator with the app closed. Insertion and code writing pass live; Webflow data readback confirms the saved `code` setting and unique proof marker. Direct editing of the Embed code and production CSS/JS insertion remain installer work.
- [ ] Confirm generated output remains functional and editable without the extension running. The native core passed Tablet Preview open/Escape/focus checks with the extension closed, and the proof header and Embed remain visible. Direct editing of installed content, clean-site runtime and published behavior still need acceptance.
- [ ] Confirm repeated installation is idempotent and does not duplicate components, classes or runtime code.

### Private installer MVP

- [ ] Add an Insert SmashBurger workflow.
- [ ] Align newly generated alpha component styles with the agreed light drop-in default. The local installer candidate now gives fresh alpha installs a white surface/dark ink through overrideable CSS variables, inherited brand/link colours, a matching divider and an Embed without desktop icon inversion. Existing dark alpha Embeds retain their old code during recovery. Type checking and linting pass; a clean-site Designer install, Preview, property readback and published checks are still required before treating this as verified app output.
- [ ] In the control workbench, let authors choose navigation colours directly or enter project variable names. Apply those choices to the editable component styles and documented CSS tokens, with a usable light fallback when no choices are made. Include surface, ink, panel, divider and icon contrast in the preview; preserve author edits and instance overrides.
- [ ] Guide authors through primary, CTA, submenu and optional secondary link destinations during installation. The alpha editor now loads all 16 defaults and one guarded change passed Designer readback; a selected-instance audit has been added but still needs live verification. Show unconfigured `#` links clearly, preserve intentional instance overrides, and do not describe the generated menu as publish-ready while required destinations are placeholders.
- [ ] Expose collapse breakpoint, layout, alignment, panel width and motion settings.
- [ ] Expose duration, easing, distance, stagger, icon and accessibility/behaviour settings.
- [ ] Generate a reusable native Webflow component whose semantic `sb-*` classes remain visible in the Navigator, with no custom structural display names masking them; keep property groups clear and purposeful.
- [ ] Add installation diagnostics for missing structure, classes, attributes, props and runtime version.
- [ ] Store an explicit SmashBurger schema/runtime version marker while preserving compatibility with established runtime hooks.

### Make local / project adoption

- [ ] Add a `Make local` workflow for authors who have configured or structurally adapted SmashBurger and want to turn it into their own maintainable project-level component.
- [ ] Support both a still-linked Library instance and an already-unlinked native structure. Never discard the static values Webflow creates when props, variants and slots are unlinked.
- [ ] Inspect the selected instance and consolidate behavioural configuration such as collapse, layout, motion, backdrop and closing behaviour onto the outer `sb-nav` element where Webflow supports the relevant settings or custom attributes.
- [ ] Distinguish site-wide content that belongs in the local main component from the small set of values that genuinely need to vary per instance. Propose a minimal property set instead of recreating every Library property automatically.
- [ ] Create the project-level component, recreate and group the approved properties, and reconnect them to the correct existing elements while preserving content, destinations, images, classes, styles, accessibility attributes and runtime hooks.
- [ ] Present a preflight summary and before/after diff covering the proposed component name, behavioural attributes, properties, groups, bindings and any unsupported manual steps before changing the selected structure.
- [ ] Provide rollback or a recoverable duplicate until the converted component passes structural, responsive, keyboard, focus, ARIA/inert, asset and runtime-version checks.
- [ ] Confirm the resulting local component remains fully editable and functional after the Extension is closed or uninstalled, with no app-owned runtime dependency or duplicate source of truth.
- [ ] Use the MWP'26 adoption as the first real fixture, then repeat the workflow on a clean clone and a deliberately rearranged native Navbar replacement.

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
