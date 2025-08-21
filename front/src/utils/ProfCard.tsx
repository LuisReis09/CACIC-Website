import React from 'react';

// Styles Imports
import styles from '../styles/utils/ProfCard.module.css'

interface ProfCardProps{
    id: number;
    prof_nome: string;
    professor_img: string | null;
    email: string | number;
    onClick: any;
}

const ProfCard: React.FC<ProfCardProps> = ({id, prof_nome, professor_img, email, onClick}) => {

    return (
        <div className={styles.prof_card_box} onClick={onClick}>
            <img className={styles.img} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/professores/imagem/${id}`}></img>
            
            <div className={styles.prof_card_info}>
                <p className={styles.prof_name} >{prof_nome}</p>
                <p className={styles.prof_email}>{email}</p>
            </div>
        </div>
    )
}

export default ProfCard;