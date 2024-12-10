import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin';
import { join } from 'node:path';

const outputPath = join(process.env.CWD, './dist/server');

const config = {
  entry: {},
  dependencies: ['server', 'web'],
  output: {
    path: outputPath,
    publicPath: '/',
  },
  plugins: [
    new RunScriptWebpackPlugin({
      autoRestart: true,
      name: 'main.js',
      nodeArgs: ['--inspect'],
    }),
  ],
};

export default config;
