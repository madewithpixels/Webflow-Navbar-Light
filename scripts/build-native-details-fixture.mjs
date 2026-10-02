import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/navbar-light.css', import.meta.url), 'utf8');
const markup = await readFile(new URL('../webflow/fixtures/native-details.html', import.meta.url), 'utf8');

process.stdout.write(`<!-- SmashBurger native CSS-only regression fixture; generated from maintained source. -->\n<style>\n${css}\n</style>\n${markup}`);
