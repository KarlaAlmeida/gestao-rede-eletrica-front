import api from './BaseService';

export class AuthService {
    login(login: string, senha: string) {
        return api.post('/auth/login', { login, senha });
    }

    logout() {
        localStorage.removeItem('token');
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    decodeToken(token: string) {
        try {
            const payload = token.split('.')[1];
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = JSON.parse(atob(base64));
            return decoded;
        } catch (e) {
            return null;
        }
    }

    getUserRoles(): string[] {
        const token = this.getToken();
        if (!token) return [];
        const decoded = this.decodeToken(token);
        if (!decoded) return [];

        // Handling common JWT role claim names
        const roles = decoded.roles || decoded.role || decoded.authorities || [];
        return Array.isArray(roles) ? roles : [roles];
    }

    hasRole(role: string): boolean {
        const roles = this.getUserRoles();
        return roles.includes(role);
    }
}

export default new AuthService();
