'use client';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AuthContext } from './authcontext';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
    const { roles, isAuthenticated, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (isAuthenticated) {
            const hasRole = allowedRoles.some((role) => roles.includes(role));
            if (!hasRole) {
                router.push('/auth/access');
            }
        }
    }, [isAuthenticated, roles, allowedRoles, router, loading]);

    return <>{children}</>;
};
