# Designer-only closed panel fixture

On 2026-10-02, the linked self-contained `SmashBurger` instance on [SB Test Four Home](https://sb-test-four.webflow.io/) was used to test an authoring-only panel rule. A separate Code Embed on that page contains:

```html
<style>html.wf-design-mode [data-mwp-navbar] [data-mwp-panel] { display: none !important; }</style>
```

Webflow Designer's Canvas document had `html.wf-design-mode`. At the Tablet breakpoint the Brand and Menu trigger remained visible while the navigation panel had `display: none` and a zero-size box. The same Embed was compiled in Preview, whose document had `html.wf-inactive` instead; opening the menu displayed all 16 panel links. The published Home page contained the style rule but lacked `wf-design-mode`: its desktop panel remained visible and its 600px menu opened with all 16 links, no horizontal overflow. The fixture is intentionally page-local; neither shared source component Embed nor released CSS was changed.

This proves a viable Canvas-only presentation hook, not a finished editing experience. A linked Library instance cannot expand its internal element tree in the consumer site's Navigator, so hiding the panel there leaves component properties as the editing route. The source component editor does expose its internal Navigator. Before moving the rule into the source component, verify source-editor selection of hidden links, all five collapse variants, the no-JavaScript fallback, and a prepared open-state workbench instance. The current test rule hides the panel even for `Never` and expanded desktop authoring, so it is unsuitable as a universal default without a way to opt in to the open view.

A temporary copy of the same style-only Embed on the MWP Component Library self-contained page confirmed the source component editor can expand `Navbar inner` → `Navigation panel` → `Primary navigation` → `Navigation links` and select a hidden native link. Its Settings panel exposed the Link destination and text; its Style panel exposed the `mwp-css-nav_link` selector and spacing controls. The temporary source-page Embed was then deleted, and the panel returned to `display: flex`. The shared component remains unchanged by this authoring experiment.

## Canvas helper in the source components (2026-10-03)

The authoring rules now ship as a separate, generated, style-only Embed:
`src/navbar-light-canvas.css` → `webflow/navbar-light-canvas-embed.html`
(`npm run build:canvas`, part of `npm run build` and `check:dist`). They cannot
live in the runtime Embed or the CDN stylesheet. Webflow replaces any Embed whose
code contains the literal script-tag text with a "only displays in preview mode"
placeholder on the Canvas. This applies even when the text appears only inside a
CSS comment: the first helper attempt was swallowed this way. A test now rejects
that text anywhere in the helper source. Runtime and CDN assets are unchanged by
this work (still `v0.2.5`).

Installed as `SmashBurger Canvas helper` directly after the runtime Embed in
both MWP Component Library source components (self-contained element
`aca600bf-3b2d-dc23-23d1-d3aaed11d48a`, CDN element
`7ebe183f-2c0e-1ac8-3a84-992b00c93d7f`). A new `Layout` → `Canvas: show open menu`
switch (default Off) is bound to the root `data-canvas-open` attribute
(self-contained prop `b492c47f-7fb8-5e44-79a5-72b97e8c0394`, CDN
`f9ea6ef1-dab8-dc5d-0841-443e829dad02`).

Michael's Designer screenshots of the self-contained acceptance page
(Tablet variant, Left drawer) confirmed:

- Desktop (1279px): full expanded menu; only the runtime Embed placeholder
  remains; `Smashburger settings` floats as a compact card at the right instead
  of taking page flow.
- Tablet (820px), switch Off: the header shows only Brand and the burger; the
  link panel is hidden. This proves Webflow emits the variant marker on the Canvas.
- Tablet, switch On: the link panel reappears under the header for styling.
- The first floating-inspector version was unreadable over a dark section; it
  now has a white surface, dark ink, shadow and a 70vh scroll limit (Canvas only).

The switch was reset to its default afterwards. Still to verify: the CDN
source component and a linked consumer after the Library update is shared;
and the Mobile landscape, Mobile portrait and Always variants on the Canvas.

Published check (Library staging, `/smashburger-navbar`, same day): the helper
Embed is present but inert. The page has no `wf-design-mode` class and the root
emits `data-canvas-open="False"`. The settings inspector stays runtime-hidden
(`display: none`, `position: static`). At 600px the closed panel keeps its
runtime `grid`, and opening shows all 9 links with the backdrop and no overflow.
