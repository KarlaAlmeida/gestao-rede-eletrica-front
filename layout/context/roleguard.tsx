'use client';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './authcontext';
import AccessDeniedContent from '../components/AccessDeniedContent';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
    const { roles, isAuthenticated, loading } = useContext(AuthContext);
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(true);

    useEffect(() => {
        if (loading) return;

        if (isAuthenticated) {
            const hasRole = allowedRoles.some((role) => roles.includes(role));
            setIsAuthorized(hasRole);
        }
    }, [isAuthenticated, roles, allowedRoles, router, loading]);

    if (!isAuthorized) {
        return <AccessDeniedContent />;
    }

    return <>{children}</>;
};
