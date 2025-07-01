import React from 'react';
import { useRouter } from 'next/router';

import styles from '@/styles/infos/CadastrarMonitoria.module.css';

const CadastrarMonitoria: React.FC = () => {
    const router = useRouter();

    return (
        <div className={"main_container"}>
            <div className={styles.header}>
                <div className={styles.back_button} onClick={() => router.push('/infos/Monitorias')}>
                <i className={"fa fa-caret-left" + " " + styles.i} />
                </div>
                <p>Cadastrar Monitoria</p>
            </div>
        </div>
    );

}

export default CadastrarMonitoria;