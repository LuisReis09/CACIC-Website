import React from 'react';

import styles from '../styles/utils/TabelaOption.module.css';

interface TabelaOptionProps {
    setTabela?: (tabela: string) => void;
    setColumnRoute?: (route: string) => void;
    toCreate?: boolean;
}

const TabelaOption: React.FC<TabelaOptionProps> = ({setTabela, setColumnRoute, toCreate}) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { tabela, rota } = JSON.parse(event.target.value);
        setTabela?.(tabela);
        setColumnRoute?.(rota);
    };

    const addOtherTables = () => {
        if(!toCreate) {
            return (
                <>
                <option value='{"tabela":"clientes","rota":"/aluguel/clientes"}'>Clientes</option>
                <option value='{"tabela": "alugueis", "rota":"/aluguel"}'>Alugueis</option>
                <option value='{"tabela":"feedbacks","rota":"/professores/feedbacks"}'>Feedbacks</option>
                <option value='{"tabela":"votantes", "rota":"/professores/votantes"}'>Votantes</option>
                </>
            )
        }
    }

    return (
        <select onChange={handleChange} className={styles.tabelaSelect}>
            <option value='{"tabela":"professores","rota":"/professores"}'>Professores</option>
            <option value='{"tabela":"monitorias","rota":"/monitorias"}'>Monitorias</option>
            <option value='{"tabela":"grupos","rota":"/grupos"}'>Grupos</option>
            <option value='{"tabela":"jogos","rota":"/jogos"}'>Jogos</option>
            {addOtherTables()}
        </select>
    );

}

export default TabelaOption;