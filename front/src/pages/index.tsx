// React Imports
import React from 'react';

// Components Imports
import Header from './components/Header';
import Nav from './components/Nav';
import Aside from './components/Aside';

// Styles Imports
import styles from '../styles/Index.module.css';

export default function Home() {
  return (
    <div className={"main_container" + ' ' + styles.intro_container}>
      <div className={styles.main_content}>
        <img alt="Imagem do CA" className={styles.ca_image} src={"assets/ca_image.svg"}></img>

        <div className={styles.intro_content}>
          <div>
            <h1 className={styles.span_h1}>Bem-vindo!</h1>
            <h2>Somos a chapa Nova Geração, do CA de Ciência da Computação - UFPB.</h2>
          </div>
          <div>
            <p>
              “Sozinhos podemos ir mais rápido, mas juntos podemos ir mais longe.”
            </p>
            <p>
              - Provérbio Africano
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
