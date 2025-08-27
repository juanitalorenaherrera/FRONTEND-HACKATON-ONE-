import axios from "axios";

const API_URL = "http://localhost:8080/pets";

// 1. Definir la interfaz para un objeto 'Pet'
export interface Pet {
  id: string | number;
  name: string;
  type: string; // E.g., 'Perro', 'Gato'
  ownerId: string | number;
}

// 2. Definir un tipo para los datos necesarios al crear una mascota
export type PetData = Omit<Pet, 'id' | 'ownerId'>;

/**
 * Agrega una nueva mascota para el usuario autenticado.
 * @param token - El token de autenticación del usuario.
 * @param petData - Los datos de la mascota a crear.
 * @returns La mascota recién creada.
 */
export const addPet = async (
  token: string, 
  petData: PetData
): Promise<Pet> => {
  const response = await axios.post<Pet>(API_URL, petData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Obtiene todas las mascotas del usuario autenticado.
 * @param token - El token de autenticación del usuario.
 * @returns Un array con las mascotas del usuario.
 */
export const getPets = async (token: string): Promise<Pet[]> => {
  const response = await axios.get<Pet[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Obtiene una mascota específica por su ID.
 * @param token - El token de autenticación del usuario.
 * @param petId - El ID de la mascota a obtener.
 * @returns El objeto de la mascota.
 */
export const getPetById = async (
  token: string, 
  petId: string | number
): Promise<Pet> => {
  const response = await axios.get<Pet>(`${API_URL}/${petId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};