import React from 'react';
import Nav from './Nav';
import { useAdminContext } from '@/utils/AdminContext';

import styles from '../../styles/admin/Outros.module.css';

import { Notificacao, NotificacaoTipo } from '../../utils/Notificacao';  


const Outros: React.FC = () => {
    const [emprestimosLigados, setEmprestimosLigados] = React.useState<boolean>(false);
    const [horarios, setHorarios] = React.useState<{ativacao: string, desativacao: string} | null>(null);
    const [agendamento, setAgendamento] = React.useState<number>(8);
    const [notificacao, useNotificacao] = React.useState<{
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
    } | null>(null);

    const fetchEmprestimosStatus = async () => {
        fetch('http://localhost:4000/aluguel/servicoAtivo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Use localStorage to get the token,
            },
        })
            .then(async response => {
                if(!response.ok) {
                    throw new Error('Erro ao buscar colunas');
                }
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            })
            .then(data => {
                setEmprestimosLigados(data);
            })
            .catch(error => {
                useNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro',
                    conteudo: 'Perdeu acesso ao servidor. Tente relogar.',
                })
                
                // Recarrega a página:
                setTimeout(() => {
                    window.location.reload();
                }, 2000);   
            });
    }

    const fetchHorarios = async () => {
        fetch('http://localhost:4000/aluguel/horariosHoje', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, // Use localStorage to get the token
            },
        })
            .then(async response => {
                if(!response.ok) {
                    throw new Error('Erro ao buscar colunas');
                }
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            })
            .then(data => {
                setHorarios(data);
            })
            .catch(error => {
                useNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro',
                    conteudo: 'Perdeu acesso ao servidor. Tente relogar.',
                });
                // Recarrega a página:
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
    }

    const powerEmprestimos = async () => {
        fetch(`http://localhost:4000/aluguel/${emprestimosLigados? "desativarServicoJogos" : "ativarServicoJogos"}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Erro ao alterar status do serviço de empréstimos');
                }
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            })
            .then(data => {
                setEmprestimosLigados(!emprestimosLigados);
            })
            .catch(error => {
                useNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro',
                    conteudo: 'Perdeu acesso ao servidor. Tente relogar.',
                });
                // Recarrega a página:
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
    }

    const agendarAtivacao = async () => {
        // if (agendamento < 8 || agendamento > 18) {
        //     return;
        // }
        fetch(`http://localhost:4000/aluguel/agendarAtivacaoServicoJogos/${agendamento}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Erro ao agendar ativação do serviço de jogos');
                }
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            })
            .then(data => {
                useNotificacao({
                    tipo: NotificacaoTipo.SUCESSO,
                    titulo: 'Sucesso',
                    conteudo: 'Agendamento de ativação realizado com sucesso!',
                })
                fetchHorarios(); // Atualiza os horários após o agendamento
            })
            .catch(error => {
                useNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro',
                    conteudo: 'Perdeu acesso ao servidor. Tente relogar.',
                })
                // Recarrega a página:
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
    }

    const agendarDesativacao = async () => {
        if (agendamento < 8 || agendamento > 18) {
            useNotificacao({
                tipo: NotificacaoTipo.ERRO,
                titulo: 'Erro',
                conteudo: 'Por favor, insira uma hora válida entre 8 e 18.',
            })
            return;
        }
        fetch(`http://localhost:4000/aluguel/agendarDesativacaoServicoJogos/${agendamento}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Erro ao agendar desativação do serviço de jogos');
                }
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            })
            .then(data => {
                useNotificacao({
                    tipo: NotificacaoTipo.SUCESSO,
                    titulo: 'Sucesso',
                    conteudo: 'Agendamento de desativação realizado com sucesso!',
                })
                fetchHorarios(); // Atualiza os horários após o agendamento
            })
            .catch(error => {
                useNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro',
                    conteudo: 'Perdeu acesso ao servidor. Tente relogar.',
                })
                // Recarrega a página:
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
    }

    const handlePropaganda = async () => {
        fetch('http://localhost:4000/aluguel/enviarEmailJogos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar e-mails de propaganda');
                }
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            })
            .then(data => {
                useNotificacao({
                    tipo: NotificacaoTipo.SUCESSO,
                    titulo: 'Sucesso',
                    conteudo: 'E-mails enviados com sucesso!',
                })
            })
            .catch(error => {
                useNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro',
                    conteudo: 'Perdeu acesso ao servidor. Tente relogar.',
                })
                // Recarrega a página:
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
    }

    React.useEffect(() => {
        fetchEmprestimosStatus();
        fetchHorarios();
    }, []);

    return (
        <div className={styles.big_container}>
            <Nav />
            {notificacao && (
                <Notificacao
                    tipo={notificacao.tipo}
                    titulo={notificacao.titulo}
                    conteudo={notificacao.conteudo}
                    onRemover={() => useNotificacao(null)}
                />
            )}
            <div className={styles.container}>
                <div className={styles.emprestimos_power_box + ' ' +  (emprestimosLigados ? styles.desativar : styles.ativar)}
                    onClick={powerEmprestimos}
                >
                    <i className='fa fa-power-off'></i>
                    <p>{emprestimosLigados ? "Desligar" : "Ligar"} empréstimos</p>
                </div>

                <div className={styles.emprestimos_status_box}>
                    <h1>Agendar:</h1>
                    <input type="number" min={8} max={18} placeholder="Hora Inteira (8 - 18)" onChange={(e) => setAgendamento(Number(e.target.value))}/>
                    <p>horário hoje: {horarios?.ativacao.substring(0, 5)} às {horarios?.desativacao.substring(0, 5)}</p>
                    <div className={styles.emprestimos_status_buttons}>
                        <button className={styles.emprestimos_agendar_inicio} onClick={agendarAtivacao}>Início</button>
                        <button className={styles.emprestimos_agendar_termino} onClick={agendarDesativacao}>Término</button>
                    </div>
                </div>

                {/* Reaproveitando estilos definidos para divs anteriores: */}
                <div className={styles.emprestimos_power_box + ' ' + styles.ativar} onClick={handlePropaganda}>
                    <i className='fa fa-envelope'></i>
                    <p>Propaganda Geral</p>
                </div>
            </div>

        </div>
    );

}

export default Outros;