import reactDOM from 'react-dom/client';

import { loadableReady } from '@loadable/component';

(async () => {
  const App = (await import(/* webpackMode: "eager" */ APP_ROOT)).default;
  const rootElement = document.querySelector('#root');

  if (rootElement) {
    await loadableReady(() => {
      reactDOM.hydrateRoot(rootElement, <App />);
      // const reactRoot = reactDOM.createRoot(rootElement);
      // reactRoot.render(<App />);
    });
  }
})();
