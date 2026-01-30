'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './authcontext';
import AccessDeniedContent from '../components/AccessDeniedContent';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, roles, loading } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(true);

    useEffect(() => {
        if (loading) return;

        const token = localStorage.getItem('token');
        if (!token && pathname !== '/auth/login') {
            router.push('/auth/login');
            return;
        }

        // Example of role-based page protection
        const protectedRoutes: { [key: string]: string[] } = {
            '/pages/ativo': ['ROLE_ADMIN'],
            '/pages/tecnico': ['ROLE_ADMIN']
        };

        if (isAuthenticated && protectedRoutes[pathname]) {
            const allowedRoles = protectedRoutes[pathname];
            const hasRole = allowedRoles.some((role) => roles.includes(role));
            setIsAuthorized(hasRole);
        } else {
            setIsAuthorized(true);
        }
    }, [isAuthenticated, pathname, router, roles, loading]);

    if (!isAuthorized) {
        return <AccessDeniedContent />;
    }

    return <>{children}</>;
};
