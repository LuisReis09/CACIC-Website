import React from 'react';

import Nav from './Nav';
import TabelaOption from '@/utils/TabelaOption';

import styles from '../../styles/admin/Criar.module.css';
import { useAdminContext } from '@/utils/AdminContext';

const Criar: React.FC = () => {
    const [colunas, setColunas] = React.useState<any[]>([]);
    const [tabela, setTabela]   = React.useState<string>('professores');
    const [columnRoute, setColumnRoute] = React.useState<string>('/professores');
    const { token } = useAdminContext();

    const [formData, setFormData] = React.useState<{ [key: string]: any }>({});
    // Função para atualizar
    const handleChange = (column: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [column]: value,
        }));
    };

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

    const handleCreate = async () => {
        if (Object.keys(formData).length === 0) {
            alert('Por favor, preencha pelo menos um campo.');
            return;
        }

        fetch(`http://localhost:4000${columnRoute}/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registro criado com sucesso!');
                    setFormData({});
                } else {
                    alert('Erro ao criar registro: ' + data.message);
                }
            })
            .catch(error => {
                alert('Perdeu acesso ao servidor. Tente relogar.');
                // Recarrega a página:
                window.location.reload();
            });
    };

    React.useEffect(() => {
        fetchColunas();
    }, [tabela]);

    React.useEffect(() => {
        fetchColunas();
    }, []);


    return (
        <div className={styles.big_container}>
            <Nav />
            
            <div className={styles.container}>
                <TabelaOption setTabela={setTabela} setColumnRoute={setColumnRoute} toCreate={true} />

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

                <button className={styles.criar_button} onClick={handleCreate}>Criar</button>
            </div>

        </div>
    );

}

export default Criar;