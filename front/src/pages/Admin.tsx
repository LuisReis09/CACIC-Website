import React from 'react';

// Import Admin Hook
import { useAdminContext } from '../utils/AdminContext';

// Import Components
import Login from './admin/Login';
import Listar from './admin/Listar';
import Criar from './admin/Criar';
import Deletar from './admin/Deletar';
import Atualizar from './admin/Atualizar';
import Outros from './admin/Outros';

const Admin: React.FC = () => {
    // Use Admin Context
    const { screen } = useAdminContext();


    const renderScreen = (screen: string) => {
        switch (screen) {
            case 'login':
                return <Login />
            case 'listar':
                return <Listar />
            case 'criar':
                return <Criar />
            case 'deletar':
                return <Deletar />
            case 'atualizar':
                return <Atualizar />
            case 'outros':
                return <Outros />
            default:
                return <h1>Screen not found</h1>;
        }
    }

    return renderScreen(screen)
           
}

export default Admin;