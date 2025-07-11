import React from 'react';
import { useRouter } from 'next/router';

import styles from '@/styles/infos/ProfessorEvaluation.module.css';
import { Notificacao, NotificacaoTipo } from '@/utils/Notificacao';

const Votacao: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [professor, setProfessor] = React.useState<any>(null);

    // Campos de input:
    const [cpf, setCpf] = React.useState("");
    const [matricula, setMatricula] = React.useState("");
    const [didatica, setDidatica] = React.useState(0);
    const [planejamento, setPlanejamento] = React.useState(0);
    const [avaliacoes, setAvaliacoes] = React.useState(0);
    const [cordialidade, setCordialidade] = React.useState(0);

    const [notificacao, setNotificacao] = React.useState<{
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
    } | null>(null);

    const formatCPF = (value: string) => {
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return value;
    };

    const handleVotacao = () => {
        // Verifica se a matrícula tem exatamente 11 NÚMEROS e se o CPF está no formato correto e com números completos
        if (matricula.length !== 11 || !/^\d+$/.test(matricula)) {
            setNotificacao({
                tipo: NotificacaoTipo.ERRO,
                titulo: "Erro na matrícula",
                conteudo: "A matrícula deve conter exatamente 11 números."
            });
            return;
        }

        if (cpf.length !== 14 || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
            setNotificacao({
                tipo: NotificacaoTipo.ERRO,
                titulo: "Erro no CPF",
                conteudo: "O CPF deve estar no formato XXX.XXX.XXX-XX."
            });
            return;
        }

        

        fetch('http://localhost:4000/professores/feedbacks/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                professorId: Number(id),
                cpf: cpf,
                matricula: matricula,
                didatica: didatica,
                cordialidade: cordialidade,
                planejamento: planejamento,
                avaliacoes: avaliacoes
            })
        }).then(
            response => {
                if (!response.ok) {
                    setNotificacao({
                        tipo: NotificacaoTipo.ERRO,
                        titulo: "Erro ao enviar feedback",
                        conteudo: "Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente mais tarde."
                    });
                }
                return response.json();
            }
        )
        .then(data => {

            // INDEPENDENTE DO RETORNO, MOSTRAR A MENSAGEM PRO CLIENTE. PORÉM, MUDA A COR/SIMBOLO/ESTILO DA MENSAGEM.
            if(!data.success){
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: "Erro ao enviar feedback",
                    conteudo: data.message || "Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente mais tarde."
                });
            }else{
                router.push("/infos/professores/dados/" + id);
                setNotificacao({
                    tipo: NotificacaoTipo.SUCESSO,
                    titulo: "Feedback enviado com sucesso!",
                    conteudo: "Obrigado por compartilhar sua opinião. Seu feedback é muito importante para nós."
                });
            }
        })
    }

    React.useEffect(() => {
        if (!id) return;


        fetch(`http://localhost:4000/professores/consultar/${id}`)
            .then(response => response.json())
            .then(data => {
                setProfessor(data);
            })
            .catch(error => {
                router.push("/infos/professores");
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: "Erro ao carregar professor",
                    conteudo: "Ocorreu um erro ao carregar os dados do professor. Por favor, tente novamente mais tarde."
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
                <div className={styles.back_button} onClick={() => router.push("/infos/professores/dados/" + id)}>
                <i className={"fa fa-caret-left" + " " + styles.i} />
                </div>
                <p>Feedbacks</p>
            </div>

            <div className={styles.main_content}>
                <div className={styles.form_container}>
                    <div className={styles.form_user}>
                        <div className={styles.prof_info}>
                            <i className={"fa fa-user-circle"}></i>
                            <p>{professor?.nome}</p>
                        </div>

                        <div className={styles.user_info_cpf}>
                            <label htmlFor="user_cpf">CPF:</label>
                            <input
                                id="user_cpf"
                                name="user_cpf"
                                placeholder="123.456.789-00"
                                value={cpf}
                                onChange={(e: any) => setCpf(formatCPF(e.target.value))}
                                maxLength={14}
                                className={styles.user_info_input}
                            />
                        </div>

                        <div className={styles.user_info_matricula}>
                            <label htmlFor="user_matricula">Matrícula:</label>
                            <input 
                                type="text" 
                                id="user_matricula" 
                                name="user_matricula" 
                                placeholder="20230012345" 
                                onChange={(E) => setMatricula(E.target.value)}
                                className={styles.user_info_input}
                                maxLength={11}
                            />
                        </div>
                    </div>

                    <hr />

                    <div className={styles.form_feedback}>
                        <div className={styles.feedback_title}>
                            <h1>Dê seu feedback</h1>
                            <p>0 - péssimo, 5 - excelente</p>
                        </div>

                        <div className={styles.feedback_options}>
                            <div className={styles.feedback_option}>
                                <p>Didática:</p>
                                <select value={didatica} onChange={(e) => setDidatica(Number(e.target.value))}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>

                            <div className={styles.feedback_option}>
                                <p>Planejamento:</p>
                                <select value={planejamento} onChange={(e) => setPlanejamento(Number(e.target.value))}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>

                            <div className={styles.feedback_option}>
                                <p>Avaliações:</p>
                                <select value={avaliacoes} onChange={(e) => setAvaliacoes(Number(e.target.value))}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>

                            <div className={styles.feedback_option}>
                                <p>Cordialidade:</p>
                                <select value={cordialidade} onChange={(e) => setCordialidade(Number(e.target.value))}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.form_footer}>
                    <p className={styles.footer_text}>
                        Obs.: garantimos o anonimato da avaliação. Usamos CPF e matrícula apenas para assegurar que cada aluno participe uma única vez. 
                        Nosso objetivo, como CA, é oferecer um espaço para a opinião dos estudantes.
                    </p>

                    <button className={styles.avaliar_button} onClick={handleVotacao}>Avaliar!</button>
                </div>
            </div>
        </div>
    );

}

export default Votacao;