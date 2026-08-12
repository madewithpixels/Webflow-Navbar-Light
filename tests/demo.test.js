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

  dom.window.close();
});
