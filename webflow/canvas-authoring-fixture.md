# Designer-only closed panel fixture

On 2026-10-02, the linked self-contained `SmashBurger` instance on [SB Test Four Home](https://sb-test-four.webflow.io/) was used to test an authoring-only panel rule. A separate Code Embed on that page contains:

```html
<style>html.wf-design-mode [data-mwp-navbar] [data-mwp-panel] { display: none !important; }</style>
```

Webflow Designer's Canvas document had `html.wf-design-mode`. At the Tablet breakpoint the Brand and Menu trigger remained visible while the navigation panel had `display: none` and a zero-size box. The same Embed was compiled in Preview, whose document had `html.wf-inactive` instead; opening the menu displayed all 16 panel links. The published Home page contained the style rule but lacked `wf-design-mode`: its desktop panel remained visible and its 600px menu opened with all 16 links, no horizontal overflow. The fixture is intentionally page-local; neither shared source component Embed nor released CSS was changed.

This proves a viable Canvas-only presentation hook, not a finished editing experience. A linked Library instance cannot expand its internal element tree in the consumer site's Navigator, so hiding the panel there leaves component properties as the editing route. The source component editor does expose its internal Navigator. Before moving the rule into the source component, verify source-editor selection of hidden links, all five collapse variants, the no-JavaScript fallback, and a prepared open-state workbench instance. The current test rule hides the panel even for `Never` and expanded desktop authoring, so it is unsuitable as a universal default without a way to opt in to the open view.

A temporary copy of the same style-only Embed on the MWP Component Library self-contained page confirmed the source component editor can expand `Navbar inner` → `Navigation panel` → `Primary navigation` → `Navigation links` and select a hidden native link. Its Settings panel exposed the Link destination and text; its Style panel exposed the `mwp-css-nav_link` selector and spacing controls. The temporary source-page Embed was then deleted, and the panel returned to `display: flex`. The shared component remains unchanged by this authoring experiment.
