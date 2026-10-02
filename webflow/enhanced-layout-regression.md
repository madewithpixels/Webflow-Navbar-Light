# Enhanced layout regression

The [published SB Test Four fixture](https://sb-test-four.webflow.io/sb-enhanced-regression) tests the current source candidate with its Menu `details` inside a normal layout wrapper and the navigation panel elsewhere in the same root. The maintained markup is `webflow/fixtures/enhanced-layout.html`. Generate the self-contained Webflow Embed with:

```sh
node scripts/build-enhanced-layout-fixture.mjs > /tmp/sb-enhanced-layout-fixture.html
```

Paste the generated HTML into a Code Embed on a disposable page, publish it and check the live result. Keep this separate from the native-details fixture, which intentionally lacks SmashBurger JavaScript.

On 2026-10-02, the published fixture passed at 1280px and 600px. Its Dropdown panel is **not** adjacent to `details`; the source runtime set collapsed and panel state, opened the panel from the wrapped summary and synchronized `aria-expanded` and panel `aria-hidden`. The opt-in Dropdown backdrop became visible and interactive, while computed body overflow remained `visible`. The destination wrapper supplied `--mwp-nav-z-index: 240`, which the root inherited; the backdrop painted above ordinary sticky content at z-index `10`, and the panel painted above the backdrop. A backdrop click and Escape each closed the menu and returned focus to the trigger. Neither tested width overflowed horizontally.

The same page also contains a Full-width root. Its backdrop was hidden and non-interactive while closed, visible and interactive when open, and hidden again after close. The panel had computed z-index `2` above the backdrop's `1`; the page retained visible body overflow. A pointer click on a visible backdrop area closed the menu and returned focus to its trigger. At 600px, the panel opened without horizontal overflow. For repeatable automation, choose a visible backdrop point outside the Full-width panel: the backdrop's geometric centre is covered by the panel and is not a valid backdrop click target.

This is published evidence for the wrapped trigger, inherited stacking token, Dropdown and Full-width backdrops. Native component-property wiring, other layouts and reduced-motion behavior still need separate acceptance.
