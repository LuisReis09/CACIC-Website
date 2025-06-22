// React Imports
import React from 'react';
import { useRouter } from 'next/router';

// Components Imports
import TopicCard from '../utils/TopicCard'
import styles from '../styles/Infos.module.css'

const Infos: React.FC = () => {
    const router = useRouter();

    return (
        <div className={"main_container" + " " + styles.infos_container}>
            <h2 className={styles.h2}>Selecione um tópico</h2>
            <div className={styles.topics_container}>
                <TopicCard  className= {styles.topic_card} topico="Professores"              
                            onClick={() => router.push("/infos/Professores")}               img='professors_card.svg'/>
                <TopicCard  className= {styles.topic_card} topico="Monitorias"               
                            onClick={() => router.push("/infos/Monitorias")}                img='monitors_card.svg'/>
                <TopicCard  className= {styles.topic_card} topico="Grupos do Whatsapp"          
                            onClick={() => router.push("/infos/Grupos")}                    img='whatsapp_card.svg'/>
                <TopicCard  className= {styles.topic_card} topico="Fluxograma das Cadeiras"  
                            onClick={() => console.log("Baixando arquivo...")}              img='flowchart_card.svg'/>
            </div>
        </div>
    );

}

export default Infos;