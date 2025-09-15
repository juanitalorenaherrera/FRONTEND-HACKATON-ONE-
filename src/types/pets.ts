// src/types/pets.ts

// =======================================================
// DTOs - Data Transfer Objects (Alineados con la API)
// =======================================================

// --- REQUEST DTOs (Datos que el Frontend ENVÍA al Backend) ---

/**
 * DTO para crear una nueva mascota.
 */
export interface CreatePetRequest {
  accountId: number;
  name: string;
  species?: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: string;
  color?: string;
  physicalDescription?: string;
  medications?: string;
  allergies?: string;
  specialNotes?: string;
}

/**
 * DTO para actualizar una mascota existente.
 * Es similar a la creación, pero no se puede cambiar la cuenta a la que pertenece.
 */
export interface UpdatePetRequest {
  name: string;
  species?: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: string;
  color?: string;
  physicalDescription?: string;
  medications?: string;
  allergies?: string;
  specialNotes?: string;
}

/**
 * Tipos para formularios (compatibilidad con react-hook-form)
 */
export type CreatePetFormData = CreatePetRequest;
export type UpdatePetFormData = UpdatePetRequest;

// --- RESPONSE DTOs (Datos que el Backend DEVUELVE al Frontend) ---

/**
 * DTO para los detalles completos de una mascota.
 */
export interface Pet {
  id: number;
  accountId: number;
  accountName: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight?: number;
  gender?: string;
  color?: string;
  physicalDescription?: string;
  medications?: string;
  allergies?: string;
  specialNotes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Alias para compatibilidad con código existente
 * @deprecated Usa Pet en su lugar
 */
export type PetResponse = Pet;

/**
 * DTO para un resumen de mascota (usado en listas).
 */
export interface PetSummary {
  id: number;
  accountId: number;
  accountName: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  active: boolean;
  createdAt: string;
}

/**
 * DTO para la respuesta del endpoint de estadísticas de mascotas.
 */
export interface PetStats {
  totalPets: number;
  activePets: number;
  inactivePets: number;
  petsBySpecies: Record<string, number>;
  petsByGender: Record<string, number>;
  petsByAgeRange: Record<string, number>;
  accountsWithPets: number;
  averagePetsPerAccount: number;
  petsRegisteredLast30Days: number;
  petsRegisteredLast7Days: number;
}

// =======================================================
// Tipos para Store/Context
// =======================================================

/**
 * Estado de la aplicación para mascotas
 */
export interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  stats: PetStats | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Tipos para modales y UI (compatibilidad con código original)
 */
export enum Type {
  ADD = 'ADD',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
}

/**
 * Alias para compatibilidad
 */
export const PetModalType = Type;

export interface PetModalState {
  isOpen: boolean;
  type: Type | null;
  pet: Pet | null;
}