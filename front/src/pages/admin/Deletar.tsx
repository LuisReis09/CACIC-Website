import React from 'react';

import Nav from './Nav';
import TabelaOption from '@/utils/TabelaOption';
import { useAdminContext } from '@/utils/AdminContext';

import styles from '../../styles/admin/Deletar.module.css';

const Deletar: React.FC = () => {
    const [tabela, setTabela] = React.useState<string>('professores');
    const [columnRoute, setColumnRoute] = React.useState<string>('/professores');
    const [filtro, setFiltro] = React.useState<string>('id');
    const [filtroValue, setFiltroValue] = React.useState<string>('');
    const [colunas, setColunas] = React.useState<any[]>([]);
    const [dados, setDados] = React.useState<any[]>([]);
    const { token } = useAdminContext();

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
                alert('Perdeu acesso ao servidor. Tente relogar.');
                // Recarrega a página:
                window.location.reload();
            });
    }

    const handleOneDelete = (id: any) => {
        fetch('http://localhost:4000' + columnRoute + `/deletar/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(async response => { const text = await response.text(); return text ? JSON.parse(text) : null;})
            .then(data => {
                setDados(dados.filter(dado => dado.id !== id));
                alert('Item deletado com sucesso!');
            })
            .catch(error => {
                alert('Perdeu acesso ao servidor. Tente relogar.');
                // Recarrega a página:
                window.location.reload();
            });
    }

    const handleDeleteAll = () => {
        fetch('http://localhost:4000' + columnRoute + '/deletar',
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(async response => { const text = await response.text(); return text ? JSON.parse(text) : null;})
            .then(data => { 
                if (data.success) {
                    setDados([]);
                    alert('Todos os itens foram deletados com sucesso!');
                } else {
                    alert('Erro ao deletar todos os itens.');
                }
            }
            )
            .catch(error => {
                alert('Perdeu acesso ao servidor. Tente relogar.');
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
                alert('Perdeu acesso ao servidor. Tente relogar.');
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
                alert('Perdeu acesso ao servidor. Tente relogar.');
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
            
           <div className={styles.container}>
                <div className={styles.top_part}>
                    <div className={styles.top_left_part}>
                        <TabelaOption toCreate={false} setTabela={setTabela} setColumnRoute={setColumnRoute}/>
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


                    </div>

                    <button className={styles.delete_all_button} onClick={handleDeleteAll}>Deletar Tudo  <i className={"fa fa-trash"}></i></button>
                </div>

                <div className={styles.tabela_container +" scrollbar"}>
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
                                        <td
                                            key={colIndex}
                                            onClick={coluna.column === 'id' ? () => handleOneDelete(item["id"]) : undefined}
                                            style={coluna.column === 'id' ? { cursor: "pointer" } : undefined}
                                        >
                                        {item[coluna.column]}
                                        </td>
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

export default Deletar;