import { useCallback, useState, lazy, Suspense } from 'react';
import loadable from '@loadable/component';
import styles from './App.scss';
import github from './assets/github.svg';
import helloWorld from './assets/hello_world.webp';

const Async = loadable(() => import('./Async'));

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  const button = isOpen ? (
    <button className={styles.button} onClick={toggle}>
      close
    </button>
  ) : (
    <button className={styles.button} onClick={toggle}>
      open
    </button>
  );

  return (
    <div>
      {button}
      <Async />
      <img width="200" height="200" src={helloWorld} />
      <img width="200" height="200" src={github} />
    </div>
  );
};

export default App;
