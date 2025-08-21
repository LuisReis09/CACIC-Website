import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

// Styles Imports
import styles from '@/styles/infos/ProfessorScreen.module.css'
import ProfFeedbacks from '@/utils/ProfFeedbacks';
import { Notificacao, NotificacaoTipo } from '@/utils/Notificacao';
import { get } from 'http';



const ProfessorScreen: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [prof, setProf] = React.useState<any>({});
    const [feedbacks, setFeedbacks] = React.useState<any>(null);

    const [notificacao, setNotificacao] = React.useState<{
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
    } | null>(null);

    useEffect(() => {
        if(!id) return;
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/professores/consultar/${id}`)
            .then(
                response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar os dados do professor');
                    }
                    return response.json();
                }
            )
            .then(data => {
                setProf(data);
            })
            .catch(error => {
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro ao carregar professor',
                    conteudo: 'Ocorreu um erro ao carregar os dados do professor. Por favor, tente novamente mais tarde.'
                });
            });
        
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/professores/feedbacks/consultar/${id}`)
            .then(
                response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar os dados do professor');
                    }
                    return response.json();
                }
            )
            .then(data => {
                if (data && Object.keys(data).length === 0) {
                    setFeedbacks(null);
                    return;
                }
                setFeedbacks(data);
            })
            .catch(error => {
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro ao carregar feedbacks',
                    conteudo: 'Ocorreu um erro ao carregar os feedbacks do professor. Por favor, tente novamente mais tarde.'
                });
            });
    }, [id]);
    
    return (
        <div className={"main_container"}>
            {
                notificacao && 
                <Notificacao 
                    tipo={notificacao.tipo} 
                    titulo={notificacao.titulo} 
                    conteudo={notificacao.conteudo} 
                    onRemover={() => setNotificacao(null)} />
            }

            <div className={styles.header}>
                <div className={styles.back_button} onClick={() => router.push("/infos/Professores")}>
                <i className={"fa fa-caret-left" + " " + styles.i} />
                </div>
                <p>Informações dos Professores</p>
            </div>
            <div className={styles.main_box}>
                <div className={styles.first_section}>
                    <img 
                        className={styles.img} 
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/professores/imagem/${prof.id}`}
                    ></img>
                    <div className={styles.info}>
                        <div className={styles.info_upper}>
                            <strong>{prof.nome}</strong>
                            <p>{prof.email}</p>
                            {   prof.linkedin != "" &&
                                <a href={prof.linkedin} target='blank'><i className='fa-brands fa-linkedin'></i></a>
                                
                            }
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
                                <ProfFeedbacks categoria="Didática" nota={feedbacks ? feedbacks.didatica : 0}/>
                                <ProfFeedbacks categoria="Planejamento" nota={feedbacks ? feedbacks.planejamento : 0}/>
                                <ProfFeedbacks categoria="Avaliações" nota={feedbacks ? feedbacks.avaliacoes : 0}/>
                                <ProfFeedbacks categoria="Cordialidade" nota={feedbacks ? feedbacks.cordialidade : 0}/>
                                <p>Número de Votos: {feedbacks? feedbacks.qtdFeedbacks : 0}</p>
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