# Reduced-motion transition regression

## Designer Preview finding, 2026-10-02

On SB Test Five's clean linked CDN import, Chrome DevTools emulated `prefers-reduced-motion: reduce` at the 393px Mobile breakpoint. Readback inside the Preview canvas confirmed `matchMedia` was true. With the pinned `v0.2.3` CSS, opening the Dropdown menu changed its accessible state immediately, but the open panel computed `transition-duration: 0.28s, 0.28s, 0s`; an item computed `0.28s`. The closed panel used `0s`, and the burger lines, backdrop and submenu icon used `0.01ms` as intended. Escape closed the menu and returned focus to the trigger. The browser emulation was reset to **No emulation** and DevTools was closed after the check.

The source media rule used `[data-mwp-navbar] [data-mwp-panel]`, which loses to the more specific open-state `transition-duration` declaration. The maintained CSS now sets reduced-motion **effective** duration and stagger variables and uses those variables in every source transition declaration. This lets the media preference win without `!important` or overwriting an author's configured normal-motion durations. The JavaScript already removes its transition wait under reduced motion.

`npm test`, `npm run check` and `npm run build` pass with the source correction. Generated files were restored after the build because `v0.2.3` is immutable and the candidate has no new release version yet. The candidate CSS has **not** passed a rendered browser or published Webflow check; that remains a release gate. The local `file:` demo browser check was denied by browser security policy, and no alternate browser path was attempted.
