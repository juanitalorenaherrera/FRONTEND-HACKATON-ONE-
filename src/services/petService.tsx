// services/petService.ts

import type { CreatePetRequest, Pet, PetStats } from '../features/pets/types';

import axios from 'axios';

const API_URL = 'http://localhost:8088/api/pets';

// ====================================================================
// LÓGICA DE AUTENTICACIÓN CORREGIDA
// ====================================================================

/**
 * Obtiene el token de autenticación real desde el localStorage.
 */
const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

/**
 * Crea los encabezados de autorización para las peticiones de Axios.
 * Solo añade el encabezado si el token existe.
 */
const getAuthHeaders = () => {
    const token = getAuthToken();
    if (token) {
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    }
    return {}; // Devuelve un objeto vacío si no hay token
};

// ====================================================================

// El mapeador se mantiene igual
const mapPetResponseToPet = (data: any): Pet => ({
    id: data.id,
    accountId: data.accountId,
    accountName: data.accountName,
    name: data.name,
    species: data.species,
    breed: data.breed,
    age: data.age,
    weight: data.weight,
    gender: data.gender,
    color: data.color,
    physicalDescription: data.physicalDescription,
    medications: data.medications,
    allergies: data.allergies,
    specialNotes: data.specialNotes,
    active: data.active,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
});

// El objeto de servicio ahora usará los encabezados correctos
export const petService = {
    async getAllByAccountId(accountId: number): Promise<Pet[]> {
        const url = `${API_URL}/account/${accountId}`;
        const headers = getAuthHeaders();

        // --- CONSOLE.LOG AQUÍ ---
        console.log('Enviando petición GET a:', url);
        console.log('Con las cabeceras:', headers);
        // ------------------------

        try {
            const { data } = await axios.get<any[]>(url, headers);
            return data.map(mapPetResponseToPet);
        } catch (error) {
            console.error('Error en la petición:', error.response?.data || error.message);
            throw error;
        }
    },

    async getById(petId: number): Promise<Pet> {
        const { data } = await axios.get<any>(`${API_URL}/${petId}`, getAuthHeaders());
        return mapPetResponseToPet(data);
    },

    /**
     * MODIFICADO: `create` ahora asocia la mascota a la cuenta correcta.
     */
    async create(petData: CreatePetRequest): Promise<Pet> {
        const { data } = await axios.post<any>(API_URL, petData, getAuthHeaders());
        return mapPetResponseToPet(data);
    },

    async update(petId: number, petData: Partial<CreatePetRequest>): Promise<Pet> {
        const { data } = await axios.put<any>(`${API_URL}/${petId}`, petData, getAuthHeaders());
        return mapPetResponseToPet(data);
    },

    async delete(petId: number): Promise<void> {
        await axios.delete(`${API_URL}/${petId}`, getAuthHeaders());
    },

};