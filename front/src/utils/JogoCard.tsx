import React from 'react'

import styles from '../styles/utils/JogoCard.module.css'

interface JogoCardProps {
    img: string, 
    nome: string,
    preco: number,
    status: "DISPONIVEL" | "INDISPONIVEL"
    onClick?: () => void
}

const JogoCard: React.FC<JogoCardProps> = ({img, nome, preco, status, onClick}) => {
    return(
        <div className={styles.jogo_card + " " + (status==="DISPONIVEL" ? "": styles.jogo_indisponivel)} onClick={onClick}>
            <div className={styles.header}>
                <img className={styles.img} src={img} alt="imagem ilustrativa do jogo" />
                <h2 className={styles.titulo}>{nome}</h2>
            </div>

            <p className={styles.p}><span className={styles.span}>R$ {Number(preco).toFixed(2)}</span> por hora</p>
        </div>
    )
}

export default JogoCard;