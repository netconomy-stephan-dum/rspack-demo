import { join } from 'node:path';
import { createRequire } from 'node:module';

import createCommonConfig from './common.mjs';

const { resolve } = createRequire(import.meta.url);

const config = (env, options) => {
  const outputPath = join(process.env.CWD, './dist/server');
  const commonConfig = createCommonConfig(env, { target: 'node', ...options });

  return Object.assign(commonConfig, {
    name: 'server',
    target: 'node',
    entry: {
      main: resolve('@runtime/server/index.tsx'),
    },
    output: {
      path: outputPath,
      publicPath: '/',
    },
  });
};

export default config;
