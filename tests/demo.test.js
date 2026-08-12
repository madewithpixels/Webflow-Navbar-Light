import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const demoUrl = new URL('../demo/index.html', import.meta.url);

test('demo initializes when opened directly from the filesystem', async () => {
  const dom = await JSDOM.fromFile(fileURLToPath(demoUrl), {
    resources: 'usable',
    runScripts: 'dangerously',
    url: demoUrl.href,
    beforeParse(window) {
      window.CSS = { supports: () => true };
      window.matchMedia = () => ({
        matches: false,
        addEventListener() {},
        removeEventListener() {}
      });
    }
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Demo did not load')), 2000);
    dom.window.addEventListener('load', () => {
      clearTimeout(timeout);
      resolve();
    }, { once: true });
  });

  const root = dom.window.document.querySelector('[data-mwp-navbar]');
  assert.equal(root.dataset.mwpReady, 'true');
  assert.equal(typeof dom.window.NavbarLight, 'function');
  assert.equal(root.dataset.state, 'expanded');

  const layout = dom.window.document.querySelector('[name="layout"]');
  layout.value = 'overlay';
  layout.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  assert.equal(root.dataset.layout, 'overlay');

  const collapse = dom.window.document.querySelector('[name="collapse"]');
  collapse.value = 'always';
  collapse.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  assert.equal(dom.window.getComputedStyle(root.querySelector('[data-mwp-panel]')).display, 'grid');
  const submenu = root.querySelector('[data-mwp-submenu]');
  const submenuList = root.querySelector('.mwp-css-nav_submenu-list');
  assert.equal(dom.window.getComputedStyle(submenuList).display, 'none');
  submenu.open = true;
  assert.equal(dom.window.getComputedStyle(submenuList).display, 'grid');
  assert.ok(submenu.querySelector('[data-mwp-submenu-icon]'));
  assert.equal(root.querySelectorAll('.mwp-css-nav_secondary a').length, 9);

  layout.value = 'dropdown';
  layout.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  dom.window.document.querySelector('#navbar-toggle').click();
  assert.equal(root.querySelector('[data-mwp-menu]').open, true);

  dom.window.close();
});
