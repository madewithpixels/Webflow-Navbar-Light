import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const css = await readFile(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
const markup = await readFile(new URL('../webflow/fixtures/enhanced-layout.html', import.meta.url), 'utf8');
const javascript = await build({
  entryPoints: [fileURLToPath(new URL('../src/navbar-light.js', import.meta.url))],
  bundle: true,
  minify: true,
  format: 'iife',
  write: false,
});

process.stdout.write(`<!-- SmashBurger enhanced-layout regression fixture; generated from maintained source. -->\n<style>\n${css}\n</style>\n${markup}\n<script>\n${javascript.outputFiles[0].text}\n</script>`);
