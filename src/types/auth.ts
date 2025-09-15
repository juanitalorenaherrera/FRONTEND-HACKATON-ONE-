// src/types/auth.ts

// =======================================================
// DTOs - Data Transfer Objects (Alineados con la API)
// =======================================================

/**
 * Define los roles de usuario en toda la aplicación.
 */
export enum Role {
  CLIENT = 'CLIENT',
  SITTER = 'SITTER',
  ADMIN = 'ADMIN',
}

/**
 * Representa el perfil de un usuario. Es la IDENTIDAD del usuario.
 */
export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  accountId: number;
}

/**
 * DTO para la petición de login.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Tipo para los datos del formulario de login (compatible con react-hook-form)
 */
export type LoginFormData = LoginRequest;

/**
 * Tipo para los datos del formulario de registro (compatible con react-hook-form)
 */
export type RegisterFormData = RegisterRequest;

/**
 * DTO para la respuesta de login/registro.
 */
export interface LoginResponse {
  token: string;
  userProfile: Profile;
}

/**
 * DTO para la petición de registro.
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  phoneNumber?: string;
}

/**
 * DTO para la respuesta de registro.
 */
export type RegisterResponse = LoginResponse;

// =======================================================
// Tipos para el Store de Zustand (authStore.ts)
// =======================================================

/**
 * Define la forma del estado en el store de autenticación.
 */
export interface AuthState {
  token: string | null;
  profile: Profile | null;
  isAuthenticated: boolean;
}

/**
 * Define las acciones que se pueden realizar sobre el store.
 */
export interface AuthActions {
  login: (data: { token: string; profile: Profile }) => void;
  setToken: (token: string) => void;  // Para compatibilidad
  setProfile: (profile: Profile) => void;  // Para compatibilidad
  logout: () => void;
}