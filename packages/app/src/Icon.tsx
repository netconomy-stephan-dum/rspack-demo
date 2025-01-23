import { FunctionComponent } from 'react';

interface Glyph {
  viewBox: string;
  width: string;
  height: string;
  url: string;
  id: string;
}

type RawGlyph = [string, string, string];
interface IconProps {
  glyph: RawGlyph;
}

const spriteStringToObject = ([chunkName, hash, viewBox]: RawGlyph): Glyph => {
  const [, , width, height] = viewBox.split(' ');
  return {
    height,
    id: hash,
    url: `/assets/svg/${chunkName}.svg#${hash}`,
    viewBox,
    width,
  };
};

const Icon: FunctionComponent<IconProps> = ({ glyph }) => {
  const { width, height, url } = spriteStringToObject(glyph);

  return (
    <svg width={width} height={height}>
      <use xlinkHref={url} />
    </svg>
  );
};

export default Icon;
