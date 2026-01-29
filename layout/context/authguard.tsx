'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AuthContext } from './authcontext';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token && pathname !== '/auth/login') {
            router.push('/auth/login');
        }
    }, [isAuthenticated, pathname, router]);

    return <>{children}</>;
};
