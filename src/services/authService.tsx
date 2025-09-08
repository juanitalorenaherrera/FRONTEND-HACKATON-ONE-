// src/services/authService.ts

import type { User } from '../types/user';
import axios from 'axios';

const API_URL = 'http://localhost:8088';

// 1. (Opcional pero recomendado) Creamos una interfaz para la respuesta del login
interface LoginResponse {
  token: string;
  userProfile: User;
}

/**
 * Inicia sesión, guarda el token y devuelve los datos del usuario.
 */
export const login = async (credentials: { email: string; password: string }): Promise<User> => {
  // 2. Usamos la nueva interfaz para decirle a Axios qué esperamos
  const response = await axios.post<LoginResponse>(`${API_URL}/api/users/login`, credentials);
  
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  
  // 3. Devolvemos la propiedad correcta: userProfile
  return response.data.userProfile;
};


/**
 * Obtiene el perfil del usuario autenticado a través del token.
 */
export const getProfile = async (): Promise<User> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No se encontró el token de autenticación.');
  }

  const response = await axios.get<User>(`${API_URL}/api/dashboard/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * Limpia el token de autenticación del almacenamiento local.
 */
export const logout = (): void => {
  localStorage.removeItem('authToken');
};

/**
 * Registra un nuevo usuario. (Función que ya tenías)
 */
export const register = async (
  name: string, 
  email: string, 
  password: string, 
  role: 'client' | 'sitter'
): Promise<User> => {
  const response = await axios.post<User>(`${API_URL}/api/users/register`, { name, email, password, role });
  return response.data;
};