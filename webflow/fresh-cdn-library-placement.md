# Fresh linked CDN placement on SB Test Four

## Draft proof, 2026-10-02

The unpublished `SmashBurger CDN property proof` page contains a newly placed, linked `SmashBurger CDN` instance. Designer readback exposes `Show brand` and `Show backdrop`; both bound controls changed their native targets and were restored to the defaults. The variant was also restored to its original `Mobile landscape` value after a temporary Tablet check.

This instance is **not ready to publish**. Its Canvas and Preview root, inner, trigger, panel and brand have empty `className` values. Native icon Images likewise lack their expected classes, yielding oversized icons on Canvas. By comparison, the published CDN source root has `mwp-css-nav` and its inner/panel have `mwp-css-nav_inner` / `mwp-css-nav_panel`; the working linked self-contained instance on SB Test Four has the namespaced equivalents. The CDN Preview did load the pinned `v0.2.3` CSS and initialized (`data-mwp-ready="true"`), but that stylesheet cannot restore all missing Webflow visual classes. The fresh placement survived a Designer reload, so this is not just the initial blank render.

The destination Libraries panel reports MWP Component Library **Up to date**, with four installed components; its Components panel reports one `SmashBurger CDN` instance. There is no pending Library update to accept for this page.

The same draft exposed the separate `v0.2.3` variant-marker bug recorded in [variant-marker-regression.md](variant-marker-regression.md): at 2057px, `data-wf--smashburger-cdn--variant="mobile-landscape"` still became `data-mwp-collapsed="true"`. A temporary Tablet selection also remained collapsed at 2057px. The maintained runtime fix is committed, but this Webflow page still runs the old pinned release.

Before the CDN edition can serve as a drop-in delivery proof, diagnose why this particular Library placement discarded its class references. Compare the destination component definition and a fresh placement after Library synchronization; only then run the published Brand/Backdrop and responsive checks. Do not infer that the already working self-contained Library instance has this same failure.
