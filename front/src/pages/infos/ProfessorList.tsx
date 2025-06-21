import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Components Imports
import ProfCard from '../../utils/ProfCard'

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
        <div>
            <div>
                <i className="fa fa-arrow-left" onClick={() => router.push("/Infos")}></i>
                <p>Informações {'>'} Professores</p>
            </div>

            <div>
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