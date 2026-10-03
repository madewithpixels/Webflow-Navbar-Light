import { spawnSync } from 'node:child_process';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const generated = [
  'demo/navbar-light.browser.js',
  'webflow/navbar-light-embed.html',
  'webflow/navbar-light-cdn-loader.html',
  'webflow/navbar-light-canvas-embed.html',
  ...['navbar-light.css', 'navbar-light.min.css', 'navbar-light.js', 'navbar-light.min.js']
    .flatMap((name) => [`dist/${name}`, `dist/${name}.map`])
];
const originals = await Promise.all(generated.map(async (name) => {
  try {
    return await readFile(resolve(projectRoot, name));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}));

try {
  const build = spawnSync(process.execPath, ['scripts/build-all.mjs'], {
    cwd: projectRoot,
    encoding: 'utf8'
  });

  if (build.status !== 0) {
    process.stderr.write(build.stderr || build.stdout);
    process.exitCode = build.status ?? 1;
  } else {
    const status = spawnSync('git', [
      'status',
      '--short',
      '--',
      'dist',
      'demo/navbar-light.browser.js',
      'webflow/navbar-light-embed.html',
      'webflow/navbar-light-cdn-loader.html',
      'webflow/navbar-light-canvas-embed.html'
    ], {
      cwd: projectRoot,
      encoding: 'utf8'
    });

    if (status.status !== 0 || status.stdout.trim()) {
      process.stderr.write(status.stdout || status.stderr);
      process.stderr.write('\nRun `npm run build` and commit the refreshed generated files.\n');
      process.exitCode = status.status || 1;
    } else {
      process.stdout.write('Committed Webflow and CDN files match the maintained source.\n');
    }
  }
} finally {
  await Promise.all(generated.map((name, index) => {
    const path = resolve(projectRoot, name);
    return originals[index] === null ? rm(path, { force: true }) : writeFile(path, originals[index]);
  }));
}
