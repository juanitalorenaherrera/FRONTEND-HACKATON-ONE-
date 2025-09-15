// src/types/user.ts

/**
 * DTO para un resumen de un usuario.
 * Utilizado en listas donde no se necesita toda la información del perfil.
 */
export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string; // Opcional, dependiendo de la API
  address?: string; // Opcional
}