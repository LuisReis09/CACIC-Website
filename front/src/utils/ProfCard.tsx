import React from 'react';

// Styles Imports
import styles from '../styles/utils/ProfCard.module.css'

interface ProfCardProps{
    prof_nome: string;
    professor_img: string | null;
    email: string | number;
    onClick: Function;
}

const ProfCard: React.FC<ProfCardProps> = ({prof_nome, professor_img, email, onClick}) => {

    return (
        <div className={styles.prof_card_box} onClick={() => onClick}>
            <img className={styles.img} src={professor_img ? professor_img : "/assets/professors/imagem_padrao.svg"}></img>
            
            <div className={styles.prof_card_info}>
                <p className={styles.prof_name} >{prof_nome}</p>
                <p className={styles.prof_email}>{email}</p>
            </div>
        </div>
    )
}

export default ProfCard;