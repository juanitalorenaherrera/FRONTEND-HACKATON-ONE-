// src/services/dashboardService.ts
import type { DashboardData, Pet } from '../types/dashboardData';
import type { DashboardStatsData } from '../types/DashboardStatsData';
import type { PetSummaryResponse } from '../types/pets';
import axios from '../services/auth';
import { getMockDashboardData } from './mockDashboardService';

const API_URL = '/api/dashboard';

/**
 * Obtiene las estadísticas del dashboard
 * @returns Promise<DashboardStatsData>
 */
export const getDashboardStats = async (): Promise<DashboardStatsData> => {
    try {
        const response = await axios.get<DashboardStatsData>(`${API_URL}/stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw new Error('No se pudieron cargar las estadísticas del dashboard');
    }
};

/**
 * Obtiene todos los datos del dashboard principal optimizado
 * @returns Promise<DashboardData>
 */
export const getDashboardData = async (): Promise<DashboardData> => {
    try {
        console.log('🔄 Iniciando carga de datos del dashboard...');
        console.log('📡 API URL:', import.meta.env.VITE_API_URL);
        
        const [statsResponse, mainResponse, petsResponse, sittersResponse] = await Promise.all([
            axios.get<DashboardStatsData>(`${API_URL}/stats`),
            axios.get(`${API_URL}/main`),
            axios.get<PetSummaryResponse[]>('/api/pets/summary'),
            axios.get(`${API_URL}/sitter-profiles`)
        ]);

        const userPets = petsResponse.data
            .filter((pet: PetSummaryResponse) => pet.active)
            .map((pet: PetSummaryResponse) => ({
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
        
        console.log('✅ Datos del dashboard cargados correctamente');
        return {
            ...mainResponse.data,
            stats: statsResponse.data,
            userPets,
            recentSitters: sittersResponse.data,
            nextAppointment: null
        };
    } catch (error: unknown) {
        const axiosError = error as { message?: string; response?: { status?: number; statusText?: string }; config?: { url?: string; baseURL?: string }; code?: string };
        
        console.error('❌ Error detallado:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            url: axiosError.config?.url,
            baseURL: axiosError.config?.baseURL
        });
        
        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK' || axiosError.response?.status === 500) {
            console.warn('⚠️ Backend no disponible o con errores, usando datos mock...');
            return await getMockDashboardData();
        }
        
        throw new Error(`No se pudieron cargar los datos del dashboard: ${axiosError.message || 'Error desconocido'}`);
    }
};

// Funciones individuales mantenidas para compatibilidad pero optimizadas
export const getNextAppointment = async () => {
    const { nextAppointment } = await getDashboardData();
    return nextAppointment;
};

export const getUserPetsForDashboard = async (): Promise<Pet[]> => {
    const { userPets } = await getDashboardData();
    return userPets;
};

export const getRecentSitters = async () => {
    const { recentSitters } = await getDashboardData();
    return recentSitters;
};

export const getPetsSummary = async (): Promise<PetSummaryResponse[]> => {
    try {
        const response = await axios.get<PetSummaryResponse[]>('/api/pets/summary');
        return response.data;
    } catch (error) {
        console.error('Error fetching pets summary:', error);
        throw new Error('No se pudo cargar el resumen de mascotas');
    }
};

