import { AuthResponse, LoginDTO, RegisterDTO, User } from '../types/user.types';

import { ApiResponse } from '../types/api.types';
import { apiClient } from './api';

export class AuthService {
  // POST /auth/login
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  }

  // POST /auth/register
  async register(userData: RegisterDTO): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data;
  }

  // POST /auth/logout
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    this.clearLocalStorage();
  }

  // GET /auth/me
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }

  // POST /auth/refresh
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('petcare_refresh_token');
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refreshToken
    });
    return response.data.data;
  }

  // POST /auth/forgot-password
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  // POST /auth/reset-password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  }

  // Local storage management
  setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('petcare_token', authResponse.token);
    localStorage.setItem('petcare_refresh_token', authResponse.refreshToken);
    localStorage.setItem('petcare_user', JSON.stringify(authResponse.user));
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('petcare_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('petcare_token');
  }

  clearLocalStorage(): void {
    localStorage.removeItem('petcare_token');
    localStorage.removeItem('petcare_refresh_token');
    localStorage.removeItem('petcare_user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();