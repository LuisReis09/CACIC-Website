import React from 'react';

import Nav from './Nav';
import TabelaOption from '@/utils/TabelaOption';

import styles from '../../styles/admin/Criar.module.css';
import { useAdminContext } from '@/utils/AdminContext';

import { Notificacao, NotificacaoTipo } from '../../utils/Notificacao';

const Criar: React.FC = () => {
    const [colunas, setColunas] = React.useState<any[]>([]);
    const [tabela, setTabela]   = React.useState<string>('professores');
    const [columnRoute, setColumnRoute] = React.useState<string>('/professores');
    const [jsonFile, setJsonFile] = React.useState<File | null>(null);
    const { token } = useAdminContext();

    const [formData, setFormData] = React.useState<{ [key: string]: any }>({});
    const [notificacao, setNotificacao] = React.useState<{
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
    } | null>(null);

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
                .catch(() => {
                    setNotificacao({
                        tipo: NotificacaoTipo.ERRO,
                        titulo: "Erro",
                        conteudo: "Perdeu acesso ao servidor. Tente relogar."
                    });
                    window.location.reload();
                });
        }
    }

    const handleCreate = async () => {
        if (Object.keys(formData).length === 0) {
            setNotificacao({
                tipo: NotificacaoTipo.ATENCAO,
                titulo: "Atenção!",
                conteudo: "Por favor, preencha pelo menos um campo."
            });
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
            .then(() => {
                setNotificacao({
                    tipo: NotificacaoTipo.SUCESSO,
                    titulo: "Cadastro realizado",
                    conteudo: "Seu cadastro foi realizado com sucesso!"
                });
                setFormData({});
            })
            .catch(() => {
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: "Erro",
                    conteudo: "Perdeu acesso ao servidor. Tente relogar."
                });
                window.location.reload();
            });
    };

    const handleJsonCreate = async () => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const jsonData = e.target?.result;
            if (typeof jsonData === 'string') {
                try {
                    const data = JSON.parse(jsonData);
                    if (!Array.isArray(data)) {
                        setNotificacao({
                            tipo: NotificacaoTipo.ERRO,
                            titulo: "Erro",
                            conteudo: "O arquivo JSON deve conter um array de objetos."
                        });
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
                        .then(() => {
                            setNotificacao({
                                tipo: NotificacaoTipo.SUCESSO,
                                titulo: "Cadastro Realizado",
                                conteudo: "Seu cadastro foi realizado com sucesso!"
                            });
                        })
                        .catch(() => {
                            setNotificacao({
                                tipo: NotificacaoTipo.ERRO,
                                titulo: "Erro ao cadastrar",
                                conteudo: "Perdeu acesso ao servidor. Tente relogar."
                            });
                            window.location.reload();
                        });
                } catch (error) {
                    setNotificacao({
                        tipo: NotificacaoTipo.ERRO,
                        titulo: "Erro ao processar JSON",
                        conteudo: "Certifique-se de que o arquivo está no formato correto."
                    });
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jsonFile]);


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
                <TabelaOption setTabela={setTabela} setColumnRoute={setColumnRoute} toCreate={true} />

                <div className={styles.form_container}>
                    {Array.isArray(colunas) && colunas
                    .filter((coluna: any) => coluna.column !== "id")
                    .map((coluna: any) => (
                        <div key={coluna.column} className={styles.input_container}>
                            <label className={styles.label_cell}>{coluna.column}</label>

                            {coluna.type === 'string' ? (
                                <input type="text" onChange={(e) => handleChange(coluna.column, e.target.value)} className={styles.input_cell} placeholder={"Informe o(a) " + coluna.column} />
                            ) : coluna.type === 'number' ? (
                                <input type="number" onChange={(e) => handleChange(coluna.column, Number(e.target.value))} className={styles.input_cell} placeholder={"Informe o(a) " + coluna.column} />
                            ) : coluna.type === 'boolean' ? (
                                <select onChange={(e) => handleChange(coluna.column, e.target.value === "true")} className={styles.input_cell}>
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
                                <input type="datetime-local" onChange={(e) => handleChange(coluna.column, e.target.value)} className={styles.input_cell} />
                            ) : null}
                        </div>
                    ))}
                </div>

                <div className={styles.button_container}>
                    <button className={styles.criar_button} onClick={handleCreate}>Criar</button>
                    {
                        (tabela === 'professores' || tabela === 'laboratorios' || tabela === 'jogos' || tabela === 'monitorias') &&
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