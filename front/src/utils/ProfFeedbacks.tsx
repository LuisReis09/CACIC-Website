import React from 'react';

interface ProfFeedbacksProps {
    categoria?: string;
    nota?: number;
}

import styles from '@/styles/utils/ProfFeedbacks.module.css';

const ProfFeedbacks: React.FC<ProfFeedbacksProps> = ({categoria, nota}) => {
    return (
        <div className={styles.feedback_container}>
            <p className={styles.feedback_categoria}>{categoria}:</p>
            <div className={styles.feedback_stars_box}>
                <div className={styles.feedback_stars_background}/>
                <div className={styles.feedback_stars}/>
            </div>
            <p className={styles.feedback_nota}>{nota?.toFixed(2)}</p>
        </div>
    );

}

export default ProfFeedbacks;