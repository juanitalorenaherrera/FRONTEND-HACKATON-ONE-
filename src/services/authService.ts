// src/services/authService.ts

// 1. CORRECCIÓN: Importamos la instancia configurada de Axios desde './api.ts'

import { AuthResponse } from '../types/auth.types';
import { UserProfileDTO } from '../types/user.types';
import { api } from './api';

// 2. CORRECCIÓN: Importamos los tipos desde su ubicación central



// Creamos un tipo para la respuesta combinada para mayor claridad
interface LoginResponse {
  token: string;
  userProfile: UserProfileDTO;
}

export const authService = {
  /**
   * Realiza la petición de login al backend.
   */
  login: async (email, password): Promise<LoginResponse> => {
    // 3. CORRECCIÓN: Usamos 'api' en lugar de 'axios'
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return {
      token: response.token,
      userProfile: response.userProfile,
    };
  },

  /**
   * Obtiene el perfil del usuario autenticado a través del token.
   */
  getProfile: async (): Promise<UserProfileDTO> => {
    // 3. CORRECCIÓN: Usamos 'api'
    const response = await api.get<UserProfileDTO>(`/dashboard/profile`);
    return response.data;
  },

  /**
   * Registra un nuevo usuario.
   */
  register: async (registerData: any): Promise<any> => { // Reemplaza 'any' con un tipo de registro adecuado
    // 3. CORRECCIÓN: Usamos 'api'
    const response = await api.post(`/auth/register`, registerData);
    return response.data;
  },
};