import React from 'react';
import { useRouter } from 'next/router';

import styles from '@/styles/infos/CadastrarMonitoria.module.css';
import { Notificacao, NotificacaoTipo } from '@/utils/Notificacao';

const CadastrarMonitoria: React.FC = () => {
    const router = useRouter();
    const [qtd_monitores, setQtdMonitores] = React.useState(1);

    const [notificacao, setNotificacao] = React.useState<{
            tipo: NotificacaoTipo;
            titulo: string;
            conteudo: string;
        } | null>(null);

    // useStates dos inputs:
    const [nomeProfessor, setNomeProfessor] = React.useState('');
    const [nomeDisciplina, setNomeDisciplina] = React.useState('');
    const [linkDiscord, setLinkDiscord] = React.useState('');
    const [linkWhatsapp, setLinkWhatsapp] = React.useState('');
    const [monitores, setMonitores] = React.useState([{ nome: '', email: '' }]);

    const handleCadastrarMonitoria = async () => {
        // Verifica se todos os campos obrigatórios estão preenchidos
        if(!nomeProfessor || !nomeDisciplina || !monitores[0].nome || !monitores[0].email) {
            setNotificacao({
                tipo: NotificacaoTipo.ERRO,
                titulo: 'Erro ao cadastrar monitoria',
                conteudo: 'Por favor, preencha todos os campos obrigatórios.'
            });
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/monitorias/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                professor: nomeProfessor,
                disciplina: nomeDisciplina,
                linkDiscord: linkDiscord,
                linkWhatsapp: linkWhatsapp,
                monitores: monitores.map(monitor => monitor.nome).join(';'),
                emailMonitor: monitores.map(monitor => monitor.email).join(';'),
                status: 'PENDENTE_APROVACAO'
            }),
        })
        .then(response => {
            router.push('/infos/Monitorias');
            setNotificacao({
                tipo: NotificacaoTipo.SUCESSO,
                titulo: 'Monitoria cadastrada com sucesso!',
                conteudo: 'Sua monitoria será analisada e publicada em breve.'
            });
        })
        .catch(error => {
            setNotificacao({
                tipo: NotificacaoTipo.ERRO,
                titulo: 'Erro ao cadastrar monitoria',
                conteudo: 'Ocorreu um erro ao cadastrar a monitoria. Por favor, tente novamente mais tarde.'
            });
        });
    }

    return (
        <div className={"main_container"}>

            {notificacao && (
                <Notificacao 
                    tipo={notificacao.tipo} 
                    titulo={notificacao.titulo} 
                    conteudo={notificacao.conteudo} 
                    onRemover={() => setNotificacao(null)} 
                />
            )}


            <div className={styles.header}>
                <div className={styles.back_button} onClick={() => router.push('/infos/Monitorias')}>
                <i className={"fa fa-caret-left" + " " + styles.i} />
                </div>
                <p>Cadastrar Monitoria</p>
            </div>

            <div className={styles.container}>
                <div className={styles.title}>
                    <h1>Registre sua Monitoria!</h1>
                    <p>Após análise e aprovação, sua monitoria será publicada neste site.</p>
                </div>

                <div className={styles.form}>
                    <div className={styles.form_inputs}>
                        <label htmlFor="nome_professor">Nome do Professor:</label>
                        <input type="text" id="nome_professor" placeholder="Nome do Professor" onChange={(e) => setNomeProfessor(e.target.value)}/>
                    </div>

                    <div className={styles.form_inputs}>
                        <label htmlFor="nome_disciplina">Nome da Disciplina:</label>
                        <input type="text" id="nome_disciplina" placeholder="Nome da Disciplina" onChange={(e) => setNomeDisciplina(e.target.value)}/>
                    </div>

                    <div className={styles.form_inputs}>
                        <label htmlFor="link_discord">Link do Discord (opcional):</label>
                        <input type="text" id="link_discord" placeholder="Link do Discord" onChange={(e) => setLinkDiscord(e.target.value)}/>
                    </div>

                    <div className={styles.form_inputs}>
                        <label htmlFor="link_whatsapp">Link do WhatsApp (opcional):</label>
                        <input type="text" id="link_whatsapp" placeholder="Link do WhatsApp" onChange={(e) => setLinkWhatsapp(e.target.value)}/>
                    </div>

                    <div className={styles.form_monitores_inputs}>
                        <div className={styles.dados_monitores_header}>
                            <label>Dados do(s) Monitor(es):</label>
                            <div className={styles.qtd_monitores_btns}>
                                <button onClick={() => setQtdMonitores(qtd_monitores + 1)} disabled={qtd_monitores >= 3}>+</button>
                                <button onClick={() => setQtdMonitores(qtd_monitores - 1)} disabled={qtd_monitores <= 1}>-</button>
                            </div>
                        </div>
                    {
                        Array.from({ length: qtd_monitores }).map((_, i) => (
                            <div key={i} className={styles.monitor_inputs}>
                                <input 
                                    type="text" 
                                    placeholder={`Nome`} 
                                    className={styles.nome_monitor_input}
                                    onChange = {
                                        (e) => {
                                            const newMonitores = [...monitores];
                                            if (!newMonitores[i]) newMonitores[i] = { nome: '', email: '' };
                                            newMonitores[i].nome = e.target.value;
                                            setMonitores(newMonitores);
                                        }
                                    }
                                />
                                <input 
                                    type="text" 
                                    placeholder={`E-mail`} 
                                    className={styles.email_monitor_input}
                                    onChange = {
                                        (e) => {
                                            const newMonitores = [...monitores];
                                            if (!newMonitores[i]) newMonitores[i] = { nome: '', email: '' };
                                            newMonitores[i].email = e.target.value;
                                            setMonitores(newMonitores);
                                        }
                                    }
                                />
                            </div>
                        ))
                    }
                    </div>

                </div>

                <button onClick={handleCadastrarMonitoria} className={styles.btn_cadastrar}>Cadastrar Monitoria</button>
            </div>
        </div>
    );

}

export default CadastrarMonitoria;