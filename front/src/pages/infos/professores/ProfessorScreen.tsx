import React from 'react';

// Styles Imports
import styles from '../../../styles/infos/ProfessorScreen.module.css'

interface ProfessorScreenProps{
    setScreen: Function;
    prof: any;
}

const ProfessorScreen: React.FC<ProfessorScreenProps> = ({setScreen, prof}) => {
    return (
        <div>
            <div>
                <i className="fa fa-arrow-left" onClick={() => router.push("/Infos")}></i>
                <p>Informações {'>'} Professores {'>' + prof.nome}</p>
            </div>
        </div>
    )
}

export default ProfessorScreen;