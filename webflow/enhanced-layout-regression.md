# Enhanced layout regression

The [published SB Test Four fixture](https://sb-test-four.webflow.io/sb-enhanced-regression) tests the current source candidate with its Menu `details` inside a normal layout wrapper and the navigation panel elsewhere in the same root. The maintained markup is `webflow/fixtures/enhanced-layout.html`. Generate the self-contained Webflow Embed with:

```sh
node scripts/build-enhanced-layout-fixture.mjs > /tmp/sb-enhanced-layout-fixture.html
```

Paste the generated HTML into a Code Embed on a disposable page, publish it and check the live result. Keep this separate from the native-details fixture, which intentionally lacks SmashBurger JavaScript.

On 2026-10-02, the published fixture passed at 1280px and 600px. Its Dropdown panel is **not** adjacent to `details`; the source runtime set collapsed and panel state, opened the panel from the wrapped summary and synchronized `aria-expanded` and panel `aria-hidden`. The opt-in Dropdown backdrop became visible and interactive, while computed body overflow remained `visible`. The destination wrapper supplied `--mwp-nav-z-index: 240`, which the root inherited; the backdrop painted above ordinary sticky content at z-index `10`, and the panel painted above the backdrop. A backdrop click and Escape each closed the menu and returned focus to the trigger. Neither tested width overflowed horizontally.

The same page also contains a Full-width root. Its backdrop was hidden and non-interactive while closed, visible and interactive when open, and hidden again after close. The panel had computed z-index `2` above the backdrop's `1`; the page retained visible body overflow. A pointer click on a visible backdrop area closed the menu and returned focus to its trigger. At 600px, the panel opened without horizontal overflow. For repeatable automation, choose a visible backdrop point outside the Full-width panel: the backdrop's geometric centre is covered by the panel and is not a valid backdrop click target.

Webflow's native Switch binding emits `True` and `False`, not lowercase strings. The candidate CSS uses a case-insensitive attribute selector. The published fixture was changed to `data-backdrop="True"`; both layouts still exposed the backdrop while open. In MWP Component Library, `Show backdrop` is now bound in **both** the CDN and self-contained components to the native Backdrop visibility and the root `data-backdrop` attribute. Designer readback returned `False` and computed `display: none` on the native Backdrop when hidden, then `True` when restored; the default was reset after each temporary instance override. The published Library staging pages each retained a native Backdrop and root `data-backdrop="True"`. The CDN component's Always and Never variants, and the self-contained component's Always variant, also retained the binding in Designer. The shared Library has not been propagated to consumer sites as part of this CSS candidate.

This is published evidence for the wrapped trigger, inherited stacking token, Dropdown and Full-width backdrops, and the native property-to-attribute binding. Other layouts, reduced-motion behavior and a versioned distribution release still need separate acceptance.
