'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AuthContext } from './authcontext';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, roles, loading } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();

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
            if (!hasRole) {
                router.push('/auth/access');
            }
        }
    }, [isAuthenticated, pathname, router, roles, loading]);

    return <>{children}</>;
};

