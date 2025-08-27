// src/services/authService.ts

import axios from "axios";
import type { User } from "../types/user"; // 1. Importar el tipo 'User' centralizado

const API_URL = "http://localhost:8080/auth";

// 2. La interfaz local 'UserAuthResponse' se elimina por completo.

/**
 * Inicia sesión de un usuario.
 */
export const login = async (
  email: string, 
  password: string
): Promise<User> => { // 3. Usar el tipo 'User' en las funciones
  const response = await axios.post<User>(`${API_URL}/login`, { email, password });
  return response.data;
};

/**
 * Registra un nuevo usuario.
 */
export const register = async (
  name: string, 
  email: string, 
  password: string, 
  role: 'owner' | 'sitter'
): Promise<User> => { // 3. Usar el tipo 'User' en las funciones
  const response = await axios.post<User>(`${API_URL}/register`, { name, email, password, role });
  return response.data;
};