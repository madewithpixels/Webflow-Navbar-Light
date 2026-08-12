import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { JSDOM } from 'jsdom';

let dom;
let NavbarLight;

const markup = `
  <header data-mwp-navbar data-collapse="always" data-motion="none" data-close-on-link="true" data-close-on-outside="true">
    <div>
      <details data-mwp-menu open>
        <summary data-mwp-trigger>Menu</summary>
      </details>
      <nav data-mwp-panel>
        <a href="#one" data-mwp-item>One</a>
        <details data-mwp-submenu><summary>More</summary><a href="#two">Two</a></details>
      </nav>
    </div>
    <div data-mwp-backdrop></div>
  </header>`;

beforeEach(async () => {
  dom = new JSDOM(markup, { url: 'https://example.test/' });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    CustomEvent: dom.window.CustomEvent,
    CSS: { supports: () => true },
    getComputedStyle: dom.window.getComputedStyle,
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    MWP_NAVBAR_LIGHT_AUTO_INIT: false
  });
  ({ NavbarLight } = await import(`../src/navbar-light.js?test=${Math.random()}`));
});

afterEach(() => {
  dom.window.close();
  for (const key of ['window', 'document', 'CustomEvent', 'CSS', 'getComputedStyle', 'matchMedia', 'MWP_NAVBAR_LIGHT_AUTO_INIT']) delete globalThis[key];
});

test('initialises a collapsed navbar in a closed accessible state', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  const navbar = new NavbarLight(root);
  const menu = root.querySelector('[data-mwp-menu]');
  const trigger = root.querySelector('[data-mwp-trigger]');
  const panel = root.querySelector('[data-mwp-panel]');

  assert.equal(root.dataset.mwpCollapsed, 'true');
  assert.equal(root.dataset.state, 'closed');
  assert.equal(menu.open, false);
  assert.equal(trigger.getAttribute('aria-expanded'), 'false');
  assert.equal(panel.inert, true);
  assert.equal(trigger.getAttribute('aria-controls'), panel.id);
  navbar.destroy();
});

test('opens, emits lifecycle events and exposes public controls', async () => {
  const root = document.querySelector('[data-mwp-navbar]');
  const navbar = new NavbarLight(root);
  const events = [];
  root.addEventListener('mwp-nav:open', () => events.push('open'));
  root.addEventListener('mwp-nav:opened', () => events.push('opened'));

  root.mwpNavbarLight.open();
  await new Promise((resolve) => setTimeout(resolve, 15));

  assert.equal(root.dataset.state, 'open');
  assert.deepEqual(events, ['open', 'opened']);
  assert.equal(root.mwpNavbarLight.state, 'open');
  navbar.destroy();
});

test('closes on Escape and restores focus to the trigger', async () => {
  const root = document.querySelector('[data-mwp-navbar]');
  const navbar = new NavbarLight(root);
  const menu = root.querySelector('[data-mwp-menu]');
  const trigger = root.querySelector('[data-mwp-trigger]');

  menu.open = true;
  await new Promise((resolve) => setTimeout(resolve, 10));
  document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 15));

  assert.equal(menu.open, false);
  assert.equal(document.activeElement, trigger);
  assert.equal(root.dataset.state, 'closed');
  navbar.destroy();
});

test('closes after a navigation link click', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  const navbar = new NavbarLight(root);
  const menu = root.querySelector('[data-mwp-menu]');
  menu.open = true;

  root.querySelector('a').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  assert.equal(menu.open, false);
  navbar.destroy();
});

test('expanded mode keeps the shared panel available and the trigger inactive', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.dataset.collapse = 'never';
  const navbar = new NavbarLight(root);

  assert.equal(root.dataset.mwpCollapsed, 'false');
  assert.equal(root.dataset.state, 'expanded');
  assert.equal(root.querySelector('[data-mwp-menu]').open, true);
  assert.equal(root.querySelector('[data-mwp-panel]').inert, false);
  navbar.destroy();
});
