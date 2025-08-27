import { createContext } from "react";
import type { User } from "../types/user";

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Exportamos solo el contexto, que es un objeto de lógica, no un componente.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);