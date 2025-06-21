// React Imports
import type { AppProps } from 'next/app';
import React from 'react';

// Components Imports
import Header from './components/Header';
import Nav from './components/Nav';
import Aside from './components/Aside';

// Styles Imports
import '../styles/globals.css';
import styles from '../styles/App.module.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.App}>
      <Header />
      <div className={styles.content}>
        <div className={styles.main_frame}>
          <Nav />
          <Component {...pageProps} /> {/* ← Aqui muda conforme a rota */}
        </div>
        <Aside />
      </div>
    </div>
  );
}
