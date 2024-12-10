import { CssExtractRspackPlugin, DefinePlugin } from '@rspack/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { createRequire } from 'node:module';
import LoadablePlugin from '@loadable/webpack-plugin';
import ReactRefreshRspackPlugin from '@rspack/plugin-react-refresh';
const { resolve } = createRequire(import.meta.url);

const config = ({ RSPACK_BUILD }, { target }) => {
  const isProduction = RSPACK_BUILD;

  return {
    mode: isProduction ? 'production' : 'development',
    target,
    resolve: {
      extensions: ['.jsx', '.tsx', '...'],
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|woff2?|svg|webp)$/,
          type: 'asset',
          generator: { emit: target === 'web' },
        },
        {
          test: /\.((css)|s[ca]ss)$/,
          use: [
            target === 'web' && CssExtractRspackPlugin.loader,
            {
              loader: resolve('css-loader'),
              options: {
                modules: {
                  namedExport: false,
                  exportOnlyLocals: target === 'node',
                },
              },
            },
            {
              loader: 'builtin:lightningcss-loader',
            },
          ].filter(Boolean),
        },
        {
          test: /\.[jt]sx?$/,
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
                  development: !isProduction,
                  refresh: !isProduction && target !== 'node',
                },
              },
              experimental: {
                plugins: [['@swc/plugin-loadable-components', {}]],
              },
            },
          },
        },
      ],
    },
    plugins: [
      new DefinePlugin({
        IS_PROD: isProduction,
        APP_ROOT: JSON.stringify(`${process.env.CWD}/src/App`),
      }),
      !isProduction && new ReactRefreshRspackPlugin(),
      process.env.RSDOCTOR &&
        new RsdoctorRspackPlugin({
          linter: {
            rules: {
              'ecma-version-check': 'off',
            },
          },
          supports: {
            generateTileGraph: true,
          },
        }),
    ].filter(Boolean),
  };
};

export default config;
