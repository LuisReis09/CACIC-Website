import React from 'react';

// Styles Imports
import styles from '../styles/utils/TopicCard.module.css'

interface TopicCardProps{
    topico: string;
    onClick: Function;
    download?: boolean;
    className?: string;
    img: string
}

const TopicCard: React.FC<TopicCardProps> = ({topico, onClick, img, className}) => {
    const symbol = (if_download: any) => if_download ? "fa fa-download" : "fa fa-arrow-right";

    return (
        <div className={styles.topic_card_box + " " + className} onClick={() => onClick()}
            style={{backgroundImage: `url(/topics/${img})`}}>

            <div className={styles.topic_arrow_circle} ></div>

            <p className={styles.topic_name}>{topico}</p>
        </div>
    )
}

export default TopicCard;