import React from 'react';
import styles from './../styles/Sobre.module.css';
import SobreContent from '../utils/SobreContent';

const Sobre: React.FC = () => {
  return (
    <div className={"main_container " + styles.sup_content}>
      <SobreContent />
    </div>
  );
};

export default Sobre;