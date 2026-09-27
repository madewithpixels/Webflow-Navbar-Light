# SmashBurger Designer Extension capability prototype

This is a **private, disposable API test**, not a SmashBurger installer. It has three actions:

- **Inspect selection** reads the site breakpoints, selected component origin, variants, property groups and instance overrides, root marker, recognizable runtime hooks in WHTML, and whether WHTML export is available.
- **Create native proof** inserts a small editable header on a selected page container, gives it reusable `sb-proof-*` classes with styles at every configured breakpoint, converts it to a project component, creates the five planned collapse variant names, adds grouped properties, and attempts to bind those properties to native `aria-label` attributes.
- **Create draft lab and proof** finds or creates the unpublished `smashburger-app-api-lab` page on the Smashburger test site and runs the native proof on its Body. It refuses a duplicate proof component and checks the saved variants, properties and bindings.
- **Verify existing proof** reads the saved component, its variants, authored properties and two `aria-label` bindings without changing the site. Webflow also creates its own `Variant` property; the verifier allows for that generated property.
- **Check styles + Embed API** reads the proof class properties at all seven breakpoints. On the draft lab page only, it inserts or reuses one marked Code Embed and checks whether the Designer API exposes a code setting that can save a harmless HTML comment. It does not add production CSS or JavaScript.
- **Test native WHTML import** exports the small project-native proof component tree and imports it as a second native element on the draft page. It reports the imported element type, direct child count and classes, and refuses a duplicate marked import. This tests one possible template route without touching the linked Library component.

The proof deliberately has no SmashBurger runtime and its variant names do not yet alter collapse behavior. It must never be used as a production navigation menu. Run it only on a spare page or clone of the Smashburger site. It refuses a second run when the named component exists, and also checks for a partial native proof in the selected container. It reuses its styles if an earlier attempt stopped before component creation.

## Build and local run

```sh
npm ci
npx tsc --noEmit
npm run lint
npm run build
```

The bundle is `bundle.zip`. For live Designer testing, register a private Designer Extension app in the Webflow workspace, add its development URL or upload the bundle, and install it on the test site. The CLI scaffold alone does **not** install an app or prove the host API works. Use the Webflow CLI's current package `@webflow/webflow-cli`; the pinned version here is 2.9.0.

## Live acceptance to record

1. On the Smashburger test site, inspect a linked Library component and an unlinked native root. Confirm origin, marker, variants, props, and breakpoints.
2. On a spare page, create the proof and verify its Canvas structure, class styles at every site breakpoint, five variant names, grouped props, and both attribute bindings.
3. Close the Extension and verify the component and styles remain editable. Publish the spare page only if needed to inspect rendered output.
4. Reopen and run the action again. It must refuse duplicates. Test a partial failure separately on a clone.
5. Determine whether the API can insert and configure a Canvas-visible Embed, and whether WHTML import can safely preserve an adapted SmashBurger tree.

The production installer, Make local workflow, Embed insertion, rollback, and full functional/accessible menu remain separate work.

## Connected-site baseline, 27 September 2026

The Webflow site tools can read the Smashburger consumer without altering it. The site has all seven breakpoints: Desktop, 1280, 1440, 1920, Tablet, Mobile landscape and Mobile portrait. Its Overview page contains one `SmashBurger CDN` component instance. The component has 57 property definitions, five variants (`Never`, `Tablet`, `Mobile landscape`, `Mobile portrait`, `Always`), and seven site instances.

The private development app is registered and running inside Smashburger Designer. Live **Inspect selection** on the linked CDN instance returned all seven breakpoints, the five variant names, all 57 property definitions in eight groups, and two instance overrides (`Variant`, `Show primary navigation`). The selected instance itself has no visible `data-mwp-navbar` marker; WHTML export returned unavailable, so its internal runtime hooks could not be inspected through that route. These are live Designer Extension reads.

The first lab action did create the draft page, then stopped before inserting any element: the live `elementBuilder` rejected `DivBlock` with “Only `webflow.elementPresets.DOM` is currently supported.” The installed TypeScript declarations allowed that call, so runtime capability differs from its type surface. The proof has been changed to use direct native `append(DivBlock)` and `append(TextLink)` operations. The retry reuses the same draft page; its first failure left no proof marker or component.

The second lab action inserted the native header and registered the project component. A Webflow readback confirms one component instance, its native header/row/brand/nav/link tree, all five named variants and both authored string properties. Webflow automatically added a third `Variant` property; the prototype's original exact count check therefore reported a failure after creation. The check now reads the two authored properties by name and tests their actual bindings. On 27 September, the live Extension reported **Proof verified** for all five variants, both authored properties and both `aria-label` bindings. Independent Webflow element readback showed each saved binding pointing to its corresponding property ID in the `Accessibility` group. The draft page and component are retained for further verification; rerunning creation is intentionally disabled.

The live **Check styles + Embed API** action verified the saved proof styles at all seven breakpoints, including Tablet row wrapping. It inserted one marked `HtmlEmbed` on the draft page and saved `<!-- SmashBurger API lab Embed proof -->` through the Designer API. Independent Webflow data readback found that one Embed and the exact comment in its `code` setting. The linked CDN component was not modified. This proves the basic installation primitives; actual SmashBurger CSS/JS installation, Canvas editability with the app closed, Make local, and rollback still need separate acceptance.

With the extension box closed, a Designer screenshot shows the saved proof header rendering on the draft Canvas and both `SmashBurger API proof` and `Code Embed` in the Navigator. This verifies persistence and visibility without the extension running. Direct editability of the Embed code and full runtime behavior were not tested by that screenshot.

A separate Make local trial placed one new `SmashBurger CDN` instance in a marked wrapper on the draft page, then `unlinkComponent()` stopped with `Library components cannot be modified`. Webflow's data tool documents the same Library-instance restriction. The disposable wrapper and its one linked copy were removed; readback confirms the draft page is back to its proof component and Code Embed only. The existing linked instances and the Library source were not changed. The app no longer offers an automated Library-unlink action. A Designer UI handoff or native-template installer needs separate investigation.
