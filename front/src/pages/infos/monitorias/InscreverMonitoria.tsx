import React from 'react';

// Styles Imports
import styles from '../../../styles/Monitorias.module.css';

interface InscreverMonitoriaProps {
    setScreen: Function;
}

const InscreverMonitoria: React.FC<InscreverMonitoriaProps> = ({setScreen}) => {
    const [quantidade, setQuantidade] = React.useState(1);

    return (
        <div>
            <div>
                <i className="fa fa-arrow-left" onClick={setScreen(true)}></i>
                <h1>Informações {' > '} Monitorias {' > '} Inscrever-se</h1>
            </div>
        
            <div>
                <div>
                    <label htmlFor="nome">Nome da Disciplina:</label>
                    <input type="text" name="nome" placeholder="Introdução à Programação" />
                </div>
                <div>
                    <label htmlFor="professor">Professor:</label>
                    <input type="text" name="professor" placeholder="Dra. Elisa" />
                </div>
                <div>
                    <div>
                        <label htmlFor="monitores">Monitores:</label>
                        <i onClick={() => setQuantidade(quantidade+1)}></i>
                        <i onClick={() => setQuantidade(quantidade-1)}></i>
                    </div>

                    {/* quantidade.map((_, index) => {
                        <MonitorInput key={index}/>
                    }) */}
                </div>

            </div>
        </div>
    );
}

export default InscreverMonitoria;