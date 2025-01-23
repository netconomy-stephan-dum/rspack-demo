import { createRequire } from 'node:module';
import { join } from 'node:path';
import { HtmlRspackPlugin } from '@rspack/core';

const { resolve } = createRequire(import.meta.url);

const config = (env, options) => {
  const isDevelopment = env.RSPACK_SERVE;

  return {
    mode: isDevelopment ? 'development' : 'production',
    target: 'web',
    entry: {
      main: resolve('./index.tsx'),
    },
    output: {
      path: join(process.cwd(), './dist'),
    },
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDevelopment,
                },
              },
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlRspackPlugin({
        template: resolve('./index.html'),
      }),
    ],
  };
};

export default config;
