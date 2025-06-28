import React from 'react';

import Nav from './Nav';
import TabelaOption from '@/utils/TabelaOption';

import styles from '../../styles/admin/Criar.module.css';
import { useAdminContext } from '@/utils/AdminContext';

const Criar: React.FC = () => {
    const [colunas, setColunas] = React.useState<any[]>([]);
    const [tabela, setTabela]   = React.useState<string>('professores');
    const [columnRoute, setColumnRoute] = React.useState<string>('/professores');
    const [jsonFile, setJsonFile] = React.useState<File | null>(null);
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
                .then(async response => { const text = await response.text(); return text ? JSON.parse(text) : null;})
                .then(data => setColunas(data))
                .catch(error => {
                    alert('Perdeu acesso ao servidor. Tente relogar.');
                    // Recarrega a página:
                    window.location.reload();
                });
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
            .then(async response => { const text = await response.text(); return text ? JSON.parse(text) : null;})
            .then(data => {
                alert('Cadastro realizado com sucesso!');
            })
            .catch(error => {
                alert('Perdeu acesso ao servidor. Tente relogar.');
                // Recarrega a página:
                window.location.reload();
            });
    };

    const handleJsonCreate = async () => {

        // Lê o array de objetos que vem do arquivo JSON, enviando este array para o servidor
        const reader = new FileReader();
        reader.onload = async (e) => {
            const jsonData = e.target?.result;
            if (typeof jsonData === 'string') {
                try {
                    const data = JSON.parse(jsonData);
                    if (!Array.isArray(data)) {
                        alert('O arquivo JSON deve conter um array de objetos.');
                        return;
                    }

                    fetch(`http://localhost:4000${columnRoute}/cadastrarMuitos`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(data),
                    })
                        .then(async response => { const text = await response.text(); return text ? JSON.parse(text) : null;})
                        .then(data => {
                            alert('Cadastro realizado com sucesso!');
                        })
                        .catch(error => {
                            alert('Perdeu acesso ao servidor. Tente relogar.');
                            // Recarrega a página:
                            window.location.reload();
                        });
                } catch (error) {
                    alert('Erro ao processar o arquivo JSON. Certifique-se de que ele está no formato correto.');
                }
            }
        };

        if(jsonFile)
            reader.readAsText(jsonFile);
    }

    React.useEffect(() => {
        fetchColunas();
    }, [tabela]);

    React.useEffect(() => {
        fetchColunas();
    }, []);

    React.useEffect(() => {
        if (jsonFile != null) {
            handleJsonCreate();
        }
    }, [jsonFile]);


    return (
        <div className={styles.big_container}>
            <Nav />
            
            <div className={styles.container}>
                <TabelaOption setTabela={setTabela} setColumnRoute={setColumnRoute} toCreate={true} />

                <div className={styles.form_container}>
                    {Array.isArray(colunas) && colunas
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

                <div className={styles.button_container}>
                    <button className={styles.criar_button} onClick={handleCreate}>Criar</button>
                    {
                        (tabela == 'professores' || tabela == 'laboratorios' || tabela == 'jogos') &&
                        <div>
                            <input 
                                className={styles.json_criar_button} 
                                type="file" 
                                accept=".json"
                                onChange={(e) => setJsonFile(e.target.files ? e.target.files[0] : null)}
                                id="jsonFile_input"
                                hidden
                            />
                            <label htmlFor="jsonFile_input" className={styles.json_criar_button}>Arquivo JSON</label>
                        </div>
                    }
                </div>
            </div>

        </div>
    );

}

export default Criar;