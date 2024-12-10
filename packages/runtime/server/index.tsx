import { createServer, ServerResponse } from 'node:http';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReadStream } from 'node:fs';
import { lstat } from 'fs/promises';

import { createGzip, constants } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fileExists = (filePath: string) =>
  lstat(filePath).then(
    (stats) => stats.isFile(),
    () => false,
  );

const TTL = 60 * 60 * 24 * 365; // one year
const compress = (inputStream: Readable, response: ServerResponse) => {
  response.setHeader('Cache-Control', `max-age=${TTL}`);
  response.setHeader('Content-Encoding', 'gzip');

  inputStream
    .pipe(
      createGzip({
        flush: constants.Z_PARTIAL_FLUSH,
      }),
    )
    .pipe(response);
};

(async () => {
  const App = (await import(/* webpackMode: "eager" */ APP_ROOT)).default;
  const template = (await readFile(join(__dirname, `./template.html`))).toString();

  const statsFile = join(process.env.CWD || '', './dist/web/loadable-stats.json');
  const lang = 'de';
  const logger = console;
  const PORT = 8100;

  const server = createServer(async (request, response) => {
    const { url = '' } = request;
    const { pathname } = new URL(url);

    logger.info(url);

    const filePath = join(process.env.CWD || '', 'dist/web', pathname.slice(1));

    if (await fileExists(filePath)) {
      return compress(createReadStream(filePath), response);
    }

    const extractor = new ChunkExtractor({ statsFile });
    const jsx = extractor.collectChunks(<App />);
    const body = renderToString(jsx);
    const scriptTags = extractor.getScriptTags();
    const styleTags = await extractor.getInlineStyleTags();

    const html = template
      .replace('{{lang}}', lang)
      .replace('{{head}}', styleTags)
      .replace('{{body}}', body)
      .replace('{{tail}}', scriptTags);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');

    return compress(Readable.from(html), response);
  });

  server.listen(PORT, () => {
    logger.info(`The server is running at http://location:${PORT}`);
  });
})();
