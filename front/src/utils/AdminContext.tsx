// Define um contexto para o Admin, guardando o estado da tela e o token de login

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';

interface AdminContextType {
    screen: string;
    setScreen: (screen: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [screen, setScreen] = useState<string>('login');
    const router = useRouter();

    return (
        <AdminContext.Provider value={{ screen, setScreen}}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminContext = (): AdminContextType => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminContext must be used within an AdminProvider');
    }
    return context;
};