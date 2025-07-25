import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from './../styles/Jogos.module.css'
import JogoCard from '../utils/JogoCard'
import { Notificacao, NotificacaoTipo } from '../utils/Notificacao';

const Jogos: React.FC = () => {
    const [jogos_list, setJogos_list] = useState<any[]>();
    const [notificacao, setNotificacao] = useState<{
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
    } | null>(null);
    const router = useRouter();

    useEffect( () => {
        fetch('http://localhost:4000/jogos/listar')
        .then(response => response.json())
        .then(data => {
            setJogos_list(data);
        })
    }, []) 

    const handleTrocarTela = (id: number) => {
        fetch(`http://localhost:4000/aluguel/servicoAtivo`)
        .then(response => response.json())
        .then(data => {
            if(!data){
                setNotificacao({
                    tipo: NotificacaoTipo.ATENCAO,
                    titulo: "Serviço de Jogos Desativado",
                    conteudo: "O serviço de jogos está desativado temporariamente. Tente novamente mais tarde."
                });
            }else{
                router.push(`/jogos/${id}`);
            }
        })
        .catch(error => {
            setNotificacao({
                tipo: NotificacaoTipo.ERRO,
                titulo: "Erro de Conexão",
                conteudo: "Não foi possível verificar o status do serviço de jogos. Tente novamente mais tarde."
            });
        });
    }

    return (
        <div className={"main_container " + styles.jogosList_container}>
            <div className={styles.text_container}>
                <h1 className={styles.title}>Alugue nossos jogos. <span className={styles.span}>Apoie o CA e divirta-se!</span></h1>
                <p className={styles.p}>Leia as <a className={styles.a} href="Termos_Servico_Jogos.pdf" target='_blank'>diretrizes de aluguel</a> do CA antes de alugar os jogos!</p>
            </div>

            {notificacao && (
                <Notificacao 
                    tipo={notificacao.tipo} 
                    titulo={notificacao.titulo} 
                    conteudo={notificacao.conteudo} 
                    onRemover={() => setNotificacao(null)} 
                />
            )}

            <div className={styles.jogos_list}>
                    {
                        jogos_list?.map((jogo: any, index: number) => (
                            <JogoCard 
                                key={index}
                                nome={jogo.nome}
                                img={jogo.imagem}
                                status={jogo.status}
                                preco={jogo.precoPorHora} 
                                onClick={() => handleTrocarTela(jogo.id)}
                            />
                        ))
                    }
            </div>
            
            {}
        </div>
    );

}

export default Jogos;