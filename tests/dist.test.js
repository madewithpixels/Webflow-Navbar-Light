import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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

test('CDN loader pins the release tag and authenticates the committed artifacts', async () => {
  const packageMetadata = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const loader = await readFile(resolve(root, 'webflow/navbar-light-cdn-loader.html'), 'utf8');
  const tag = `v${packageMetadata.version}`;
  const expectedBase = `https://cdn.jsdelivr.net/gh/madewithpixels/Webflow-Navbar-Light@${tag}/dist`;
  const integrity = (source) => `sha384-${createHash('sha384').update(source).digest('base64')}`;
  const css = await readFile(resolve(root, 'dist/navbar-light.min.css'));
  const javascript = await readFile(resolve(root, 'dist/navbar-light.min.js'));

  assert.match(loader, new RegExp(`${expectedBase.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}/navbar-light\\.min\\.css`));
  assert.match(loader, new RegExp(`${expectedBase.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}/navbar-light\\.min\\.js`));
  assert.match(loader, new RegExp(integrity(css).replaceAll('+', '\\+')));
  assert.match(loader, new RegExp(integrity(javascript).replaceAll('+', '\\+')));
  assert.doesNotMatch(loader, /@(latest|main|master)|@\d+\.x|@\^|@~/i);
  assert.match(loader, /mwp-navbar-light:cdn-error/g);
});
