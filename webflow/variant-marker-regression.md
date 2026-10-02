# Webflow variant marker regression

## Finding (2026-10-02)

A fresh linked `SmashBurger CDN` instance on the SB Test Four draft page `SmashBurger CDN property proof` initialized in Preview but showed its Menu trigger at 2057px even though its default variant was `Mobile landscape`. At that width `(max-width: 767px)` was false. The rendered root carried `data-wf--smashburger-cdn--variant="mobile-landscape"`; the released runtime looked only for the obsolete `data-wf--navbar-light--variant` name and fell back to the native menu wrapper's display state. This is a release-candidate defect, not a Webflow breakpoint setting.

The self-contained source page uses `data-wf--smashburger--variant`. Both current marker names were read from the published MWP Component Library staging pages. The maintained runtime now discovers a recognized `data-wf--…--variant` marker without depending on the component's name. Explicit `data-collapse` still takes precedence. The maintained CSS also recognizes both current marker names for the native, no-script collapse rules and ignores those markers when an explicit `data-collapse` is present. The old marker remains supported for existing installs.

## Verification and release boundary

The automated suite covers the old marker, both current markers, a namespaced Library marker, explicit override precedence in JavaScript and CSS, the fresh CDN instance's desktop expansion, and CSS-only `Always` open/closed state. All 35 tests and the JavaScript syntax check pass locally. The draft CDN proof remains unpublished and still runs the pinned `v0.2.3` assets, so its live behavior has **not** been repaired yet. Rebuild and version the candidate, update the source component Embeds, then repeat Desktop, Tablet and mobile Preview/published checks on a fresh linked CDN instance before claiming this fixed in distribution.

A temporary localhost fixture using the actual CDN marker and maintained source files also passed a rendered browser check. At 2057px and 820px it expanded with a hidden trigger; at 767px, 600px and 400px it collapsed with the trigger visible. At 600px, opening exposed the panel and set `aria-expanded="true"`; Escape returned it to `false`. The temporary fixture and server were removed after the check.

A separate CSS-only fixture omitted the script. With a low-specificity baseline for the trigger (as the source component supplies through native variant styles), the current marker selectors showed the expected trigger/panel states at 1280px, 820px, 600px and 400px for `Always`, `Tablet`, `Mobile landscape` and `Mobile portrait`. Clicking native `<summary>` in the 600px `Mobile landscape` case set `<details open>` and revealed the link. This checks the maintained functional CSS; a post-release Webflow check is still required because the real component adds its own variant class rules.
