import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

// Styles Imports
import styles from '@/styles/infos/ProfessorScreen.module.css'
import ProfFeedbacks from '@/utils/ProfFeedbacks';

const ProfessorScreen: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [prof, setProf] = React.useState<any>({});

    useEffect(() => {
        if(!id) return;
        
        fetch(`http://localhost:4000/professores/consultar/${id}`)
            .then(response => response.json())
            .then(data => {
                setProf(data);
            })
            .catch(error => {
                console.error('Erro ao buscar os dados do professor:', error);
            });
    }, []);
    
    return (
        <div className={"main_container"}>
            <div className={styles.header}>
                <div className={styles.back_button} onClick={() => router.push("/infos/Professores")}>
                <i className={"fa fa-caret-left" + " " + styles.i} />
                </div>
                <p>Informações dos Professores</p>
            </div>
            <div className={styles.main_box + " scrollbar"}>
                <div className={styles.first_section}>
                    <img className={styles.img} src={prof.imagem ? prof.imagem : "/assets/professors/imagem_padrao.svg"}></img>
                    <div className={styles.info}>
                        <div className={styles.info_upper}>
                            <strong>{prof.nome}</strong>
                            <p>{prof.email}</p>
                        </div>

                        <div className={styles.info_lower}>
                            <p>{prof.sala}</p>
                            <p>{prof.departamento}</p>
                            {prof.laboratorios && <p>{prof.laboratorios}</p>}
                        </div>
                    </div>
                </div>

                {   
                    <>
                    <hr/>

                    <div className={styles.second_section}>
                        <div className={styles.feedbacks}>
                            <div className={styles.feedback_title}>
                                <i className="fa fa-comments"></i>
                                <strong>Feedback dos Estudantes:</strong>
                            </div>

                            <div className={styles.feedbacks_box}>
                                <ProfFeedbacks categoria="Didática" nota={prof.feedbacks ? prof.feedbacks[0].didatica : 0}/>
                                <ProfFeedbacks categoria="Planejamento" nota={prof.feedbacks ? prof.feedbacks[0].planejamento : 0}/>
                                <ProfFeedbacks categoria="Avaliações" nota={prof.feedbacks ? prof.feedback[0].avaliacoes : 0}/>
                                <ProfFeedbacks categoria="Cordialidade" nota={prof.feedbacks ? prof.feedbacks[0].cordialidade : 0}/>
                                <p>Número de Votos: {prof.feedbacks? prof.feedbacks[0].qtdFeedbacks : 0}</p>
                            </div>
                        </div>
                        <button className={styles.feedback_button} onClick={() => router.push(`/infos/professores/avaliar/${id}`)}>Avaliar!</button>
                    </div>
                    </>
                }

                {   prof.areasDeInteresse &&
                    <>
                    <hr />
                    <div className={styles.third_section}>
                        <div className={styles.areas}>
                            <i className="fa fa-graduation-cap"></i>
                            <strong>Áreas de Interesse:</strong>
                        </div>
                        <div className={styles.areas_box}>
                            <p>{prof.areasDeInteresse}</p>
                        </div>
                    </div>
                    </>
                }

                {   prof.disciplinas &&
                    <>

                    <hr />

                    <div className={styles.fourth_section}>
                        <div className={styles.disciplinas}>
                            <i className="fa fa-book"></i>
                            <strong>Disciplinas Ministradas:</strong>
                        </div>
                        <div className={styles.disciplinas_box}>
                            <p>{prof.disciplinas}</p>
                        </div>
                    </div>

                    </>
                }

            </div>
        </div>
    )
}

export default ProfessorScreen;