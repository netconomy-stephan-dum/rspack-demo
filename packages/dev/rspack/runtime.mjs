const config = {
  target: 'web',
  entry: '',
  plugins: [
    new ModuleFederationPlugin({
      name: 'runtime',
      shared: ['react', 'react-dom'],
    }),
  ],
};

export default config;
