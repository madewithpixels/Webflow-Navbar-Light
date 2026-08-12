/*
 * Navbar Light + GSAP example
 *
 * Set the component's Motion class property to `mwp-motion-custom`, load GSAP,
 * then run this after Navbar Light's enhancement script.
 */

const root = document.querySelector('[data-mwp-navbar]');
const panel = root?.querySelector('[data-mwp-panel]');
const backdrop = root?.querySelector('[data-mwp-backdrop]');

if (root && panel && globalThis.gsap) {
  gsap.set(panel, { autoAlpha: 0, xPercent: 100 });
  if (backdrop) gsap.set(backdrop, { autoAlpha: 0 });

  root.addEventListener('mwp-nav:open', () => {
    gsap.to(panel, { autoAlpha: 1, duration: 0.35, ease: 'power3.out', xPercent: 0 });
    if (backdrop) gsap.to(backdrop, { autoAlpha: 1, duration: 0.25 });
  });

  root.addEventListener('mwp-nav:close', () => {
    gsap.to(panel, { autoAlpha: 0, duration: 0.25, ease: 'power2.in', xPercent: 100 });
    if (backdrop) gsap.to(backdrop, { autoAlpha: 0, duration: 0.2 });
  });
}
