import React from 'react';

import styles from '../../../styles/MonitoriaList.module.css';

interface MonitoriaListProps {
    setScreen: Function;
}

const MonitoriaList: React.FC<MonitoriaListProps> = ({setScreen}) => {
    const [monitorias, setMonitorias] = React.useState<any>();

    return (
        <div>
            <div>
                <i className="fa fa-arrow-left"></i>
                <h1>Informações {' > '} Monitorias</h1>
            </div>
        
            <div>

            </div>

            <p onClick={() => setScreen(false)}>Cadastrar Monitoria</p>
        </div>
    );
}

export default MonitoriaList;