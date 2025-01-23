import { join } from 'node:path';
import { createRequire } from 'node:module';
import { defineConfig } from '@rspack/cli';
import { HtmlRspackPlugin, CopyRspackPlugin, CssExtractRspackPlugin } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import createCommonConfig from './common.mjs';
import LoadablePlugin from '@loadable/webpack-plugin';

const { resolve } = createRequire(import.meta.url);

const config = (env, options) => {
  const { mode } = options;
  const isProduction = mode === 'production';
  const outputPath = join(process.env.CWD, './dist/web');
  const commonConfig = createCommonConfig(env, { ...options, target: 'web' });

  return defineConfig(
    Object.assign(commonConfig, {
      name: 'web',
      target: 'web',
      entry: {
        main: resolve('@runtime/browser/index.tsx'),
      },
      output: {
        path: outputPath,
        publicPath: '/',
        clean: true,
      },
      plugins: [
        ...(commonConfig.plugins || []),
        !isProduction && new ReactRefreshPlugin({ overlay: false }),
        new LoadablePlugin(),
        new CssExtractRspackPlugin(),
        new CopyRspackPlugin({
          patterns: [
            {
              from: join(process.env.CWD, './static'),
              context: 'static',
              to: outputPath,
            },
          ],
        }),
        new HtmlRspackPlugin({
          template: resolve('./index.html'),
        }),
      ].filter(Boolean),
    }),
  );
};

export default config;
