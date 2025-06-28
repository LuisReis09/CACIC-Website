import React from 'react';
import { useState, useEffect } from 'react';

import styles from './../styles/Jogos.module.css'
import JogoCard from '../utils/JogoCard'
import { Notificacao, NotificacaoTipo } from '../utils/Notificacao';

const Jogos: React.FC = () => {
    const [jogos_list, setJogos_list] = useState<any[]>()

    interface NotificacaoItem {
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
        tempo?: number;
        width?: string | null;
    }

    useEffect( () => {

        setJogos_list([
            {nome: "Xadrez", img: "/assets/imagem_padrao.svg", preco: "1,00", status: "DISPONIVEL"},
            {nome: "Uno", img: "/assets/imagem_padrao.svg", preco: "0,50", status: "DISPONIVEL"},
            {nome: "Ludo", img: "/assets/imagem_padrao.svg", preco: "1,00", status: "INDISPONIVEL"},
            {nome: "Coup", img: "/assets/imagem_padrao.svg", preco: "2,00", status: "DISPONIVEL"},
            {nome: "Xadrez", img: "/assets/imagem_padrao.svg", preco: "1,00", status: "DISPONIVEL"},
            {nome: "Uno", img: "/assets/imagem_padrao.svg", preco: "0,50", status: "DISPONIVEL"},
            {nome: "Ludo", img: "/assets/imagem_padrao.svg", preco: "1,00", status: "INDISPONIVEL"},
            {nome: "Coup", img: "/assets/imagem_padrao.svg", preco: "2,00", status: "DISPONIVEL"},
        ])
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
                                img={jogo.img}
                                status={jogo.status}
                                preco={jogo.preco} 
                            />
                        ))
                    }
            </div>
            
            {/* <Notificacao tipo={NotificacaoTipo.ATENCAO} titulo="OPS..." conteudo="Você já avaliou esse professor!" /> */}
        </div>
    );

}

export default Jogos;