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
source component and a linked consumer (the Mobile and Always variants were
verified later the same day; see below).

Published check (Library staging, `/smashburger-navbar`, same day): the helper
Embed is present but inert. The page has no `wf-design-mode` class and the root
emits `data-canvas-open="False"`. The settings inspector stays runtime-hidden
(`display: none`, `position: static`). At 600px the closed panel keeps its
runtime `grid`, and opening shows all 9 links with the backdrop and no overflow.

## Navbar workbench page (2026-10-03)

MWP Component Library draft page `SmashBurger workbench`
(`/smashburger-workbench`, page `6ac107a07a294c4436ac576a`). It holds three
labelled native sections, created through MCP without new classes:

1. Closed instance (`514649f7-ee9a-2345-bae5-01a561700a8e`): `Always` variant,
   `Canvas: show open menu` Off. The Canvas shows only Brand and the `MENU` trigger.
2. Open instance (`dcbde88f-7757-82c1-0005-1424d96bcff8`): `Always` variant,
   `Canvas: show open menu` On. The Canvas shows the full panel (primary links,
   CTA, socials, contacts) for styling; Preview behaves like a normal closed menu.
3. Backdrop swatch (`aabdb11b-c887-e8b6-e3ac-ea4d7b55d6a5`): a plain Div with
   the `mwp-css-nav_backdrop` class but no `data-mwp-backdrop` hook, so it never
   becomes fixed or covers the Canvas.

Michael verified the page in the Designer at Desktop and Tablet. He gave the
swatch's class a red background, and both real menus' backdrops turned red in
Preview, so styling the swatch styles the runtime backdrop as intended.

Found: on the Canvas, each instance's floating settings card hangs below its
own root and overlaps the following content. Instance 1's card covers instance
2's header and trigger; instance 2's card covers the backdrop label.

Fix, step 1 (Michael chose a compact chip): the card became a pill centred at
the top edge of the header row. Michael then found that clicking it on the
Canvas opens nothing, because the Designer intercepts Canvas clicks for
selection, so a `details` element cannot toggle there. Clicking it only
selected the hidden rows, which showed as green dashed placeholder shapes.

Fix, step 2: on the Canvas the inspector is now a non-interactive,
text-width label (`Smashburger settings`). Its rows and summary hint are hidden
with `display: none`, and the open-state styles are gone. The settings
themselves are read in the Designer's component props panel.

Fix, step 3: Michael asked why a label that does nothing is shown at all. It
is not needed: the inspector only carries prop values for the runtime script,
and the props panel already shows them. On the Canvas it is now `display:
none`, and it stays selectable in the Navigator. Written to both source helper
Embeds. Michael's Desktop screenshot confirmed it: no label, no dashed
shapes, and nothing covers the second instance.

MCP authoring notes for the future Designer Extension: `data_element_builder`
created `TextBlock` as a Div whose text stayed Webflow's placeholder, so use
`Paragraph`. Elements cannot be created or moved with a component instance as
the anchor; reorder by moving the instance relative to ordinary siblings.

## Mobile variant Canvas check (2026-10-03)

On the workbench page, instance 1 was temporarily set to `Mobile landscape`
(the base variant) and instance 2 to `Mobile portrait` with `Canvas: show open
menu` Off. Michael's Designer screenshots matched every expectation:

| Width | Mobile landscape | Mobile portrait |
|---|---|---|
| Desktop (1279px) | expanded | expanded |
| Tablet (820px) | expanded | expanded |
| Mobile landscape (667px) | Brand + MENU | expanded |
| Mobile portrait (393px) | Brand + MENU | Brand + MENU |

With the Tablet and Always checks above, every collapse variant now hides its
closed panel on the Canvas at exactly its own breakpoint. Both instances were
restored afterwards (Always; instance 2 open-menu switch On).

## Linked consumer check: CDN edition on Smashburger (2026-10-03)

Smashburger `/demo` (page `6ab820b4510a44142d770a51`) holds a linked
`SmashBurger CDN` instance (`867bf7f2-ed3c-a61e-09b8-9625881be9ec`, Tablet
variant). This means the namespaced Library variant marker and prefixed classes
are in play. Michael's Designer screenshots:

- Desktop (1279px): full link row; no settings label; only the runtime Embed
  placeholder below the header.
- Tablet (820px), switch Off: Brand + MENU only.
- Tablet, switch On: the panel shows under the header for styling.

The switch was reset to its default (Off) through MCP afterwards. The Canvas
helper is now verified on both editions, as a source component and as a linked
Library instance.

Noted, not changed: the demo page's own copy still says the component is
"pinned to v0.2.3"; it is page content outside the component.
