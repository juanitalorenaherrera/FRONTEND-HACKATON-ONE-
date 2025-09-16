// src/types/auth.ts (NUEVO ARCHIVO o agrégalo a uno existente)

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  imageUrl?: string;
}

export enum Role {
  USER = 'USER',
  SITTER = 'SITTER',
  ADMIN = 'ADMIN',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  // Define los campos según tu formulario de registro
  [key: string]: any;
}

export interface AuthResponse {
  token: string;
  user: User;
}