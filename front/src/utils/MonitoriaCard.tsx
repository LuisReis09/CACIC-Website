import React from 'react';

import styles from '@/styles/utils/MonitoriaCard.module.css';

interface MonitoriaCardProps {
    monitoria: any;
}

const MonitoriaCard: React.FC<MonitoriaCardProps> = ({ monitoria }) => {
    const monitores = monitoria.monitores.split(';').map((monitor: string) => monitor.trim());
    const emails    = monitoria.emailMonitor.split(';').map((email: string) => email.trim());

    return (
        <div className={styles.monitoria_card}>
            <div className={styles.monitoria_header}>
                <div className={styles.monitoria_info}>
                    <h1>{monitoria.disciplina}</h1>
                    <h2>{monitoria.professor}</h2>
                </div>

                <div className={styles.monitoria_links}>
                    {monitoria.linkDiscord.trim()   && <a className={styles.discord_link} href={monitoria.linkDiscord} target="_blank"></a>}
                    {monitoria.linkWhatsapp.trim()  && <a className={styles.whatsapp_link} href={monitoria.linkWhatsapp} target="_blank"></a>}
                </div>
            </div>

            <div className={styles.monitoria_monitores}>
                {
                    monitores.map((monitor: string, index: number) => (
                        <div key={index} className={styles.monitoria_monitor}>
                            <p className={styles.monitoria_monitor_nome}>{monitor}</p>
                            <p className={styles.monitoria_monitor_email}>{emails[index]}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );

}

export default MonitoriaCard;