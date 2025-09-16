// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  PET_OWNER = 'PET_OWNER',
  SITTER = 'SITTER',
  ADMIN = 'ADMIN'
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Account {
  id: string;
  userId: string;
  preferredLanguage: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

export interface UpdateAccountDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferredLanguage?: string;
  timezone?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
}

// El enum 'Role' nos ayuda a evitar errores de tipeo y a que el código sea más legible.
// Asegúrate de que los valores coincidan exactamente con los del backend.
export enum Role {
  CLIENT = 'CLIENT',
  SITTER = 'SITTER',
  ADMIN = 'ADMIN',
}

// Este es el DTO del perfil de usuario que recibimos en el login y en el dashboard.
export interface UserProfileDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  profileImageUrl?: string | null; // La hacemos opcional por si un usuario no tiene imagen.
}