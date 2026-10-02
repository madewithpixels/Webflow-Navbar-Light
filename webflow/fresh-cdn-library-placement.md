# Fresh linked CDN placement on SB Test Four

## Draft proof, 2026-10-02

The unpublished `SmashBurger CDN property proof` page contains a newly placed, linked `SmashBurger CDN` instance. Designer readback exposes `Show brand` and `Show backdrop`; both bound controls changed their native targets and were restored to the defaults. The variant was also restored to its original `Mobile landscape` value after a temporary Tablet check.

This instance is **not ready to publish**. Its Canvas and Preview root, inner, trigger, panel and brand have empty `className` values. Native icon Images likewise lack their expected classes, yielding oversized icons on Canvas. By comparison, the published CDN source root has `mwp-css-nav` and its inner/panel have `mwp-css-nav_inner` / `mwp-css-nav_panel`; the working linked self-contained instance on SB Test Four has the namespaced equivalents. The CDN Preview did load the pinned `v0.2.3` CSS and initialized (`data-mwp-ready="true"`), but that stylesheet cannot restore all missing Webflow visual classes. The fresh placement survived a Designer reload, so this is not just the initial blank render.

The destination Libraries panel reports MWP Component Library **Up to date**, with four installed components; its Components panel reports one `SmashBurger CDN` instance. There is no pending Library update to accept for this page.

The same draft collapsed at 2057px despite `data-wf--smashburger-cdn--variant="mobile-landscape"`. A temporary Tablet selection also remained collapsed at 2057px. The released runtime does not read that marker directly, but the clean-site comparison below shows that its fallback works when the Webflow classes import correctly. The missing classes are therefore the stronger explanation for this instance's collapse error; see [variant-marker-regression.md](variant-marker-regression.md).

Before the CDN edition can serve as a drop-in delivery proof, diagnose why this particular Library placement discarded its class references. Compare the destination component definition and a fresh placement after Library synchronization; only then run the published Brand/Backdrop and responsive checks. Do not infer that the already working self-contained Library instance has this same failure.

## Clean-site comparison, 2026-10-02

On **SB Test Five**, MWP Component Library was installed on an otherwise empty site, then one linked `SmashBurger CDN` instance was placed on the new, unpublished `/smashburger-cdn-import-proof` page. The root, inner, trigger, panel, brand and sampled icon Images all had the expected `mwp-component-library--mwp-css-nav*` classes immediately and after a Designer reload. The Canvas displayed the intended horizontal navbar with normally sized icons. No installer action or component-local repair was used. Evidence: `/private/tmp/sb-test-five-cdn-import.jpg` (local screenshot).

With custom code enabled, the same pinned `v0.2.3` component initialized in Designer Preview. Its default `Mobile landscape` variant expanded at 2060px and Tablet width and collapsed at Mobile (L); opening set `aria-expanded="true"`, and Escape closed the menu with focus on the summary trigger. The linked `Show brand` control hid its native Brand anchor (`display: none`, zero width) and restored it on reset. `Show backdrop` changed the root binding from `True` to `False` and hid the native Backdrop, then restored `True` and the element's class. Both controls were returned to their defaults. This page remains unpublished.

On SB Test Four, a **second fresh placement** on the existing proof page had empty classes on those same elements, just like the first instance. That comparison instance was immediately removed with Designer Undo; one linked CDN instance remains. The Library panel still reports Up to date. This narrows the observed class loss to SB Test Four's Library/site import state rather than the current source CDN component universally failing to carry classes. The underlying Webflow cause is not yet proven. Avoid removing and reinstalling the Library while its working self-contained instance is in use; use SB Test Five for subsequent linked CDN visual checks.
