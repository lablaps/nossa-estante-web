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
      role: u.role
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

  async signup(name: string, email: string, password_raw: string): Promise<{ token: string; user: User } | null> {
    try {
      await api.post('/auth/register', {
        name,
        email,
        password: password_raw,
        role: 'REGULAR'
      });

      return this.login(email, password_raw);
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

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  }
}

export const authService = new AuthService();
