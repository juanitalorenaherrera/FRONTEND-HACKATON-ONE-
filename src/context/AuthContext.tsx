import { createContext, useContext } from 'react';

import type { User } from '../types/user';

// Define la "forma" de los datos y funciones que nuestro contexto proveerá.
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

// Crea el contexto con un valor inicial indefinido.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crea el hook personalizado para consumir el contexto de forma segura.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}