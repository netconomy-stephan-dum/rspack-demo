import { join } from 'node:path';

const config = {
  name: 'dev-server',
  entry: {},
  infrastructureLogging: { level: 'error' },
  devServer: {
    static: join(process.cwd(), './dist/web'),
    historyApiFallback: true,
    liveReload: false,
    devMiddleware: {
      writeToDisk: true,
    },
  },
};

export default config;
