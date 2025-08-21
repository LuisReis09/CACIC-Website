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
    
    const [notificacao, setNotificacao] = React.useState<{
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
    } | null>(null);


    const fetchDados = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${columnRoute}/listar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken') // Use localStorage to get the token
            }
        })
            .then(async response => { 
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            })
            .then(data => {
                setDados(data);
            })
            .catch(error => {
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: "Erro",
                    conteudo: "Perdeu acesso ao servidor. Tente relogar."
                });          
                
                setTimeout(() => {
                    window.location.reload();
                }, 2000);;
            });
    }

    const fetchColunas = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + columnRoute + '/colunas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken') // Use localStorage to get the token
            }
        })
            .then(async response => { 
                if (!response.ok) {
                    throw new Error('Erro ao buscar colunas');
                }
                const text = await response.text(); 
                return text ? JSON.parse(text) : null;
            })
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
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
    }

    const fetchBusca = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + columnRoute + `/buscar/${filtro}/${filtroValue}/${getTipo(filtro)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken') // Use localStorage to get the token
            },
        })
            .then(async response => { 
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            })
            .then(data => {
                setDados(data);
            })
            .catch(error => {
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: "Erro",
                    conteudo: "Perdeu acesso ao servidor. Tente relogar."
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
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

                
                <div className={styles.tabela_container + ' scrollbar'}>
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
                                        <td key={colIndex} className={coluna.column != "id" ? styles.not_bold : ''}>{item[coluna.column]}</td>
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