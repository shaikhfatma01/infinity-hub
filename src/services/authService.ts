/**
 * InfinityHub Authentication Service
 */
import { api, setAuthToken, clearAuthToken, getAuthToken } from './apiClient';
import { User } from '../types';

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export const authService = {
  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return api.get<{ user: User }>('/auth/me');
  },

  logout(): void {
    clearAuthToken();
  },

  isAuthenticated(): boolean {
    return !!getAuthToken();
  },
};
