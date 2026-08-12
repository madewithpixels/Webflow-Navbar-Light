# Webflow Interactions handoff

1. Set the Navbar Light `Motion class` property to `mwp-motion-custom`.
2. Add a first-click interaction to `Menu trigger` that animates `Navigation panel` into view.
3. Add the matching second-click interaction that animates it out.
4. Target the panel by the `mwp-css-nav_panel` class or `[data-mwp-panel]` hook.
5. Leave the native summary and Navbar Light enhancement in place. They continue to own open state, ARIA, inertness, Escape and focus behavior.

Webflow Interactions responds to its configured UI triggers, but it does not natively subscribe to Navbar Light's custom DOM lifecycle events. A two-click interaction therefore covers pointer/keyboard activation of the trigger, but an outside click or Escape close cannot automatically run the same Interaction timeline.

For complete synchronization across trigger, Escape, outside click and programmatic controls, use Webflow's GSAP integration or a small script that listens to `mwp-nav:open` and `mwp-nav:close`. The repository's `gsap.js` example shows that event-driven pattern.

Custom mode deliberately leaves the panel visually available and removes built-in transforms/transitions. The enhancement still sets `data-state`, `aria-expanded`, `aria-hidden` and `inert`, so an external animation does not need to reimplement navigation state or accessibility behavior.
