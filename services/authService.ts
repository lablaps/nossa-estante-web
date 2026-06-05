import api from './api';
import { User } from '../types';

const AUTH_KEY = 'ns_auth_token';
const REFRESH_KEY = 'ns_refresh_token';

class AuthService {
  private parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  private mapUserFromToken(token: string): User | null {
    const payload = this.parseJwt(token);
    if (!payload) return null;

    const email = payload.sub || '';
    return {
      id: '0', // Placeholder or extract if present in claims
      name: email.split('@')[0], // Using email prefix as name since backend doesn't provide it on login
      email: email,
      role: payload.role,
      credits: 0,
      reputation: 0
    };
  }

  private mapUser(data: any): User {
    return {
      id: data.id?.toString() || '0',
      name: data.name || '',
      email: data.email || '',
      role: data.role,
      credits: 0,
      reputation: 0
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

      const user = this.mapUserFromToken(accessToken);
      if (!user) return null;

      return { token: accessToken, user };
    } catch (error) {
      throw error;
    }
  }

  async signup(data: {
    name: string;
    email: string;
    password_raw: string;
    passwordConfirmation?: string;
    role: string;
    cpf?: string;
    birthDate?: string;
    phone?: string;
    profession?: string;
    linkedInstitution?: string;
    course?: string;
    semester?: string;
    position?: string;
    organization?: string;
    department?: string;
    roleDescription?: string;
  }): Promise<{ token: string; user: User } | null> {
    try {
      await api.post('/auth/register', {
        name: data.name,
        cpf: data.cpf,
        birthDate: data.birthDate,
        phone: data.phone,
        email: data.email,
        password: data.password_raw,
        passwordConfirmation: data.passwordConfirmation || data.password_raw,
        role: data.role,
        profession: data.profession,
        linkedInstitution: data.linkedInstitution,
        course: data.course,
        semester: data.semester,
        position: data.position,
        organization: data.organization,
        department: data.department,
        roleDescription: data.roleDescription
      });

      try {
        return await this.login(data.email, data.password_raw);
      } catch (error) {
        return {
          token: '',
          user: {
            id: '0',
            name: data.name,
            email: data.email,
            role: data.role,
            credits: 0,
            reputation: 0
          }
        };
      }
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) return null;

    const user = this.mapUserFromToken(token);
    if (!user) {
      this.logout();
      return null;
    }

    return user;
  }

  async updateProfile(data: Partial<User>): Promise<User | null> {
    const response = await api.put('/users/me', {
      name: data.name
    });
    return this.mapUser(response.data);
  }

  async finishTutorial(): Promise<void> {
    localStorage.setItem('ns_tutorial_finished', 'true');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  }
}

export const authService = new AuthService();
