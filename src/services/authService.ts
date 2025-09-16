<<<<<<< HEAD
// src/services/authService.ts
import axios from '../services/auth';
import type {
	LoginResponse,
	Profile,
	RegisterResponse,
} from '../types/authStore';

/**
 * Inicia sesión, guarda el token y devuelve los datos del usuario.
 */
export const loginRequest = async (
	email: string,
	password: string
): Promise<LoginResponse> => {
	const res = await axios.post<LoginResponse>('/api/users/login', {
		email,
		password,
	});
	return res.data;
};
/**
 * Obtiene el perfil del usuario autenticado a través del token.
 */
export const getProfile = async (): Promise<Profile> => {
	const response = await axios.get<Profile>(`/api/dashboard/profile`);
	return response.data;
};
/**
 * Registra un nuevo usuario. (Función que ya tenías)
 */
export const registerRequest = async (
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	address: string,
	phoneNumber: string
): Promise<RegisterResponse> => {
	const response = await axios.post<RegisterResponse>(`/api/users/register`, {
		firstName,
		lastName,
		email,
		password,
		address,
		phoneNumber,
	});
	console.log(response.data);

	return response.data;
};
=======
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
>>>>>>> 3f401aec90ace12b8f9457208693584aabc9e409
