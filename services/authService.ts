import api from './api';
import { User } from '../types';

const AUTH_KEY = 'ns_auth_token';
const REFRESH_KEY = 'ns_refresh_token';

class AuthService {
  private mapUser(u: any): User {
    return {
      id: u.id?.toString() || '',
      name: u.name || 'User',
      email: u.email || '',
      reputation: u.reputation || 5.0,
      credits: u.credits || 0,
      avatar: u.avatar || `https://picsum.photos/seed/${u.id}/200`,
      role: u.role,
      cpf: u.cpf,
      phone: u.phone,
      birthDate: u.birthDate,
      address: u.address,
      isFirstAccess: u.isFirstAccess ?? true
    };
  }

  async login(email: string, password_raw: string): Promise<{ token: string; user: User } | null> {
    try {
      const response = await api.post('/auth/login', {
        email,
        password: password_raw
      });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem(AUTH_KEY, accessToken);
      localStorage.setItem(REFRESH_KEY, refreshToken);

      const user = await this.getCurrentUser();
      if (!user) return null;

      return { token: accessToken, user };
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  async signup(data: { name: string; email: string; password_raw: string; role: string; cpf?: string; phone?: string; birthDate?: string; address?: string }): Promise<{ token: string; user: User } | null> {
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password_raw,
        role: data.role,
        cpf: data.cpf,
        phone: data.phone,
        birthDate: data.birthDate,
        address: data.address
      });

      return this.login(data.email, data.password_raw);
    } catch (error) {
      console.error('Signup failed:', error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      return this.mapUser(response.data);
    } catch (e) {
      this.logout();
      return null;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User | null> {
    try {
      const response = await api.put('/auth/me', {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        birthDate: data.birthDate,
        address: data.address,
        role: data.role,
        password: 'REDACTED' // Backend UserRequest requires password at the moment, but the update endpoint doesn't actually use it for updating. I should check if I can make it optional on backend.
      });
      return this.mapUser(response.data);
    } catch (error) {
      console.error('Update profile failed:', error);
      return null;
    }
  }

  async finishTutorial(): Promise<User | null> {
    console.log('[AuthService] Iniciando finishTutorial...');
    try {
      const response = await api.patch('/auth/me/finish-tutorial');
      console.log('[AuthService] Resposta da API:', response.data);
      return this.mapUser(response.data);
    } catch (error) {
      console.error('[AuthService] Erro na requisição PATCH:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  }
}

export const authService = new AuthService();
