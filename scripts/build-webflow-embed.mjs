import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = await readFile(resolve(projectRoot, 'src/navbar-light.css'), 'utf8');
const moduleSource = await readFile(resolve(projectRoot, 'src/navbar-light.js'), 'utf8');
const browserSource = moduleSource
  .replace(/^export class /m, 'class ')
  .replace(/^export function /m, 'function ');

const embed = `<style>\n${css.trim()}\n</style>\n<script>\n${browserSource.trim()}\n</script>\n`;
await writeFile(resolve(projectRoot, 'webflow/navbar-light-embed.html'), embed);
