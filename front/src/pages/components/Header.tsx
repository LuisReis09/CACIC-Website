import React from 'react';
import { useRouter } from 'next/router';

// css
import styles from "../../styles/components/Header.module.css";

const Header: React.FC = () => {
    const router = useRouter();

    return (
        <header className={styles.header}>

            <img src="/assets/logo.svg" alt="logo do Centro Acadêmico de Ciência da Computação - UFPB" onClick={() => router.push("/")} style={{ cursor: 'pointer' }}/>

            <div className={styles.header_text}>
                <h1 className="website_title"   >Centro Acadêmico de Ciência da Computação</h1>
                <h2 className="website_subtitle">Universidade Federal da Paraíba - Centro de Informática</h2>

                <div className={styles.header_university_logos}>
                    <img src="/assets/ufpb_logo.svg" alt="university_logo" style={{ cursor: 'pointer' }} onClick={() => window.open('https://www.ufpb.br/', '_blank')}></img>
                    <img src="/assets/ci_logo.svg" alt="center_logo" style={{ cursor: 'pointer' }} onClick={() => window.open('https://www.ci.ufpb.br/', '_blank')}></img>
                </div>
            </div>
        
        </header>
    )
}

export default Header;