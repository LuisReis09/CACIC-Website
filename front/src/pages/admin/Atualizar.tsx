import React from 'react';

import Nav from './Nav';

import TabelaOption from '@/utils/TabelaOption';
import styles from '../../styles/admin/Atualizar.module.css';
import { useAdminContext } from '@/utils/AdminContext';


const Atualizar: React.FC = () => {
    const [colunas, setColunas] = React.useState<any[]>([]);
    const [tabela, setTabela]   = React.useState<string>('professores');
    const [columnRoute, setColumnRoute] = React.useState<string>('/professores');
    const [id, setId] = React.useState<number>(0);
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
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registro atualizado com sucesso!');
                    setFormData({});
                } else {
                    alert('Erro ao atualizar registro: ' + data.message);
                }
            })
            .catch(error => console.error('Error updating record:', error));
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
                .then(response => response.json())
                .then(data => setColunas(data))
                .catch(error => console.error('Error fetching columns:', error));
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
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const firstRecord = data[0];
                        setFormData(firstRecord);
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
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
        <div>
            <Nav />

            <div className={styles.container}>
                <TabelaOption setTabela={setTabela} setColumnRoute={setColumnRoute} toCreate={true} />
                <div className={styles.id_container}>
                    <label className={styles.label_id}>ID:</label>
                    <input type="number" value={id} onChange={(e) => setId(Number(e.target.value))} className={styles.input_id} placeholder="ID do registro..." />
                </div>

                <div className={styles.form_container}>
                    {colunas
                    .filter((coluna: any) => coluna.column != "id")
                    .map((coluna: any) => (
                        
                        <div key={coluna.column} className={styles.input_container}>
                            <label className={styles.label_cell}>{coluna.column}</label>

                            {coluna.type === 'string' ? (
                                <input type="text" onChange={(e) => handleChange(coluna.column, e.target.value)} className={styles.input_cell} placeholder={"Informe o(a) " + coluna.column}/>
                            ) : coluna.type === 'number' ? (
                                <input type="number" onChange={(e) => handleChange(coluna.column, e.target.value)} className={styles.input_cell} placeholder={"Informe o(a) " + coluna.column}/>
                            ) : coluna.type === 'boolean' ? (
                                <select onChange={(e) => handleChange(coluna.column, e.target.value)} className={styles.input_cell}>
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                </select>
                            ) : coluna.type === 'enum' ? (
                                <select onChange={(e) => handleChange(coluna.column, e.target.value)} className={styles.input_cell}>
                                    {coluna.options.map((value: string) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            ) : coluna.type === 'date' ? (
                                <input type="datetime-local" onChange={(e) => handleChange(coluna.column, e.target.value)} className={styles.input_cell}/>
                            ) : null}
                        </div>
                    ))}
                </div>

                <button className={styles.criar_button} onClick={handleUpdate}>Criar</button>
            </div>
        </div>
    );

}

export default Atualizar;