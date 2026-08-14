# Cross-project Library installation acceptance test

Run this test against a disposable or backed-up destination Webflow project. The destination must use visibly different body and link tag styles so inherited presentation is easy to identify.

Webflow Libraries are the supported cross-project installation route. Ordinary clipboard paste is tested only as a fallback: it preserves native structure, attributes, styles and assets, but intentionally flattens the component and loses its properties and variants.

## Preparation

1. Create a destination-project backup.
2. Give the destination body and link tag selectors distinctive typography, link colour and text decoration.
3. Share the MWP Component Library with the destination project.
4. Insert `SmashBurger CDN` from the destination project's Libraries panel onto a blank page.

## Canvas checks

- The Navigator contains native Brand, details/summary trigger, editable Div burger bars, shared Link elements, submenu with editable Div arrow, social/contact region, CTA, settings and Canvas-visible Embed.
- The component retains all five collapse variants and all editable component properties.
- Brand and navigation text adopt the destination project's body/link tag styles without removing component classes.
- Structural spacing, hit areas, burger geometry, panel grouping and CTA outline remain usable.
- Editing a destination base link colour updates the navbar links, burger `currentColor` and CTA outline without editing the Embed.
- No source-project-only combo class, font, variable or asset is required.

## Preview checks

- The exact `v0.2.0` CSS and JavaScript requests succeed from jsDelivr.
- Both loader elements report `data-mwp-status="loaded"`; no `mwp-navbar-light:cdn-error` event is emitted.
- Tablet starts collapsed, opens from the full trigger, closes on Escape and restores focus.
- Desktop remains expanded; Mobile landscape and Mobile portrait remain collapsed.
- Nested `More` opens independently and uses two-stage Escape behavior.
- The optional submenu arrow follows the native open state and its duration, easing and rotation properties.
- Secondary navigation remains first and Primary navigation second in the panel; Social/Contact and Navigation links/CTA wrappers retain their nesting and native flex/grid editability.
- Facebook, Instagram, LinkedIn, TikTok, Threads, X, WhatsApp, Telephone and Email native labels, destination props, replaceable icon-image props and individual visibility toggles remain editable after installation.
- Primary, CTA, secondary master, socials, social labels, contact group and contact-label visibility toggles remain bound after installation.
- The settings block disappears only after runtime initialization.

## Failure and recovery checks

1. Temporarily block the CDN JavaScript request: native details open/close remains usable.
2. Temporarily block the CDN CSS request: navigation content remains present and the loader reports the CSS failure.
3. Restore the pinned URLs and confirm a cold reload succeeds.
4. Replace the Embed with the self-contained generated Embed and confirm behavior without external requests.
5. Restore the pinned CDN Embed and confirm the component needs no structural rebuild.

Record the destination site/page, date, browser, copied component variant, observed inherited base styles and any class-name conflicts in the roadmap before marking portability complete.

## Recorded clean-install result

- Destination: `Smashburger` → Home.
- Installed component: shared-Library `SmashBurger CDN`.
- Result: one genuine Library component instance; all five variants and all 57 properties survived with live bindings.
- Assets: all nine SVG icons were remapped to destination asset IDs and remained replaceable.
- Canvas: destination inheritance, native structure, label/group toggles and responsive variant controls worked.
- Clipboard comparison: the same component pasted as ordinary elements without warning, but lost component identity, variants and property bindings; this flattened copy was removed.
- Cleanup: the nine clipboard-import SVG duplicates were deleted after confirming the Library instance referenced a separate remapped nine-asset set; all active icons were then verified individually and visually.
- Published acceptance: complete on 14 August 2026. The Tablet instance was restored to show primary navigation, published, and verified at 1280px, 984px, 767px and 393px with zero overflow, correct collapse state, synchronized ARIA/inert state, two-stage Escape focus restoration, loaded icons and hidden runtime settings.
- Delivery acceptance: cache-bypassed CDN downloads matched the committed `v0.2.0` bytes; both loader elements reported `loaded`. Automated failure handlers reported CSS/JavaScript errors while preserving the native content, followed by successful published recovery.
- Library parity: the source and destination still expose the same five variants and all 57 property IDs/defaults; destination-local icon asset mappings remain intact.
