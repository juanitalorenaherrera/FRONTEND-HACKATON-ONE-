// src/services/petService.ts

import type {
    CreatePetRequest,
    Pet,
    PetStats,
    PetSummary,
    UpdatePetRequest
} from '../types/pets';

import authApi from './auth';

const API_URL = '/api/pets';

// --- QUERIES (Obtención de datos) ---

/**
 * Obtiene todas las mascotas del usuario autenticado.
 */
export const getAllPets = async (): Promise<Pet[]> => {
  const { data } = await authApi.get<Pet[]>(API_URL);
  return data;
};

/**
 * Obtiene un resumen de todas las mascotas del usuario.
 */
export const getPetsSummary = async (): Promise<PetSummary[]> => {
  const { data } = await authApi.get<PetSummary[]>(`${API_URL}/summary`);
  return data;
};

/**
 * Obtiene una mascota específica por su ID.
 */
export const getPetById = async (petId: number): Promise<Pet> => {
  const { data } = await authApi.get<Pet>(`${API_URL}/${petId}`);
  return data;
};

/**
 * Obtiene mascotas de una cuenta específica (ej. para admins).
 */
export const getPetsByAccountId = async (accountId: number): Promise<Pet[]> => {
  const { data } = await authApi.get<Pet[]>(`${API_URL}/account/${accountId}`);
  return data;
};

/**
 * Obtiene estadísticas de mascotas.
 */
export const getPetStats = async (): Promise<PetStats> => {
  const { data } = await authApi.get<PetStats>(`${API_URL}/stats`);
  return data;
};

// --- MUTATIONS (Creación, Actualización, Eliminación) ---

/**
 * Crea una nueva mascota.
 */
export const createPet = async (petData: CreatePetRequest): Promise<Pet> => {
  const { data } = await authApi.post<Pet>(API_URL, petData);
  return data;
};

/**
 * Función de compatibilidad para código existente con parámetros individuales
 * @deprecated Usa createPet con un objeto petData en su lugar
 */
export const createPetLegacy = async (
  accountId: number,
  name: string,
  species?: string,
  breed?: string,
  age?: number,
  weight?: number,
  color?: string,
  medications?: string,
  allergies?: string,
  specialNotes?: string
): Promise<Pet> => {
  return createPet({
    accountId,
    name,
    species,
    breed,
    age,
    weight,
    color,
    medications,
    allergies,
    specialNotes
  });
};

/**
 * Actualiza una mascota existente.
 */
export const updatePet = async (petId: number, petData: UpdatePetRequest): Promise<Pet> => {
  const { data } = await authApi.put<Pet>(`${API_URL}/${petId}`, petData);
  return data;
};

/**
 * Elimina una mascota por su ID.
 */
export const deletePet = async (petId: number): Promise<void> => {
  await authApi.delete(`${API_URL}/${petId}`);
};

/**
 * Cambia el estado activo/inactivo de una mascota.
 */
export const togglePetActive = async (petId: number): Promise<Pet> => {
  const { data } = await authApi.patch<Pet>(`${API_URL}/${petId}/toggle-active`);
  return data;
};

export default {
  getAllPets,
  getPetsSummary,
  getPetById,
  getPetsByAccountId,
  getPetStats,
  createPet,
  createPetLegacy,
  updatePet,
  deletePet,
  togglePetActive,
};