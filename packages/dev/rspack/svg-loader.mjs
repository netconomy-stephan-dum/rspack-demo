import { basename } from 'node:path';

const svgLoader = function (source) {
  const callback = this.async();
  const iconName = basename(this.resourcePath, '.svg');
  const viewBoxMatch = /viewBox="(.*?)"/i.exec(source);

  if (!viewBoxMatch || viewBoxMatch.length < 2) {
    throw new Error(`viewport not set for icon file ${this.resourcePath}!`);
  }

  const [, viewBox] = viewBoxMatch;

  this.emitFile(this.resourcePath, source);

  callback(
    null,
    [
      // __sprite_name__ will be replaced by the plugin
      `const icon = ["__sprite_name__", "${iconName}", "${viewBox}"];`,
      `export default icon;`,
    ].join('\n'),
  );
};

export default svgLoader;
