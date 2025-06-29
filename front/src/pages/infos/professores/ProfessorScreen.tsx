import React from 'react';
import { useRouter } from 'next/router';

// Styles Imports
import styles from '../../../styles/infos/ProfessorScreen.module.css'

interface ProfessorScreenProps{
    setScreen: Function;
    prof: any;
}

const ProfessorScreen: React.FC<ProfessorScreenProps> = ({setScreen, prof}) => {
    const router = useRouter();
    
    return (
        <div className={"main_container"}>
            <div className={styles.header}>
                <div className={styles.back_button} onClick={() => window.location.reload()}>
                <i className={"fa fa-caret-left" + " " + styles.i} />
                </div>
                <p>Informações dos Professores</p>
            </div>
            <div className={styles.main_box}>
                <img className={styles.img} src={prof.imagem ? prof.imagem : "/assets/professors/imagem_padrao.svg"}></img>
                <div className={styles.info}>
                    <h1>{prof.nome}</h1>
                    <p>{prof.email}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfessorScreen;