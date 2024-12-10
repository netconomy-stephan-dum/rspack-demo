declare module '*.scss' {
  const classNames: {
    [className: string]: string;
  };
  export = classNames;
}

declare module '*.svg' {
  const url: string;
  export = url;
}

declare module '*.png' {
  const url: string;
  export = url;
}

declare module '*.webp' {
  const url: string;
  export = url;
}
