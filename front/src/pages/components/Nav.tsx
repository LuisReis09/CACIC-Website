import React from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Styles Import
import styles from '../../styles/components/Nav.module.css';

const Nav: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = (path: string) => {
        if (pathname?.toLowerCase().includes(path?.toLowerCase())) 
            return `${styles.nav_link} ${styles.current_route}`
        else
            return `${styles.nav_link}`
    }

    return (
        <nav className={styles.nav}>
            <Link href="/" className={pathname == '/' ? `${styles.nav_link} ${styles.current_route}` : styles.nav_link}>Início</Link>
            <Link href="/Infos" className={isActive("/Infos")}>Informações Úteis</Link>
            <Link href="/Sobre" className={isActive("/Sobre")}>Sobre Nós</Link>
            <Link href="/Contato" className={isActive("/Contato")}>Contato</Link>
            <Link href="/Jogos" className={isActive("/Jogos")}>Jogos</Link>
        </nav>
    )
}

export default Nav;