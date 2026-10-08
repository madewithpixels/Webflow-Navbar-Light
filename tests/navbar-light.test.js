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

test('navbar stacking default permits a project wrapper to supply its z-index token', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  const rootRule = css.match(/:where\(\[data-mwp-navbar\]\)\s*\{([^}]*)\}/)?.[1];
  assert.ok(rootRule, 'Expected the low-specificity navbar root rule');
  assert.match(rootRule, /z-index:\s*var\(--mwp-nav-z-index,\s*100\)/);
  assert.doesNotMatch(rootRule, /--mwp-nav-z-index\s*:/, 'A root token default would override an inherited project token');
});

test('enhanced panel state works after wrapping the trigger while native siblings remain supported', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  const stateSelector = '[data-mwp-navbar][data-mwp-collapsed="true"]:not([data-motion="custom"]) [data-mwp-panel]:is([data-state="opening"], [data-state="open"])';
  assert.ok(css.includes(`${stateSelector} {`));
  assert.match(css, /\[data-mwp-menu\]\[open\] \+ \[data-mwp-panel\]/);

  const wrapped = new JSDOM('<header data-mwp-navbar data-mwp-collapsed="true"><div><details data-mwp-menu open><summary>Menu</summary></details></div><nav data-mwp-panel data-state="opening"></nav></header>');
  const panel = wrapped.window.document.querySelector('[data-mwp-panel]');
  assert.ok(panel.matches(stateSelector));
  assert.equal(wrapped.window.document.querySelector('[data-mwp-menu][open] + [data-mwp-panel]'), null);
  wrapped.window.close();

  const native = new JSDOM('<header data-mwp-navbar><details data-mwp-menu open><summary>Menu</summary></details><nav data-mwp-panel></nav></header>');
  assert.ok(native.window.document.querySelector('[data-mwp-menu][open] + [data-mwp-panel]'));
  native.window.close();
});

test('native details and enhanced wrapped trigger both reveal the panel through CSS', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  const fixture = new JSDOM(`<style>${css}</style>
    <header data-mwp-navbar data-collapse="always">
      <details data-mwp-menu><summary data-mwp-trigger>Menu</summary></details>
      <nav data-mwp-panel>Native links</nav>
    </header>
    <header data-mwp-navbar data-mwp-collapsed="true" data-state="closed">
      <div><details data-mwp-menu><summary data-mwp-trigger>Menu</summary></details></div>
      <nav data-mwp-panel data-state="closed">Wrapped links</nav>
    </header>`);
  const [nativeRoot, wrappedRoot] = fixture.window.document.querySelectorAll('[data-mwp-navbar]');
  const nativePanel = nativeRoot.querySelector('[data-mwp-panel]');
  const wrappedPanel = wrappedRoot.querySelector('[data-mwp-panel]');
  const appearance = (panel) => {
    const style = fixture.window.getComputedStyle(panel);
    return [style.opacity, style.visibility, style.pointerEvents];
  };

  assert.deepEqual(appearance(nativePanel), ['0', 'hidden', 'none']);
  assert.deepEqual(appearance(wrappedPanel), ['0', 'hidden', 'none']);

  nativeRoot.querySelector('[data-mwp-menu]').open = true;
  assert.deepEqual(appearance(nativePanel), ['1', 'visible', 'auto']);

  wrappedRoot.dataset.state = 'opening';
  wrappedPanel.dataset.state = 'opening';
  assert.deepEqual(appearance(wrappedPanel), ['1', 'visible', 'auto']);
  wrappedRoot.dataset.state = 'open';
  wrappedPanel.dataset.state = 'open';
  assert.deepEqual(appearance(wrappedPanel), ['1', 'visible', 'auto']);
  fixture.window.close();
});

test('current Webflow component markers retain CSS-only Always behavior', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  for (const marker of ['data-wf--smashburger--variant', 'data-wf--smashburger-cdn--variant']) {
    const fixture = new JSDOM(`<style>${css}</style><header data-mwp-navbar ${marker}="always">
      <details data-mwp-menu><summary data-mwp-trigger>Menu</summary></details>
      <nav data-mwp-panel>Links</nav>
    </header>`);
    const panel = fixture.window.document.querySelector('[data-mwp-panel]');
    assert.equal(fixture.window.getComputedStyle(panel).visibility, 'hidden');
    fixture.window.document.querySelector('[data-mwp-menu]').open = true;
    assert.equal(fixture.window.getComputedStyle(panel).visibility, 'visible');
    fixture.window.close();
  }
});

test('an explicit collapse setting overrides a conflicting Webflow marker in CSS', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  const fixture = new JSDOM(`<style>${css}</style>
    <header data-mwp-navbar data-collapse="never" data-mwp-collapsed="false" data-wf--smashburger-cdn--variant="always">
      <details data-mwp-menu><summary data-mwp-trigger>Menu</summary></details>
      <nav data-mwp-panel>Links</nav>
    </header>`);
  const panel = fixture.window.document.querySelector('[data-mwp-panel]');
  const trigger = fixture.window.document.querySelector('[data-mwp-trigger]');
  assert.equal(fixture.window.getComputedStyle(panel).visibility, 'visible');
  assert.equal(fixture.window.getComputedStyle(trigger).display, 'none');
  fixture.window.close();
});

test('Dropdown and Full width backdrops require an explicit source opt-in', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  const optIn = '[data-mwp-navbar][data-mwp-collapsed="true"][data-backdrop="true" i]:where([data-layout="dropdown"], [data-layout="full-width"]):is([data-state="opening"], [data-state="open"]) [data-mwp-backdrop]';
  assert.ok(css.includes(`${optIn},`));
  const fixture = new JSDOM('<header data-mwp-navbar data-mwp-collapsed="true" data-layout="dropdown" data-state="open"><div data-mwp-backdrop></div></header>');
  const backdrop = fixture.window.document.querySelector('[data-mwp-backdrop]');
  assert.equal(backdrop.matches(optIn), false);
  fixture.window.document.querySelector('header').dataset.backdrop = 'true';
  assert.equal(backdrop.matches(optIn), true);
  fixture.window.document.querySelector('header').dataset.backdrop = 'True';
  assert.equal(backdrop.matches(optIn), true);
  fixture.window.document.querySelector('header').dataset.layout = 'full-width';
  assert.equal(backdrop.matches(optIn), true);
  fixture.window.close();
});

test('overlay keeps its trigger in the authored header position while drawers retain their close control', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  const fixture = new JSDOM(`<style>${css}</style><style>.desktop-pill { display: flex; }</style>
    <header data-mwp-navbar data-mwp-collapsed="true" data-layout="overlay" data-align="center" data-state="closed">
      <div data-mwp-inner><details data-mwp-menu><summary data-mwp-trigger>Menu</summary></details>
        <nav data-mwp-panel class="desktop-pill">Links</nav></div>
    </header>`);
  const root = fixture.window.document.querySelector('[data-mwp-navbar]');
  const menu = root.querySelector('[data-mwp-menu]');
  const position = () => fixture.window.getComputedStyle(menu).position;

  assert.equal(position(), 'relative');
  assert.equal(fixture.window.getComputedStyle(root.querySelector('[data-mwp-panel]')).display, 'grid');
  assert.equal(fixture.window.getComputedStyle(root.querySelector('[data-mwp-panel]')).translate, 'none');
  root.dataset.mwpCollapsed = 'false';
  menu.open = true;
  assert.equal(fixture.window.getComputedStyle(root.querySelector('[data-mwp-panel]')).display, 'flex', 'Expanded desktop panel lost its authored layout after the menu opened');
  menu.open = false;
  root.dataset.mwpCollapsed = 'true';
  for (const state of ['opening', 'open', 'closing']) {
    root.dataset.state = state;
    assert.equal(position(), 'relative', `Overlay trigger moved during ${state}`);
    assert.equal(fixture.window.getComputedStyle(menu).zIndex, '4');
  }

  for (const layout of ['left', 'right']) {
    root.dataset.layout = layout;
    assert.equal(position(), 'fixed', `${layout} drawer lost its close control`);
  }
  fixture.window.close();
});

test('stock image icons inherit link colour unless original artwork or custom presets are requested', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  const fixture = new JSDOM(`<style>${css}</style>
    <header data-mwp-navbar data-mwp-collapsed="true" data-layout="overlay">
      <div data-mwp-secondary><a data-mwp-item style="color: #a5268f"><img alt="" src="icon.svg"></a></div>
    </header>`);
  const root = fixture.window.document.querySelector('[data-mwp-navbar]');
  const icon = root.querySelector('img');
  const appearance = () => {
    const style = fixture.window.getComputedStyle(icon);
    return [style.color, style.filter, style.transform];
  };

  assert.deepEqual(appearance(), ['rgb(165, 38, 143)', 'drop-shadow(4rem 0 0 currentColor)', 'translateX(-4rem)']);
  root.dataset.iconMode = 'original';
  assert.deepEqual(appearance(), ['rgb(165, 38, 143)', '', '']);
  delete root.dataset.iconMode;
  root.dataset.presets = 'false';
  assert.deepEqual(appearance(), ['rgb(165, 38, 143)', '', '']);
  fixture.window.close();
});

test('optional backdrop is non-blocking until a collapsed layout opens', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  const fixture = new JSDOM(`<style>${css}</style>
    <header data-mwp-navbar data-mwp-collapsed="true" data-layout="dropdown" data-state="closed">
      <nav data-mwp-panel></nav><div data-mwp-backdrop></div>
    </header>`);
  const root = fixture.window.document.querySelector('[data-mwp-navbar]');
  const backdrop = root.querySelector('[data-mwp-backdrop]');
  const appearance = () => {
    const style = fixture.window.getComputedStyle(backdrop);
    return [style.opacity, style.visibility, style.pointerEvents, style.zIndex];
  };

  assert.deepEqual(appearance(), ['0', 'hidden', 'none', '1']);
  root.dataset.state = 'open';
  assert.deepEqual(appearance(), ['0', 'hidden', 'none', '1']);
  root.dataset.backdrop = 'true';
  assert.deepEqual(appearance(), ['1', 'visible', 'auto', '1']);
  root.dataset.layout = 'full-width';
  assert.deepEqual(appearance(), ['1', 'visible', 'auto', '1']);
  root.dataset.state = 'closed';
  assert.deepEqual(appearance(), ['0', 'hidden', 'none', '1']);
  fixture.window.close();
});

test('panel layout defaults stay below ordinary Webflow class styles', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  const panelLayoutProperty = /(?:^|;)\s*(?:display|position|inset|top|right|bottom|left|width|max-width|translate|transform-origin)\s*:/m;
  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  const layoutRules = [...css.matchAll(rulePattern)]
    .map(([, selector, declarations]) => ({
      selector: selector.replaceAll(/\/\*[\s\S]*?\*\//g, '').trim(),
      declarations
    }))
    .filter(({ selector, declarations }) => selector.includes('[data-mwp-panel]') && panelLayoutProperty.test(declarations));

  assert.ok(layoutRules.length > 0);
  for (const { selector, declarations } of layoutRules) {
    if (selector.includes('[data-layout="overlay"]') && /^\s*display:\s*grid\s*;\s*translate:\s*none\s*;?\s*$/.test(declarations.replaceAll(/\/\*[\s\S]*?\*\//g, ''))) continue;
    assert.match(selector, /^:where\(/, `Panel layout selector must have zero specificity: ${selector}`);
  }
  assert.doesNotMatch(css.replaceAll(/\/\*[\s\S]*?\*\//g, ''), /!important/);
});

test('custom motion keeps the panel hidden when closed and reserves time for GSAP', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  assert.match(css, /\[data-motion="custom"\] \[data-mwp-panel\],[\s\S]*?opacity:\s*0;[\s\S]*?visibility:\s*hidden;/);
  assert.match(css, /\[data-state="closed"\] \[data-mwp-panel\]\s*\{[\s\S]*?visibility:\s*hidden;/);
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

test('measures native icon thickness and gap for a centred open X', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.querySelector('[data-mwp-trigger]').innerHTML = `<span data-mwp-icon style="row-gap: 7px">
    <span data-mwp-line style="height: 3px"></span>
    <span data-mwp-line style="height: 3px"></span>
    <span data-mwp-line style="height: 3px"></span>
  </span>`;
  const navbar = new NavbarLight(root);
  assert.equal(root.style.getPropertyValue('--mwp-nav-icon-auto-shift'), '10px');

  root.querySelector('[data-mwp-icon]').style.rowGap = '9px';
  navbar.syncIconGeometry();
  assert.equal(root.style.getPropertyValue('--mwp-nav-icon-auto-shift'), '12px');
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

test('wrapped trigger drives panel state and closes with focus return', async () => {
  const root = document.querySelector('[data-mwp-navbar]');
  const menu = root.querySelector('[data-mwp-menu]');
  const panel = root.querySelector('[data-mwp-panel]');
  const trigger = root.querySelector('[data-mwp-trigger]');
  const wrapper = document.createElement('div');
  menu.replaceWith(wrapper);
  wrapper.append(menu);
  const navbar = new NavbarLight(root);

  const opened = waitForEvent(root, 'mwp-nav:opened');
  menu.open = true;
  await opened;
  assert.equal(panel.dataset.state, 'open');
  assert.equal(trigger.getAttribute('aria-expanded'), 'true');

  const closed = waitForEvent(root, 'mwp-nav:closed');
  document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await closed;
  assert.equal(panel.dataset.state, 'closed');
  assert.equal(document.activeElement, trigger);
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

test('Dropdown backdrop opt-in closes without automatic scroll lock', async () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.dataset.layout = 'dropdown';
  root.dataset.backdrop = 'true';
  document.documentElement.style.overflow = 'clip';
  const navbar = new NavbarLight(root);
  const menu = root.querySelector('[data-mwp-menu]');
  const trigger = root.querySelector('[data-mwp-trigger]');

  const opened = waitForEvent(root, 'mwp-nav:opened');
  menu.open = true;
  await opened;
  assert.equal(document.documentElement.style.overflow, 'clip');

  const closed = waitForEvent(root, 'mwp-nav:closed');
  root.querySelector('[data-mwp-backdrop]').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  await closed;
  assert.equal(menu.open, false);
  assert.equal(document.activeElement, trigger);
  assert.equal(document.documentElement.style.overflow, 'clip');
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

for (const marker of [
  'data-wf--navbar-light--variant',
  'data-wf--smashburger--variant',
  'data-wf--smashburger-cdn--variant',
  'data-wf--mwp-component-library--smashburger--variant',
  'data-wf--mwp-component-library--smashburger-cdn--variant'
]) {
  test(`uses ${marker} for collapse detection`, () => {
    const root = document.querySelector('[data-mwp-navbar]');
    root.removeAttribute('data-collapse');
    root.setAttribute(marker, 'mobile-landscape');
    globalThis.matchMedia = (query) => ({
      matches: query === '(max-width: 767px)',
      addEventListener() {},
      removeEventListener() {}
    });
    const navbar = new NavbarLight(root);

    assert.equal(root.hasAttribute('data-collapse'), false);
    assert.equal(root.dataset.mwpCollapsed, 'true');
    assert.equal(root.dataset.state, 'closed');
    navbar.destroy();
  });
}

test('a fresh CDN Mobile landscape instance expands at desktop width', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.removeAttribute('data-collapse');
  root.setAttribute('data-wf--smashburger-cdn--variant', 'mobile-landscape');
  const navbar = new NavbarLight(root);

  assert.equal(root.dataset.mwpCollapsed, 'false');
  assert.equal(root.dataset.state, 'expanded');
  assert.equal(root.querySelector('[data-mwp-menu]').open, true);
  navbar.destroy();
});

test('explicit collapse setting takes precedence over a Webflow variant marker', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.dataset.collapse = 'never';
  root.setAttribute('data-wf--smashburger-cdn--variant', 'always');
  const navbar = new NavbarLight(root);

  assert.equal(root.dataset.collapse, 'never');
  assert.equal(root.dataset.mwpCollapsed, 'false');
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

test('removes JavaScript transition waits when reduced motion is requested', () => {
  globalThis.matchMedia = (query) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    addEventListener() {},
    removeEventListener() {}
  });
  const root = document.querySelector('[data-mwp-navbar]');
  root.dataset.motion = 'dropdown';
  root.style.setProperty('--mwp-nav-duration-open', '280ms');
  root.style.setProperty('--mwp-nav-duration-close', '220ms');
  const navbar = new NavbarLight(root);

  assert.equal(navbar.motionDuration('open'), 0);
  assert.equal(navbar.motionDuration('close'), 0);
  navbar.destroy();
});

test('custom motion uses configured timing so a GSAP close can finish', () => {
  const root = document.querySelector('[data-mwp-navbar]');
  root.dataset.motion = 'custom';
  root.style.setProperty('--mwp-nav-duration-open', '280ms');
  root.style.setProperty('--mwp-nav-duration-close', '220ms');
  const navbar = new NavbarLight(root);

  assert.equal(navbar.motionDuration('open'), 280);
  assert.equal(navbar.motionDuration('close'), 220);
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

test('Layout presets can be switched off so destination classes own the collapsed look', () => {
  const css = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  const visualPanel = '[data-mwp-navbar][data-mwp-collapsed="true"]:not([data-presets="false" i]) [data-mwp-panel]';
  const structuralPanel = '[data-mwp-navbar][data-mwp-collapsed="true"] [data-mwp-panel]';
  assert.ok(css.includes(`${visualPanel} {`));
  assert.ok(css.includes(`${structuralPanel} {`));
  const structuralBody = css.split(`${structuralPanel} {`)[1].split('}')[0];
  assert.match(structuralBody, /overflow-y:\s*auto/);
  assert.doesNotMatch(structuralBody, /(^|;|\s)(background|border|box-shadow|padding|color)(-[a-z]+)?\s*:/);

  // Webflow emits booleans as True/False; the switch is case-insensitive and on by default.
  for (const [presets, expectPreset] of [['', true], ['data-presets="True"', true], ['data-presets="False"', false], ['data-presets="false"', false]]) {
    const fixture = new JSDOM(`<header data-mwp-navbar data-mwp-collapsed="true" ${presets}><nav data-mwp-panel></nav></header>`);
    const panel = fixture.window.document.querySelector('[data-mwp-panel]');
    assert.equal(panel.matches(visualPanel), expectPreset, presets || 'default');
    assert.equal(panel.matches(structuralPanel), true);
  }

  // Every visual preset declaration on a collapsed navbar must sit behind the switch.
  const ungated = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)]
    .filter(([, selector, body]) => /data-mwp-collapsed="true"/.test(selector) && !/data-presets/.test(selector)
      && /(^|;|\s)(background|border(-top|-left|-right)?|box-shadow|color|padding(-top|-left)?|gap|font-size|filter|text-align)\s*:/.test(body))
    .map(([, selector]) => selector.trim());
  assert.deepEqual(ungated, []);
});

test('Canvas helper hides a closed collapsed panel only on the Designer Canvas', () => {
  const css = readFileSync(new URL('../src/navbar-light-canvas.css', import.meta.url), 'utf8');
  const runtime = readFileSync(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
  assert.doesNotMatch(runtime, /wf-design-mode/, 'Canvas rules must not ship in the runtime CSS');
  const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)]
    .map(([, selector, body]) => ({ selector: selector.replaceAll(/\/\*[\s\S]*?\*\//g, '').trim(), body }));
  assert.ok(rules.length >= 6);
  for (const { selector } of rules) assert.match(selector, /^html\.wf-design-mode /, `Canvas-only selector: ${selector}`);
  const always = rules.find(({ selector }) => selector.includes('variant="always"')).selector;
  const cases = [
    ['wf-design-mode', 'data-collapse="always"', true],
    ['wf-design-mode', 'data-wf--smashburger--variant="always"', true],
    ['wf-design-mode', 'data-wf--mwp-component-library--smashburger-cdn--variant="always"', true],
    ['wf-design-mode', 'data-collapse="always" data-canvas-open="True"', false],
    ['wf-design-mode', 'data-collapse="never"', false],
    ['wf-design-mode', 'data-collapse="never" data-wf--smashburger--variant="always"', false],
    ['wf-inactive', 'data-collapse="always"', false],
    ['', 'data-wf--smashburger--variant="always"', false]
  ];
  for (const [htmlClass, rootAttrs, hidden] of cases) {
    const fixture = new JSDOM(`<html class="${htmlClass}"><body><header data-mwp-navbar ${rootAttrs}><nav data-mwp-panel></nav></header></body></html>`);
    assert.equal(fixture.window.document.querySelector('[data-mwp-panel]').matches(always), hidden, `${htmlClass} ${rootAttrs}`);
  }
  assert.ok(rules.some(({ selector, body }) => selector.endsWith('> [data-mwp-config]') && /display:\s*none/.test(body)));
  assert.doesNotMatch(css.replaceAll(/\/\*[\s\S]*?\*\//g, ''), /!important/);
  // Webflow shows a placeholder for any Embed whose code contains this text, even in a comment.
  assert.doesNotMatch(css, /<script/i);
  const embed = readFileSync(new URL('../webflow/navbar-light-canvas-embed.html', import.meta.url), 'utf8');
  assert.equal(embed, `<style>\n${css.trim()}\n</style>\n`);
});
