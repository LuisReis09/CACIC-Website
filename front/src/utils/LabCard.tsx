import React from 'react';

import styles from '@/styles/utils/LabCard.module.css';

interface LabCardProps {
    nome: string;
    link: string;
    descricao: string;
    localizacao: string;
    imagem: string;
}


const LabCard: React.FC<LabCardProps> = ({nome, link, descricao, localizacao, imagem}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const estiloDescricao = {
        maxHeight: isOpen ? '500px' : '0px',
        opacity: isOpen ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
    };

    return (
        <div className={styles.labCard}>
           <div onClick={() => setIsOpen(!isOpen)} className={styles.labCardHeader}>
                <div className={styles.labCardHeaderContent}>
                    {imagem ?
                        <img src={imagem} alt={nome} className={styles.labCardImage}/>
                    :
                        <img src="ufpb_logo.svg" alt="Placeholder" />}
                    <p>{nome}</p>
                </div>
                <i className={'fa fa-chevron-down ' + styles.opened_symbol} style={isOpen? {transform: 'rotate(180deg)'} : {}}/>
           </div>
           <div style={estiloDescricao} className={styles.labCardContent}>
                {localizacao && <p>Localização: {localizacao}</p>}
                <p>{descricao}</p>
                {link && <a href={link} target="_blank" rel="noopener noreferrer">Link</a>}
           </div>
        </div>
    );

}

export default LabCard;