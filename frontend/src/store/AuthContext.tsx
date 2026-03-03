import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

interface AuthContextType {
    token: string | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = async (email: string, pass: string) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', pass);

        const response = await api.post('/login/access-token', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const newToken = response.data.access_token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
