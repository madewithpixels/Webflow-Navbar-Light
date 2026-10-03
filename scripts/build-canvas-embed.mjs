import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// The Canvas helper is a separate style-only Embed: Webflow never renders an
// Embed containing <script> on the Designer Canvas.
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = await readFile(resolve(projectRoot, 'src/navbar-light-canvas.css'), 'utf8');
await writeFile(resolve(projectRoot, 'webflow/navbar-light-canvas-embed.html'), `<style>\n${css.trim()}\n</style>\n`);
