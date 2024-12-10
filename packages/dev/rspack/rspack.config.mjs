import browser from './browser.mjs';
import server from './server.mjs';
import devServer from './devServer.mjs';
import startServer from './startServer.mjs';

const config = (env, options) => {
  return [
    !env.RSPACK_BUNDLE && devServer,
    browser(env, options),
    server(env, options),
    !env.RSPACK_BUNDLE && startServer,
  ].filter(Boolean);
};

export default config;
