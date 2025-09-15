// src/services/authService.ts

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth';

import authApi from './auth'; // Nuestra instancia configurada de Axios

/**
 * Envía las credenciales del usuario para iniciar sesión.
 * @param credentials - Un objeto que contiene el email y la contraseña.
 * @returns Una promesa que se resuelve con el token y el perfil del usuario.
 */
export const loginRequest = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await authApi.post<LoginResponse>('/api/users/login', credentials);
  return data;
};

/**
 * Función de compatibilidad para el código existente que pasa email y password por separado
 * @deprecated Usa loginRequest con un objeto credentials en su lugar
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return loginRequest({ email, password });
};

/**
 * Función de compatibilidad para el código existente que pasa parámetros por separado
 * @deprecated Usa registerRequest con un objeto userData en su lugar
 */
export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  address?: string,
  phoneNumber?: string
): Promise<RegisterResponse> => {
  return registerRequest({ 
    firstName, 
    lastName, 
    email, 
    password, 
    address, 
    phoneNumber 
  });
};

/**
 * Envía los datos de un nuevo usuario para registrarlo en el sistema.
 * @param userData - Un objeto con toda la información del nuevo usuario.
 * @returns Una promesa que se resuelve con la respuesta del registro.
 */
export const registerRequest = async (
  userData: RegisterRequest
): Promise<RegisterResponse> => {
  const { data } = await authApi.post<RegisterResponse>('/api/users/register', userData);
  return data;
};

// Limpiamos las exportaciones confusas del final
export default {
  loginRequest,
  loginUser,
  registerRequest,
  registerUser,
};