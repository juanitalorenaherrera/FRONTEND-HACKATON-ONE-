// src/types/sitter.ts

// =======================================================
// DTOs - Data Transfer Objects (Alineados con la API)
// =======================================================

// --- REQUEST DTOs (Datos que el Frontend ENVÍA al Backend) ---

/**
 * DTO para registrar un nuevo usuario con el rol de cuidador.
 */
export interface SitterRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  phoneNumber?: string;
}

/**
 * DTO para crear o actualizar el perfil de un cuidador.
 */
export interface CreateSitterProfileRequest {
  bio?: string;
  hourlyRate: number;
  servicingRadius?: number;
  profileImageUrl?: string;
  availableForBookings?: boolean;
}

/**
 * DTO para los parámetros de búsqueda de cuidadores en la API.
 */
export interface SearchSittersParams {
    location?: string;
    maxDistance?: number;
    minRating?: number;
    maxHourlyRate?: number;
    availableOnly?: boolean;
    page?: number;
    size?: number;
}


// --- RESPONSE DTOs (Datos que el Backend DEVUELVE al Frontend) ---

/**
 * DTO para los detalles completos del perfil de un cuidador.
 */
export interface SitterProfile {
  id: number;
  userId: number;
  bio?: string;
  hourlyRate?: number;
  servicingRadius?: number;
  profileImageUrl?: string;
  verified: boolean;
  availableForBookings: boolean;
}

/**
 * DTO para un resumen del perfil de un cuidador (usado en listas y tarjetas).
 */
export interface SitterProfileSummary {
  id: number;
  sitterName: string;
  profileImageUrl?: string;
  hourlyRate?: number;
  averageRating?: number;
  isVerified: boolean;
  location?: string;
}

/**
 * DTO para la respuesta de autenticación (importado o definido en auth.ts).
 * Lo mantengo aquí como referencia de lo que se eliminó.
 */
// export interface AuthResponse { ... }

// =======================================================
// La interfaz `ExtendedSitter` se mueve a la feature:
// `src/features/sitters/types/index.ts`
// =======================================================