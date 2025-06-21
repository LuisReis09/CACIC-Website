import React from 'react';

// Styles Imports
import styles from '../styles/utils/ProfCard.module.css'

interface ProfCardProps{
    professor: string;
    professor_img: string | null;
    email: string | number;
    onClick: Function;
}

const ProfCard: React.FC<ProfCardProps> = ({professor, professor_img, email, onClick}) => {

    return (
        <div className={styles.prof_card_box} onClick={() => onClick()}>
            <div>
                <img src={professor_img ? professor_img : ""}></img>
            </div>
            
            <div>
                <p className={styles.prof_name} >{professor}</p>
                <p className={styles.prof_email}>{email}</p>
            </div>
        </div>
    )
}

export default ProfCard;