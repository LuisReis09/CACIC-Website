import React from 'react';

interface ProfFeedbacksProps {
    categoria?: string;
    nota?: number;
}

import styles from '../styles/utils/ProfFeedbacks.module.css';

const ProfFeedbacks: React.FC<ProfFeedbacksProps> = ({categoria, nota}) => {
    return (
        <div className={styles.feedback_container}>
            <p className={styles.feedback_categoria}>{categoria}:</p>
            <div className={styles.feedback_rate}>
                <div className={styles.feedback_stars_box}>
                    <img 
                        className={styles.feedback_stars_background} 
                        src='/assets/back_stars.svg'
                        alt="estrelas de background"/>

                    <div 
                        className={styles.feedback_stars_mask}
                        style={{width: `${nota*20.126}%`}} >
                        {/* com a constante acima definida a partir 
                        da divisão da largura do componente (100.63 auto) pela nota maxima (5) */}
                        <img 
                            className={styles.feedback_stars} 
                            src='/assets/golden_stars.svg'
                            alt="estrelas de avaliação"/>
                    </div>
                </div>
                <p className={styles.feedback_nota}>{nota?.toFixed(2)}</p>
            </div>
        </div>
    );

}

export default ProfFeedbacks;