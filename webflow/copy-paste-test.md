# Cross-project copy/paste acceptance test

Run this test against a disposable or backed-up destination Webflow project. The destination must use visibly different body and link tag styles so inherited presentation is easy to identify.

## Preparation

1. Create a destination-project backup.
2. Give the destination body and link tag selectors distinctive typography, link colour and text decoration.
3. Keep the source and destination Designers open with Preview off.
4. Copy one complete `Navbar Light CDN` component instance from the source page and paste it into a blank destination page.

## Canvas checks

- The Navigator contains native Brand, details/summary trigger, editable Div burger bars, shared Link elements, submenu with editable Div arrow, social/contact region, CTA, settings and Canvas-visible Embed.
- The component retains all five collapse variants and all editable component properties.
- Brand and navigation text adopt the destination project's body/link tag styles without removing component classes.
- Structural spacing, hit areas, burger geometry, panel grouping and CTA outline remain usable.
- Editing a destination base link colour updates the navbar links, burger `currentColor` and CTA outline without editing the Embed.
- No source-project-only combo class, font, variable or asset is required.

## Preview checks

- The exact `v0.1.0` CSS and JavaScript requests succeed from jsDelivr.
- Both loader elements report `data-mwp-status="loaded"`; no `mwp-navbar-light:cdn-error` event is emitted.
- Tablet starts collapsed, opens from the full trigger, closes on Escape and restores focus.
- Desktop remains expanded; Mobile landscape and Mobile portrait remain collapsed.
- Nested `More` opens independently and uses two-stage Escape behavior.
- The optional submenu arrow follows the native open state and its duration, easing and rotation properties.
- Facebook, Instagram, LinkedIn, TikTok, Threads, X, WhatsApp, Telephone and Email native labels, destination props, replaceable icon-image props and visibility toggles remain editable after paste.
- The settings block disappears only after runtime initialization.

## Failure and recovery checks

1. Temporarily block the CDN JavaScript request: native details open/close remains usable.
2. Temporarily block the CDN CSS request: navigation content remains present and the loader reports the CSS failure.
3. Restore the pinned URLs and confirm a cold reload succeeds.
4. Replace the Embed with the self-contained generated Embed and confirm behavior without external requests.
5. Restore the pinned CDN Embed and confirm the component needs no structural rebuild.

Record the destination site/page, date, browser, copied component variant, observed inherited base styles and any class-name conflicts in the roadmap before marking portability complete.
