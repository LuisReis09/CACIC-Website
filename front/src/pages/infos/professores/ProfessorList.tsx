import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Components Imports
import ProfCard from '../../../utils/ProfCard'
// Styles Imports
import styles from '../../../styles/infos/ProfessorList.module.css'

interface ProfessorListProps{
    setScreen: Function;
    setProf: Function;
}

const ProfessorList: React.FC<ProfessorListProps> = ({setScreen, setProf}) => {
    const router = useRouter();
    const [professores, setProfessores] = React.useState<any>();

    useEffect(() => {
        setProfessores([
            { nome: "Luis", imagem: "", email: "luis@gmail.com" },
            { nome: "Herick", imagem: "", email: "Herick@gmail.com" },
            { nome: "Davi", imagem: "", email: "davi@gmail.com" }
        ]);
    }, []);

    return (
        <div className="main_container">
            <div className={styles.header}>
                <div className={styles.back_button} onClick={() => router.push("/Infos")}>
                    <i className={"fa fa fa-caret-left" + " " + styles.i} />
                </div>
                <p>Informações dos Professores</p>
            </div>

            <div className={styles.professores_container + " scrollbar"}>
                {
                    professores?.map((prof: any) => {
                        <ProfCard professor={prof.nome} professor_img={prof.imagem} email={prof.email} onClick={() => {setProf(prof)}}/>
                    })
                }
            </div>

        </div>
    )
}

export default ProfessorList;