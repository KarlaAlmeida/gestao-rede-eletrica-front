'use client';
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/service/AuthService';

export const AuthContext = createContext({
    isAuthenticated: false,
    roles: [] as string[],
    loading: true,
    login: (login: string, senha: string) => Promise.resolve(),
    logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setIsAuthenticated(AuthService.isAuthenticated());
        setRoles(AuthService.getUserRoles());
        setLoading(false);
    }, []);

    const login = async (login: string, senha: string) => {
        try {
            const response = await AuthService.login(login, senha);
            const token = response.data.token;
            AuthService.setToken(token);
            setIsAuthenticated(true);
            setRoles(AuthService.getUserRoles());
            router.push('/');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        setRoles([]);
        setLoading(false);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, roles, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
