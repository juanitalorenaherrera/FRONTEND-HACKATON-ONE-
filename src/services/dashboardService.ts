// src/services/dashboardService.ts
import type { DashboardData, Pet } from '../types/dashboardData';
import type { DashboardStatsData } from '../types/DashboardStatsData';
import type { PetSummaryResponse } from '../types/pets';
import axios from '../services/auth';

const API_URL = '/api/dashboard';

/**
 * Obtiene las estadísticas del dashboard
 * @returns Promise<DashboardStatsData>
 */
export const getDashboardStats = async (): Promise<DashboardStatsData> => {
    try {
        const response = await axios.get(`${API_URL}/stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw new Error('No se pudieron cargar las estadísticas del dashboard');
    }
};

/**
 * Obtiene todos los datos del dashboard principal
 * @returns Promise<DashboardData>
 */
export const getDashboardData = async (): Promise<DashboardData> => {
    try {
        // Llamar a múltiples endpoints en paralelo
        const [dashboardResponse, userPets] = await Promise.all([
            axios.get(`${API_URL}/main`),
            getUserPetsForDashboard()
        ]);

        const dashboardData = dashboardResponse.data;
        
        return {
            ...dashboardData,
            userPets: userPets
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw new Error('No se pudieron cargar los datos del dashboard');
    }
};

/**
 * Obtiene la próxima cita del usuario
 * @returns Promise<Appointment | null>
 */
export const getNextAppointment = async () => {
    try {
        const response = await axios.get(`${API_URL}/next-appointment`);
        return response.data;
    } catch (error) {
        console.error('Error fetching next appointment:', error);
        throw new Error('No se pudo cargar la próxima cita');
    }
};

/**
 * Obtiene las mascotas del usuario para el dashboard
 */
export const getUserPetsForDashboard = async (): Promise<Pet[]> => {
    try {
        // Usar el servicio de mascotas para obtener datos reales
        const pets = await getPetsSummary();
        
        // Convertir PetSummaryResponse a la interfaz Pet del dashboard
        return pets
            .filter(pet => pet.active) // Solo mascotas activas
            .map(pet => ({
                id: pet.id,
                accountId: pet.accountId,
                accountName: pet.accountName,
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                age: pet.age,
                createdAt: pet.createdAt,
                active: pet.active
            }));
    } catch (error) {
        console.error('Error fetching user pets for dashboard:', error);
        throw new Error('No se pudieron cargar las mascotas del usuario');
    }
};

/**
 * Obtiene los cuidadores recientes
 * @returns Promise<Sitter[]>
 */
export const getRecentSitters = async () => {
    try {
        const response = await axios.get(`${API_URL}/recent-sitters`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent sitters:', error);
        throw new Error('No se pudieron cargar los cuidadores recientes');
    }
};

/**
 * Obtiene el resumen de mascotas del usuario
 * @returns Promise<PetSummaryResponse[]>
 */
async function getPetsSummary(): Promise<PetSummaryResponse[]> {
    try {
        const response = await axios.get('/api/pets/summary');
        return response.data;
    } catch (error) {
        console.error('Error fetching pets summary:', error);
        throw new Error('No se pudo cargar el resumen de mascotas');
    }
}

