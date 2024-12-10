#!/usr/bin/env node

import { spawn } from 'node:child_process';

import { createCommand, program } from 'commander';

const options = {
  shell: true,
  stdio: 'inherit',
  cwd: import.meta.dirname,
  env: { CWD: process.cwd() },
};

program.command('serve').action(() => {
  spawn('yarn', ['exec', 'rspack', 'serve'], options);
});
program.command('build').action(() => {
  spawn('yarn', ['exec', 'rspack', 'build'], options);
});

await program.parseAsync();
