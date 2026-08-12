import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const build = spawnSync(process.execPath, ['scripts/build-dist.mjs'], {
  cwd: projectRoot,
  encoding: 'utf8'
});

if (build.status !== 0) {
  process.stderr.write(build.stderr || build.stdout);
  process.exit(build.status ?? 1);
}

const status = spawnSync('git', ['status', '--short', '--', 'dist'], {
  cwd: projectRoot,
  encoding: 'utf8'
});

if (status.status !== 0 || status.stdout.trim()) {
  process.stderr.write(status.stdout || status.stderr);
  process.stderr.write('\nRun `npm run build:dist` and commit the refreshed dist files.\n');
  process.exit(status.status || 1);
}

process.stdout.write('Committed dist files match the maintained source.\n');
