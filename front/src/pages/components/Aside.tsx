import React from 'react';

import styles from '../../styles/components/Aside.module.css';

const Aside: React.FC = () => {
    return (
        <aside>
            <h1 className={styles.aside_title}>Hex<span className={styles.aside_title_span}>Cat</span></h1>
            <div className={styles.aside_content}>

            </div>
        </aside>
    )
}

export default Aside;