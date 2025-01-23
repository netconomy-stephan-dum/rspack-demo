import sources from 'webpack-sources';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const { RawSource } = sources;
const pluginName = 'SVGPlugin';

const svgTemplate = readFileSync(path.join(import.meta.dirname, './template.svg'), 'utf-8');

const createSVGChunk = (assets, svgFiles) => {
  const symbols = [];

  // sort is need to keep contentHash stable
  const usages = [];
  svgFiles.sort().forEach((filePath) => {
    const [id] = path.basename(filePath, '.svg').split('_');

    usages.push(`<use id="${id}" xlink:href="#${id}-symbol"></use>`);

    symbols.push(
      assets[filePath]
        .source()
        .toString()
        .replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/, '')
        .replace(/^<svg/, `<symbol id="${id}-symbol" `)
        .replace(/\s+/, ' ')
        .replace(/<\/svg>$/, '</symbol>'),
    );
  });

  return svgTemplate
    .replace('<!-- @symbols@ -->', symbols.join(''))
    .replace('<!-- @usages@ -->', usages.join(''));
};

const replaceSpriteName = (files, spriteName, assets, regExp) => {
  files.forEach((chunkFile) => {
    if (!regExp || regExp.test(chunkFile)) {
      assets[chunkFile] = new RawSource(
        assets[chunkFile]
          .source()
          .toString()
          .replace(/__sprite_name__/g, `${spriteName}`),
      );
    }
  });
};

class SVGPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapPromise(pluginName, () => {
        debugger;
        const { chunks, assets } = compilation;

        chunks.forEach(({ name, files, auxiliaryFiles }) => {
          if (!name) {
            return null;
          }

          replaceSpriteName(files, name, assets, /\.js(\?.+)?$/u);

          const fileRegEx = new RegExp(`\\.svg(?:\\?.*)?$`, 'u');
          const svgFiles = Array.from(auxiliaryFiles).filter((assetFile) =>
            fileRegEx.test(assetFile),
          );

          if (!svgFiles.length) {
            return;
          }

          compilation.assets[`assets/svg/${name}.svg`] = new RawSource(
            createSVGChunk(compilation.assets, svgFiles),
          );

          svgFiles.forEach((file) => {
            compilation.deleteAsset(file);
          });
        });

        return Promise.resolve();
      });
    });
  }
}

export default SVGPlugin;
