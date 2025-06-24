import React from 'react';
import { useAdminContext } from '@/utils/AdminContext';

import styles from '../../styles/admin/Nav.module.css';

const Nav: React.FC = () => {
    const { screen, setScreen } = useAdminContext();

    const ativo = (currentScreen: string) => {
        return screen === currentScreen ? styles.active : styles.inactive;
    }

    return (
        <div className={styles.admin_nav}>
            <p className={styles.admin_nav_element + ' ' + ativo('listar')} onClick={() => setScreen('listar')}>Listar</p>
            <p className={styles.admin_nav_element + ' ' + ativo('criar')} onClick={() => setScreen('criar')}>Criar</p>
            <p className={styles.admin_nav_element + ' ' + ativo('deletar')} onClick={() => setScreen('deletar')}>Deletar</p>
            <p className={styles.admin_nav_element + ' ' + ativo('atualizar')} onClick={() => setScreen('atualizar')}>Atualizar</p>
            <p className={styles.admin_nav_element + ' ' + ativo('outros')} onClick={() => setScreen('outros')}>Outros</p>
        </div>
    );

}

export default Nav;