import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageMetadata = JSON.parse(await readFile(resolve(projectRoot, 'package.json'), 'utf8'));
const version = packageMetadata.version;
const tag = `v${version}`;
const baseUrl = `https://cdn.jsdelivr.net/gh/madewithpixels/Webflow-Navbar-Light@${tag}/dist`;
const css = await readFile(resolve(projectRoot, 'dist/navbar-light.min.css'));
const javascript = await readFile(resolve(projectRoot, 'dist/navbar-light.min.js'));
const integrity = (source) => `sha384-${createHash('sha384').update(source).digest('base64')}`;

const loader = `<!-- Navbar Light CDN loader: exact version ${version} (${tag}) -->
<link
  rel="stylesheet"
  href="${baseUrl}/navbar-light.min.css"
  integrity="${integrity(css)}"
  crossorigin="anonymous"
  data-mwp-navbar-light-cdn="css"
  data-mwp-navbar-light-version="${version}"
  onload="this.dataset.mwpStatus='loaded'"
  onerror="this.dataset.mwpStatus='error';window.dispatchEvent(new CustomEvent('mwp-navbar-light:cdn-error',{detail:{asset:'css',version:'${version}'}}));console.error('Navbar Light ${version}: CDN CSS failed to load; native navigation content remains available.')">
<script
  defer
  src="${baseUrl}/navbar-light.min.js"
  integrity="${integrity(javascript)}"
  crossorigin="anonymous"
  data-mwp-navbar-light-cdn="javascript"
  data-mwp-navbar-light-version="${version}"
  onload="this.dataset.mwpStatus='loaded'"
  onerror="this.dataset.mwpStatus='error';window.dispatchEvent(new CustomEvent('mwp-navbar-light:cdn-error',{detail:{asset:'javascript',version:'${version}'}}));console.error('Navbar Light ${version}: CDN JavaScript failed to load; native details behavior remains available.')"></script>
`;

await writeFile(resolve(projectRoot, 'webflow/navbar-light-cdn-loader.html'), loader);
