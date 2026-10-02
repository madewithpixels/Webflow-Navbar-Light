# Native details CSS regression

The [published SB Test Four fixture](https://sb-test-four.webflow.io/sb-css-regression) tests the source candidate stylesheet with a native `details`/`summary` trigger directly adjacent to the navigation panel. The Embed contains no SmashBurger JavaScript. Webflow's ordinary published page scripts may still be present.

The maintained markup is `webflow/fixtures/native-details.html`. Generate a self-contained Webflow Embed from the current source CSS with:

```sh
node scripts/build-native-details-fixture.mjs > /tmp/sb-native-details-fixture.html
```

Paste the generated HTML into a Code Embed on a disposable page. Check the published page, not only Designer Preview.

On 2026-10-02, the published page passed at 1280px and 600px. Initially, `details.open` was false and the panel's computed visibility was `hidden`, opacity `0` and pointer events `none`. Clicking the summary opened it and made the panel visible and interactive. Pressing Enter on the summary closed it; after the CSS transition settled, the panel returned to hidden, opacity `0` and pointer events `none`. The root had no SmashBurger enhanced state, its Embed contained no script, and neither width had horizontal overflow.

This proves the adjacent-sibling native baseline. It does not prove the enhanced wrapped-trigger case, backdrop behavior or every Webflow breakpoint.
