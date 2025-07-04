import React from 'react';
import { useRouter } from 'next/router';

// Styles Imports
import styles from '../../styles/infos/Monitorias.module.css';

// Component Imports
import MonitoriaCard from '../../utils/MonitoriaCard';

const Monitorias: React.FC = () => {
    const [monitorias, setMonitorias] = React.useState<any>(null);
    const router = useRouter();

    const fetchMonitorias = async () => {
        fetch(`http://localhost:4000/monitorias/listar`)
            .then(response => response.json())
            .then(data => {
                setMonitorias(data);
                console.log("Monitorias:", monitorias);
            })
            .catch(error => {
                console.error("Erro ao buscar monitorias:", error);
            });
    }

    React.useEffect(() => {
        fetchMonitorias();
    }, []);

    return (
        <div className={"main_container " + styles.monitorias_container}>
            <div className={styles.header}>
                <div className={styles.back_button} onClick={() => router.push('/Infos')}>
                <i className={"fa fa-caret-left" + " " + styles.i} />
                </div>
                <p>Informações das Monitorias</p>
            </div>
        
            <div className={styles.main_content}>
            <div className={styles.monitorias_box + " scrollbar"}>
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