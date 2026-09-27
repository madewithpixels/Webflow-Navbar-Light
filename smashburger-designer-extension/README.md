# SmashBurger Designer Extension capability prototype

This is a **private, disposable API test**, not a SmashBurger installer. It has two actions:

- **Inspect selection** reads the site breakpoints, selected component origin, variants, grouped properties, root marker, and whether WHTML export is available.
- **Create native proof** inserts a small editable header on a selected page container, gives it reusable `sb-proof-*` classes with breakpoint styles, converts it to a project component, creates the five planned collapse variant names, adds grouped properties, and attempts to bind those properties to native `aria-label` attributes.

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

No live Designer execution is claimed by the local build. The production installer, Make local workflow, Embed insertion, rollback, and full functional/accessible menu remain separate work.
