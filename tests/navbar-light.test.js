import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, test } from 'node:test';
import { JSDOM } from 'jsdom';

let dom;
let NavbarLight;

function waitForEvent(target, eventName, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      target.removeEventListener(eventName, onEvent);
      reject(new Error(`Timed out waiting for ${eventName}`));
    }, timeout);
    const onEvent = (event) => {
      clearTimeout(timer);
      resolve(event);
    };
    target.addEventListener(eventName, onEvent, { once: true });
  });
}

test('functional CSS keeps a closed native submenu out of the accessibility tree', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  assert.match(css, /\[data-mwp-submenu\]:not\(\[open\]\) > \.mwp-css-nav_submenu-list\s*\{\s*display:\s*none;/);
  assert.match(css, /\[data-mwp-submenu\]\[open\] > summary \[data-mwp-submenu-icon\]/);
  assert.doesNotMatch(css, /::before|::after/);
});

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

  const opened = waitForEvent(root, 'mwp-nav:opened');
  root.mwpNavbarLight.open();
  await opened;

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

  const opened = waitForEvent(root, 'mwp-nav:opened');
  menu.open = true;
  await opened;
  const closed = waitForEvent(root, 'mwp-nav:closed');
  document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await closed;

  assert.equal(menu.open, false);
  assert.equal(document.activeElement, trigger);
  assert.equal(root.dataset.state, 'closed');
  navbar.destroy();
});

test('closes after a navigation link click', async () => {
  const root = document.querySelector('[data-mwp-navbar]');
  const navbar = new NavbarLight(root);
  const menu = root.querySelector('[data-mwp-menu]');
  const opened = waitForEvent(root, 'mwp-nav:opened');
  menu.open = true;
  await opened;

  const closed = waitForEvent(root, 'mwp-nav:closed');
  root.querySelector('a').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  await closed;
  assert.equal(menu.open, false);
  navbar.destroy();
});

test('closes on an outside click when enabled', async () => {
  const root = document.querySelector('[data-mwp-navbar]');
  const navbar = new NavbarLight(root);
  const menu = root.querySelector('[data-mwp-menu]');
  const opened = waitForEvent(root, 'mwp-nav:opened');
  menu.open = true;
  await opened;

  const closed = waitForEvent(root, 'mwp-nav:closed');
  document.body.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  await closed;
  assert.equal(menu.open, false);
  navbar.destroy();
});

test('backdrop closes the menu and restores trigger focus', async () => {
  const root = document.querySelector('[data-mwp-navbar]');
  const navbar = new NavbarLight(root);
  const menu = root.querySelector('[data-mwp-menu]');
  const trigger = root.querySelector('[data-mwp-trigger]');
  const opened = waitForEvent(root, 'mwp-nav:opened');
  menu.open = true;
  await opened;

  const closed = waitForEvent(root, 'mwp-nav:closed');
  root.querySelector('[data-mwp-backdrop]').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  await closed;
  assert.equal(menu.open, false);
  assert.equal(document.activeElement, trigger);
  navbar.destroy();
});

test('locks scrolling for drawer layouts and restores prior styles', async () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.dataset.layout = 'right';
  document.documentElement.style.overflow = 'clip';
  const navbar = new NavbarLight(root);
  const menu = root.querySelector('[data-mwp-menu]');

  const opened = waitForEvent(root, 'mwp-nav:opened');
  menu.open = true;
  await opened;
  assert.equal(document.documentElement.dataset.mwpScrollLocked, 'true');
  assert.equal(document.documentElement.style.overflow, 'hidden');

  const closed = waitForEvent(root, 'mwp-nav:closed');
  menu.open = false;
  await closed;
  assert.equal(document.documentElement.dataset.mwpScrollLocked, undefined);
  assert.equal(document.documentElement.style.overflow, 'clip');
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

test('infers expanded mode from the variant-controlled menu wrapper', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.removeAttribute('data-collapse');
  root.querySelector('[data-mwp-menu]').style.display = 'none';
  const navbar = new NavbarLight(root);

  assert.equal(root.dataset.mwpCollapsed, 'false');
  assert.equal(root.dataset.state, 'expanded');
  assert.equal(root.querySelector('[data-mwp-menu]').open, true);
  navbar.destroy();
});

test('uses Webflow native variant markers for collapse detection', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.removeAttribute('data-collapse');
  root.setAttribute('data-wf--navbar-light--variant', 'tablet');
  const navbar = new NavbarLight(root);

  assert.equal(root.dataset.mwpCollapsed, 'false');
  assert.equal(root.dataset.state, 'expanded');
  navbar.destroy();
});

test('preserves standalone root configuration', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.dataset.layout = 'overlay';
  root.dataset.motion = 'fade';
  root.dataset.panelWidth = '20rem';
  root.dataset.closeDuration = '12ms';
  root.dataset.stagger = '40ms';
  root.dataset.iconDuration = '180ms';
  root.dataset.submenuIconDuration = '160ms';
  root.dataset.submenuIconEasing = 'linear';
  root.dataset.submenuIconRotation = '90deg';
  root.setAttribute('data-close-on-link', 'false');
  const navbar = new NavbarLight(root);

  assert.equal(root.dataset.layout, 'overlay');
  assert.equal(root.dataset.motion, 'fade');
  assert.equal(root.getAttribute('data-close-on-link'), 'false');
  assert.equal(root.style.getPropertyValue('--mwp-nav-panel-width'), '20rem');
  assert.equal(root.style.getPropertyValue('--mwp-nav-duration-close'), '12ms');
  assert.equal(root.style.getPropertyValue('--mwp-nav-stagger'), '40ms');
  assert.equal(root.style.getPropertyValue('--mwp-nav-icon-duration'), '180ms');
  assert.equal(root.style.getPropertyValue('--mwp-nav-submenu-icon-duration'), '160ms');
  assert.equal(root.style.getPropertyValue('--mwp-nav-submenu-icon-ease'), 'linear');
  assert.equal(root.style.getPropertyValue('--mwp-nav-submenu-icon-rotation'), '90deg');
  navbar.destroy();
});

test('reads Canvas-visible configuration values and normalises presets', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.dataset.collapse = 'always';
  root.removeAttribute('data-close-on-outside');
  root.querySelector('[data-mwp-menu]').dataset.mwpMotion = 'mwp-motion-left';
  root.insertAdjacentHTML('beforeend', `
    <div data-mwp-config>
      <div data-mwp-config-value="layout">mwp-layout-overlay</div>
      <div data-mwp-config-value="alignment">left</div>
      <div data-mwp-config-value="iconLines">2</div>
      <div data-mwp-config-value="submenuIconDuration">240ms</div>
      <div data-mwp-config-value="submenuIconEasing">ease-in-out</div>
      <div data-mwp-config-value="submenuIconRotation">135deg</div>
      <div data-mwp-config-value="closeOutside">false</div>
    </div>`);
  const navbar = new NavbarLight(root);

  assert.equal(root.dataset.layout, 'overlay');
  assert.equal(root.dataset.motion, 'left');
  assert.equal(root.dataset.align, 'left');
  assert.equal(root.dataset.iconLines, '2');
  assert.equal(root.style.getPropertyValue('--mwp-nav-submenu-icon-duration'), '240ms');
  assert.equal(root.style.getPropertyValue('--mwp-nav-submenu-icon-ease'), 'ease-in-out');
  assert.equal(root.style.getPropertyValue('--mwp-nav-submenu-icon-rotation'), '135deg');
  assert.equal(root.getAttribute('data-close-on-outside'), 'false');
  assert.equal(root.dataset.mwpReady, 'true');
  navbar.destroy();
});
