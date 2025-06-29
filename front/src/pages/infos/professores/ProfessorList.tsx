import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Components Imports
import ProfCard from '../../../utils/ProfCard'
// Styles Imports
import styles from '../../../styles/infos/ProfessorList.module.css'

interface ProfessorListProps{
  onSelectProfessor: (prof: any) => void;
}

const ProfessorList: React.FC<ProfessorListProps> = ({ onSelectProfessor }) => {
  const router = useRouter();
  const [professores, setProfessores] = React.useState<any[]>();

  useEffect(() => {
    fetch("http://localhost:4000/professores/listar")
      .then((response) => response.json())
      .then((data) => {
        setProfessores(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar professores:", error);
        setProfessores([]);
      });
  }, []);


  return (
    <div className="main_container">
      <div className={styles.header}>
        <div className={styles.back_button} onClick={() => router.push("/Infos")}>
          <i className={"fa fa-caret-left" + " " + styles.i} />
        </div>
        <p>Informações dos Professores</p>
      </div>

      <div className={styles.professores_container + " scrollbar"}>
        {
          professores?.map((prof: any, index: number) => (
            <ProfCard
              key={index}
              prof_nome={prof.nome}
              professor_img={prof.imagem}
              email={prof.email}
              onClick={() => {
                onSelectProfessor(prof);
              }}
            />
          ))
        }
      </div>
    </div>
  );
}

export default ProfessorList;