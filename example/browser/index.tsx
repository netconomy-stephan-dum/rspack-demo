import { createRoot } from 'react-dom/client';

const App = () => <div>Hello world</div>;

const rootNode = document.querySelector('#root');

const reactRoot = createRoot(rootNode);
reactRoot.render(<App />);
