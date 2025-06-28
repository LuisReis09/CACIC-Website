import React from 'react';

import Nav from './Nav';

import TabelaOption from '@/utils/TabelaOption';
import styles from '../../styles/admin/Atualizar.module.css';
import { useAdminContext } from '@/utils/AdminContext';


const Atualizar: React.FC = () => {
    const [colunas, setColunas] = React.useState<any[] | null>(null);
    const [tabela, setTabela]   = React.useState<string>('professores');
    const [columnRoute, setColumnRoute] = React.useState<string>('/professores');
    const [id, setId] = React.useState<number>(1);
    const { token } = useAdminContext();


    const [formData, setFormData] = React.useState<{ [key: string]: any }>({});

    const handleChange = (column: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [column]: value,
        }));
    }

    const handleUpdate = async () => {
        if (Object.keys(formData).length === 0) {
            alert('Por favor, preencha pelo menos um campo.');
            return;
        }

        fetch(`http://localhost:4000${columnRoute}/atualizar/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then(async response => { const text = await response.text(); return text ? JSON.parse(text) : null;})
            .then(data => {
                if (data.success) {
                    alert('Registro atualizado com sucesso!');
                    setFormData({});
                } else {
                    alert('Erro ao atualizar registro: ' + data.message);
                }
            })
            .catch(error => {
                alert('Perdeu acesso ao servidor. Tente relogar.');
                // Recarrega a página:
                window.location.reload();
            });
    }

    const fetchColunas = async () => {
        if(tabela) {
            fetch(`http://localhost:4000${columnRoute}/colunas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(async response => {
                    const text = await response.text();
                    return text ? JSON.parse(text) : null;
                })
                .then(data => setColunas(data))
                .catch(error => {
                    alert('Perdeu acesso ao servidor. Tente relogar.');
                    // Recarrega a página:
                    window.location.reload();
                });
        }
    }

    const fetchDados = async () => {
        if(tabela) {
            fetch(`http://localhost:4000${columnRoute}/consultar/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(async response => {
                    const text = await response.text();
                    return text ? JSON.parse(text) : null;
                })
                .then(data => {
                    // Retira o campo 'id' do objeto retornado e atualiza o formData
                    if (data) {
                        const { id, ...rest } = data;
                        setFormData(rest);
                    } else {
                        setFormData({});
                    }
                })
                .catch(error => {
                    alert('Perdeu acesso ao servidor. Tente relogar.');
                    // Recarrega a página:
                    window.location.reload();
                });
        }
    }

    React.useEffect(() => {
        fetchColunas();
    }, []);

    React.useEffect(() => {
        fetchColunas();
        fetchDados();
    }, [id, tabela]);

    return (
        <div className={styles.big_container}>
            <Nav />

            <div className={styles.container}>
                <TabelaOption setTabela={setTabela} setColumnRoute={setColumnRoute} toCreate={false} />
                <div className={styles.id_container}>
                    <label className={styles.label_id}>ID:</label>
                    <input type="number" onChange={(e) => setId(Number(e.target.value))} className={styles.input_id} placeholder="ID do registro..." />
                </div>

                <div className={styles.form_container}>
                    {Array.isArray(colunas) && colunas
                    .filter((coluna: any) => coluna.column != "id")
                    .map((coluna: any) => (
                        
                        <div key={coluna.column} className={styles.input_container}>
                            <label className={styles.label_cell}>{coluna.column}</label>

                            {coluna.type === 'string' ? (
                                <input 
                                    type="text" 
                                    onChange={(e) => handleChange(coluna.column, e.target.value)} 
                                    className={styles.input_cell} 
                                    placeholder={"Informe o(a) " + coluna.column}
                                    value={formData[coluna.column] || ''}
                                />
                            ) : coluna.type === 'number' ? (
                                <input 
                                    type="number" 
                                    onChange={(e) => handleChange(coluna.column, Number(e.target.value))} 
                                    className={styles.input_cell} 
                                    placeholder={"Informe o(a) " + coluna.column}
                                />
                            ) : coluna.type === 'boolean' ? (
                                <select onChange={(e) => handleChange(coluna.column, e.target.value)} className={styles.input_cell} value={formData[coluna.column] || ''}>
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                </select>
                            ) : coluna.type === 'enum' ? (
                                <select onChange={(e) => handleChange(coluna.column, e.target.value)} className={styles.input_cell} value={formData[coluna.column] || ''}>
                                    {coluna.options.map((value: string) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            ) : coluna.type === 'date' ? (
                                <input 
                                    type="datetime-local" 
                                    onChange={(e) => handleChange(coluna.column, e.target.value)} 
                                    className={styles.input_cell}
                                    value={formData[coluna.column] || ''}
                                />
                            ) : null}
                        </div>
                    ))}
                </div>

                <button className={styles.criar_button} onClick={handleUpdate}>Atualizar</button>
            </div>
        </div>
    );

}

export default Atualizar;