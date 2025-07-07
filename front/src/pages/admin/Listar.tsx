import React from 'react';


import Nav from './Nav';
import TabelaOption from '@/utils/TabelaOption';
import { useAdminContext } from '@/utils/AdminContext';

import { Notificacao, NotificacaoTipo } from '../../utils/Notificacao';


import styles from '../../styles/admin/Listar.module.css'

const Listar: React.FC = () => {
    const [tabela, setTabela] = React.useState<string>('professores');
    const [columnRoute, setColumnRoute] = React.useState<string>('/professores');
    const [filtro, setFiltro] = React.useState<string>('');
    const [filtroValue, setFiltroValue] = React.useState<string>('');
    const [colunas, setColunas] = React.useState<any[]>([]);
    const [dados, setDados] = React.useState<any[]>([]);
    const { token } = useAdminContext();
    
    const [notificacao, setNotificacao] = React.useState<{
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
    } | null>(null);


    const fetchDados = async () => {
        fetch('http://localhost:4000' + columnRoute + '/listar', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(async response => { const text = await response.text(); return text ? JSON.parse(text) : null;})
            .then(data => {
                setDados(data);
            })
            .catch(error => {
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: "Erro",
                    conteudo: "Perdeu acesso ao servidor. Tente relogar."
                });                
                // Recarrega a página:
                window.location.reload();
            });
    }

    const fetchColunas = async () => {
        fetch('http://localhost:4000' + columnRoute + '/colunas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(async response => { const text = await response.text(); return text ? JSON.parse(text) : null;})
            .then(data => {
                setColunas(data);
                setFiltro(data[0].column); // Define o filtro inicial como a primeira coluna
            })
            .catch(error => {
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: "Erro",
                    conteudo: "Perdeu acesso ao servidor. Tente relogar."
                });                
                // Recarrega a página:
                window.location.reload();
            });
    }

    const fetchBusca = async () => {
        fetch('http://localhost:4000' + columnRoute + `/buscar/${filtro}/${filtroValue}/${getTipo(filtro)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then(async response => { const text = await response.text(); return text ? JSON.parse(text) : null;})
            .then(data => {
                setDados(data);
            })
            .catch(error => {
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: "Erro",
                    conteudo: "Perdeu acesso ao servidor. Tente relogar."
                });
                // Recarrega a página:
                window.location.reload();
            });
    }

    const getTipo = (filtro: string) => {
        const coluna = colunas.find(col => col.column === filtro);
        return coluna.type;
    }

    React.useEffect(() => {
        fetchDados();
        fetchColunas();
    }, [tabela, columnRoute]);

    React.useEffect(() => {
        fetchDados();
        fetchColunas();
    }, [])

    React.useEffect(() => {
        if (filtroValue) {
            fetchBusca();
        }
        else {
            fetchDados();
        }
    }, [filtro, filtroValue]);

    return (
        <div className={styles.big_container}>
           <Nav />
            {notificacao && (
                <Notificacao
                    tipo={notificacao.tipo}
                    titulo={notificacao.titulo}
                    conteudo={notificacao.conteudo}
                    onRemover={() => setNotificacao(null)}
                />
            )}
            <div className={styles.container}>
                <div className={styles.header_part}>
                    <div className={styles.search_container}>
                        <i className={'fa fa-sliders ' + styles.filter_symbol}></i>
                        <select className={styles.tabelaSelect} value={filtro} onChange={(e) => {setFiltro(e.target.value)}}>
                            {
                                Array.isArray(colunas) &&
                                colunas.map((coluna, index) => (
                                    <option key={index} value={coluna.column}>{coluna.column}</option>
                                ))
                            }
                        </select>
                        <input value={filtroValue} type="text" onChange={(e) => setFiltroValue(e.target.value)} placeholder={"Filtre por " + filtro + "..."}></input>
                    </div>


                    <TabelaOption toCreate={false} setTabela={setTabela} setColumnRoute={setColumnRoute}/>
                </div>

                
                <div className={styles.tabela_container}>
                    <table className={styles.tabela}>
                        <thead>
                            <tr>
                                { Array.isArray(colunas) &&
                                colunas.map((coluna, index) => (
                                    <th key={index}>{coluna.column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            { Array.isArray(dados) &&
                            dados.map((item, index) => (
                                <tr key={index}>
                                    {colunas.map((coluna, colIndex) => (
                                        <td key={colIndex}>{item[coluna.column]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
            </div>


        </div>
    );

}

export default Listar;