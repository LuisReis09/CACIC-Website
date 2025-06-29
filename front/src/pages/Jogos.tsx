import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from './../styles/Jogos.module.css'
import JogoCard from '../utils/JogoCard'
import { Notificacao, NotificacaoTipo } from '../utils/Notificacao';

const Jogos: React.FC = () => {
    const [jogos_list, setJogos_list] = useState<any[]>();
    const router = useRouter();

    interface NotificacaoItem {
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
        tempo?: number;
        width?: string | null;
    }

    useEffect( () => {
        fetch('http://localhost:4000/jogos/listar')
        .then(response => response.json())
        .then(data => {
            setJogos_list(data);
        })
    }, []) 

    return (
        <div className={"main_container " + styles.jogosList_container}>
            <div className={styles.text_container}>
                <h1 className={styles.title}>Alugue nossos jogos. <span className={styles.span}>Apoie o CA e divirta-se!</span></h1>
                <p className={styles.p}>Leia as <a className={styles.a} href="Termos_Servico_Jogos.pdf" target='_blank'>diretrizes de aluguel</a> do CA antes de alugar os jogos!</p>
            </div>

            <div className={styles.jogos_list + " scrollbar"}>
                    {
                        jogos_list?.map((jogo: any, index: number) => (
                            <JogoCard 
                                key={index}
                                nome={jogo.nome}
                                img={jogo.imagem}
                                status={jogo.status}
                                preco={jogo.precoPorHora} 
                                onClick={() => router.push(`/jogos/${jogo.id}`)}
                            />
                        ))
                    }
            </div>
            
            {/* <Notificacao tipo={NotificacaoTipo.ATENCAO} titulo="OPS..." conteudo="Você já avaliou esse professor!" /> */}
        </div>
    );

}

export default Jogos;