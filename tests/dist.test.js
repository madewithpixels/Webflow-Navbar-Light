import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const root = resolve(import.meta.dirname, '..');

test('release artifacts are versioned, browser-ready and mapped to source', async () => {
  const packageMetadata = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const paths = {
    css: 'dist/navbar-light.css',
    minCss: 'dist/navbar-light.min.css',
    js: 'dist/navbar-light.js',
    minJs: 'dist/navbar-light.min.js'
  };
  const artifacts = Object.fromEntries(
    await Promise.all(Object.entries(paths).map(async ([name, path]) => [name, await readFile(resolve(root, path), 'utf8')]))
  );

  for (const source of Object.values(artifacts)) {
    assert.match(source, new RegExp(`Navbar Light v${packageMetadata.version.replaceAll('.', '\\.')}`));
  }
  assert.ok(artifacts.minCss.length < artifacts.css.length);
  assert.ok(artifacts.minJs.length < artifacts.js.length);
  assert.doesNotMatch(artifacts.js, /^export /m);

  for (const path of Object.values(paths)) {
    const map = JSON.parse(await readFile(resolve(root, `${path}.map`), 'utf8'));
    assert.ok(map.sources.length > 0);
    assert.ok(map.sourcesContent?.some(Boolean));
  }

  const dom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'dangerously' });
  dom.window.eval(artifacts.js);
  assert.equal(typeof dom.window.NavbarLight, 'function');
  assert.equal(typeof dom.window.initNavbarLight, 'function');
  assert.equal(dom.window.MWP_NAVBAR_LIGHT_VERSION, packageMetadata.version);
  dom.window.close();
});
