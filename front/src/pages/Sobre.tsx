import React from 'react';
import styles from './../styles/Sobre.module.css';
import SobreContent from '../utils/SobreContent';

const Sobre: React.FC = () => {
  return (
    <div className={styles.container}>
      <SobreContent />
    </div>
  );
};

export default Sobre;