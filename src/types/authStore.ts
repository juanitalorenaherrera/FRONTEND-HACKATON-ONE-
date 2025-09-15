// El Enum de Role está perfecto, no necesita cambios.
export enum Role {
  CLIENT = 'CLIENT',
  SITTER = 'SITTER',
  ADMIN = 'ADMIN',
}

// La interfaz del perfil de usuario, sin datos derivados.
export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  // 'initials' ha sido eliminado.
}

// Define la forma del estado en el store.
export interface AuthState {
  token: string | null;
  profile: Profile | null;
  isAuthenticated: boolean; // Nombre mejorado
}

// Define las acciones que se pueden realizar sobre el store.
export interface AuthActions {
  // Acción atómica para manejar el inicio de sesión.
  login: (data: { token: string; profile: Profile }) => void;
  // La acción de logout no recibe argumentos y resetea el estado.
  logout: () => void;
}