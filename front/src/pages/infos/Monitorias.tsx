import React from 'react';

// Styles Imports
import styles from '../../styles/infos/Monitorias.module.css';

// Component Imports
import MonitoriaList from 'monitorias/MonitoriaList';
import InscreverMonitoria from 'monitorias/InscreverMonitoria';

const Monitorias: React.FC = () => {
    const [na_lista, setScreen] = React.useState<boolean>(true);

    if (na_lista)
        return <MonitoriaList      setScreen={setScreen}/>
    else 
        return <InscreverMonitoria setScreen={setScreen}/>;
}

export default Monitorias;