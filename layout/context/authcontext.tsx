'use client';
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/service/AuthService';

export const AuthContext = createContext({
    isAuthenticated: false,
    login: (login: string, senha: string) => Promise.resolve(),
    logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsAuthenticated(AuthService.isAuthenticated());
    }, []);

    const login = async (login: string, senha: string) => {
        try {
            const response = await AuthService.login(login, senha);
            const token = response.data.token;
            AuthService.setToken(token);
            setIsAuthenticated(true);
            router.push('/');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
