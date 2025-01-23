declare module '*.scss' {
  const classNames: {
    [className: string]: string;
  };
  export = classNames;
}

declare module '*.svg' {
  const glyph: [string, string, string];
  export = glyph;
}

declare module '*.png' {
  const url: string;
  export = url;
}

declare module '*.webp' {
  const url: string;
  export = url;
}
