#!/usr/bin/env node

import { spawn } from 'node:child_process';

import { createCommand, program } from 'commander';

const options = {
  shell: true,
  stdio: 'inherit',
  cwd: import.meta.dirname,
  env: { CWD: process.cwd() },
};

program
  .command('serve')
  .option('--inspect', 'enable debugging', false)
  .action(({ inspect }) => {
    spawn('yarn', ['run', inspect && '--inspect-brk', 'rspack', 'serve'].filter(Boolean), options);
  });
program.command('build').action(() => {
  spawn('yarn', ['exec', 'rspack', 'build'], options);
});

await program.parseAsync();
