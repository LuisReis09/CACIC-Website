import React from 'react'

import styles from '../styles/utils/JogoCard.module.css'

interface JogoCardProps {
    img: string, 
    nome: string,
    preco: number,
    status: "DISPONIVEL" | "INDISPONIVEL"
}

const JogoCard: React.FC<JogoCardProps> = ({img, nome, preco, status}) => {
    return(
        <div className={styles.jogo_card + " " + (status==="DISPONIVEL" ? "": styles.jogo_indisponivel)}>
            <div className={styles.header}>
                <img className={styles.img} src={img} alt="imagem ilustrativa do jogo" />
                <h2 className={styles.titulo}>{nome}</h2>
            </div>

            <p className={styles.p}><span className={styles.span}>{preco}</span> por hora</p>
        </div>
    )
}

export default JogoCard;