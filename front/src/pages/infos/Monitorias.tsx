import React from 'react';
import { useRouter } from 'next/router';

// Styles Imports
import styles from '../../styles/infos/Monitorias.module.css';

// Component Imports
import MonitoriaCard from '../../utils/MonitoriaCard';
import { Notificacao, NotificacaoTipo } from '../../utils/Notificacao';

const Monitorias: React.FC = () => {
    const [monitorias, setMonitorias] = React.useState<any>(null);
    const router = useRouter();
    const [notificacao, setNotificacao] = React.useState<{
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
    } | null>(null);

    const fetchMonitorias = async () => {
        fetch(`http://localhost:4000/monitorias/listarAprovadas`)
            .then(response => response.json())
            .then(data => {
                setMonitorias(data);
            })
            .catch(error => {
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro ao carregar monitorias',
                    conteudo: 'Ocorreu um erro ao carregar as monitorias. Por favor, tente novamente mais tarde.'
                });
            });
    }

    React.useEffect(() => {
        fetchMonitorias();
    }, []);

    return (
        <div className={"main_container " + styles.monitorias_container}>
            {
                notificacao && 
                <Notificacao 
                    tipo={notificacao.tipo} 
                    titulo={notificacao.titulo} 
                    conteudo={notificacao.conteudo} 
                    onRemover={() => setNotificacao(null)} />
            }

            <div className={styles.header}>
                <div className={styles.back_button} onClick={() => router.push('/Infos')}>
                <i className={"fa fa-caret-left" + " " + styles.i} />
                </div>
                <p>Informações das Monitorias</p>
            </div>
        
            <div className={styles.main_content}>
            <div className={styles.monitorias_box}>
                {
                    monitorias?.map((monitoria: any, index: number) => {
                        return <MonitoriaCard key={index} monitoria={monitoria} />
                    })
                }
            </div>
            </div>

            <button onClick={() => router.push("/infos/CadastrarMonitoria")} className={styles.cadastrar_button}>Cadastrar Monitoria</button>
        </div>
    );
}

export default Monitorias;