
import { dbService } from './dbService';
import { User } from '../types';

const AUTH_KEY = 'ns_auth_token';

class AuthService {
  private base64Encode(str: string) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  private base64Decode(str: string) {
    return decodeURIComponent(escape(atob(str)));
  }

  login(email: string, password_raw: string): { token: string; user: User } | null {
    const users = dbService.getUsers();
    const user = users.find(u => u.email === email);

    if (user) {
      // In a real mock, we'd check password, but here we just simulate
      const header = this.base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = this.base64Encode(JSON.stringify({
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24h
      }));
      const signature = 'fake_signature';
      const token = `${header}.${payload}.${signature}`;

      localStorage.setItem(AUTH_KEY, token);
      return { token, user };
    }
    return null;
  }

  signup(name: string, email: string, password_raw: string, role: string = 'REGULAR'): { token: string; user: User } | null {
    const users = dbService.getUsers();
    if (users.some(u => u.email === email)) return null;

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      reputation: 5.0,
      credits: 5,
      avatar: `https://picsum.photos/seed/${name}/200`,
      role
    };

    dbService.saveUsers([...users, newUser]);
    return this.login(email, password_raw);
  }

  logout() {
    localStorage.removeItem(AUTH_KEY);
  }

  getCurrentUser(): User | null {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) return null;

    try {
      const parts = token.split('.');
      const payload = JSON.parse(this.base64Decode(parts[1]));

      if (payload.exp < Math.floor(Date.now() / 1000)) {
        this.logout();
        return null;
      }

      const users = dbService.getUsers();
      return users.find(u => u.id === payload.userId) || null;
    } catch (e) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}

export const authService = new AuthService();
