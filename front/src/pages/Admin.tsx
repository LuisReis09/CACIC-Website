import React from 'react';

// Import Admin Hook
import { useAdminContext } from '../utils/AdminContext';

// Import Components
import Login from './admin/Login';
import Select from './admin/Select';

const Admin: React.FC = () => {
    // Use Admin Context
    const { screen } = useAdminContext();


    const renderScreen = (screen: string) => {
        switch (screen) {
            case 'login':
                return <Login />
            case 'select':
                return <Select />
            // case 'insert':
            //     return <Insert />
            // case 'update':
            //     return <Update />
            // case 'delete':
            //     return <Delete />
            default:
                return <h1>Screen not found</h1>;
        }
    }

    return renderScreen(screen)
           
}

export default Admin;