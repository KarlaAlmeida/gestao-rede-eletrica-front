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
}

export default new AuthService();
