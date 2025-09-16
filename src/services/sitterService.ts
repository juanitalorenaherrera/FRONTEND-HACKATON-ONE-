// src/services/sitterService.ts (VERSIÓN FINAL CON TIPOS CORREGIDOS)

// 1. CORRECCIÓN: Importamos los nombres de tipo refactorizados desde sus ubicaciones correctas.

import { ApiResponse, PaginatedResponse } from '../types/api.types';
import type { CreateServiceRequest, Service } from '../types/service'; // Usamos los nuevos tipos de Service
import type {
    CreateSitterProfileRequest,
    SearchSittersParams,
    SitterProfile,
    SitterProfileSummary,
    SitterRegisterRequest
} from '../types/sitter';
import { Sitter, SitterFilters } from '../types/common.types';

import type { LoginResponse } from '../types/auth';
import type { UserSummary } from '../types/user';
import { apiClient } from './api';
import authApi from './auth';

// Reutilizamos la respuesta de login
         // Usamos el nuevo tipo UserSummary






export class SitterService {
  // GET /sitters - Lista de cuidadores disponibles
  async getAll(filters?: SitterFilters): Promise<Sitter[]> {
    const response = await apiClient.get<ApiResponse<Sitter[]>>('/sitters', {
      params: filters
    });
    return response.data.data;
  }

  // GET /sitters/search - Búsqueda avanzada con paginación
  async search(filters: SitterFilters, page = 1, pageSize = 10): Promise<PaginatedResponse<Sitter>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Sitter>>>('/sitters/search', {
      params: {
        ...filters,
        page,
        pageSize
      }
    });
    return response.data.data;
  }

  // GET /sitters/{id} - Perfil detallado de cuidador
  async getById(id: string): Promise<Sitter> {
    const response = await apiClient.get<ApiResponse<Sitter>>(`/sitters/${id}`);
    return response.data.data;
  }

  // GET /sitters/{id}/reviews - Reseñas del cuidador
  async getReviews(id: string): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/sitters/${id}/reviews`);
    return response.data.data;
  }

  // GET /sitters/{id}/availability - Disponibilidad del cuidador
  async getAvailability(id: string, startDate: string, endDate: string): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/sitters/${id}/availability`, {
      params: { startDate, endDate }
    });
    return response.data.data;
  }

  // POST /sitters/{id}/contact - Contactar al cuidador
  async contactSitter(id: string, message: string): Promise<void> {
    await apiClient.post(`/sitters/${id}/contact`, { message });
  }

  // GET /sitters/nearby - Cuidadores cercanos
  async getNearby(latitude: number, longitude: number, radius = 10): Promise<Sitter[]> {
    const response = await apiClient.get<ApiResponse<Sitter[]>>('/sitters/nearby', {
      params: { latitude, longitude, radius }
    });
    return response.data.data;
  }

  // POST /sitters/{id}/favorite - Agregar a favoritos
  async addToFavorites(id: string): Promise<void> {
    await apiClient.post(`/sitters/${id}/favorite`);
  }

  // DELETE /sitters/{id}/favorite - Remover de favoritos
  async removeFromFavorites(id: string): Promise<void> {
    await apiClient.delete(`/sitters/${id}/favorite`);
  }

  // GET /sitters/favorites - Lista de cuidadores favoritos
  async getFavorites(): Promise<Sitter[]> {
    const response = await apiClient.get<ApiResponse<Sitter[]>>('/sitters/favorites');
    return response.data.data;
  }
}

export const sitterService = new SitterService();
const PROFILES_API_URL = '/api/sitter-profiles';
const USERS_API_URL = '/api/users';
const SERVICES_API_URL = '/api/services';

// ========== SERVICIOS DE PERFILES DE CUIDADOR ==========

// 2. CORRECCIÓN: Usamos 'SitterProfile' en lugar de 'SitterProfileDTO'.
export const createSitterProfile = async (profileData: CreateSitterProfileRequest): Promise<SitterProfile> => {
  const { data } = await authApi.post<SitterProfile>(PROFILES_API_URL, profileData);
  return data;
};

export const getSitterProfile = async (userId: number): Promise<SitterProfile> => {
  const { data } = await authApi.get<SitterProfile>(`${PROFILES_API_URL}/${userId}`);
  return data;
};

export const getAllSitterProfiles = async (): Promise<SitterProfile[]> => {
  const { data } = await authApi.get<SitterProfile[]>(PROFILES_API_URL);
  return data;
};

export const updateSitterProfile = async (userId: number, profileData: CreateSitterProfileRequest): Promise<SitterProfile> => {
  const { data } = await authApi.put<SitterProfile>(`${PROFILES_API_URL}/${userId}`, profileData);
  return data;
};

export const deleteSitterProfile = async (userId: number): Promise<void> => {
  await authApi.delete(`${PROFILES_API_URL}/${userId}`);
};

export const searchSitters = async (params: SearchSittersParams): Promise<SitterProfileSummary[]> => {
    const { data } = await authApi.get<SitterProfileSummary[]>(`${PROFILES_API_URL}/search`, { params });
    return data;
};

// ========== SERVICIOS DE USUARIOS (ROL CUIDADOR) ==========

// 3. CORRECCIÓN: Usamos 'LoginResponse' de auth.ts en lugar de 'AuthResponse'.
export const registerSitter = async (sitterData: SitterRegisterRequest): Promise<LoginResponse> => {
  const { data } = await authApi.post<LoginResponse>(`${USERS_API_URL}/register-sitter`, sitterData);
  return data;
};

export const getAllSittersAsUsers = async (): Promise<UserSummary[]> => {
    const { data } = await authApi.get<UserSummary[]>(`${USERS_API_URL}/role/SITTER`);
    return data;
};

// ========== SERVICIOS OFRECIDOS POR CUIDADORES ==========

export const getSitterServices = async (sitterId: number): Promise<Service[]> => {
  const { data } = await authApi.get<Service[]>(`${SERVICES_API_URL}/all/${sitterId}`);
  return data;
};

export const addSitterService = async (sitterId: number, serviceData: CreateServiceRequest): Promise<Service> => {
  const { data } = await authApi.post<Service>(`${SERVICES_API_URL}/create/${sitterId}`, serviceData);
  return data;
};

export const getActiveSitters = async (): Promise<SitterProfileSummary[]> => {
  // Opción 1: Si tienes un endpoint específico para activos
  try {
    const { data } = await authApi.get<SitterProfileSummary[]>(`${PROFILES_API_URL}/active`);
    return data;
  } catch (error) {
    // Fallback: obtener todos y filtrar activos
    const allSitters = await getAllSitterProfiles();
    return allSitters.filter(sitter => sitter.available) as SitterProfileSummary[];
  }
};

export const getSitterStats = async (): Promise<{
  totalSitters: number;
  activeSitters: number;
  averageRating: number;
  totalServices: number;
}> => {
  try {
    // Opción 1: Si tienes endpoint de stats
    const { data } = await authApi.get(`${PROFILES_API_URL}/stats`);
    return data;
  } catch (error) {
    // Opción 2: Calcular stats basado en datos existentes
    const sitters = await getAllSitterProfiles();
    
    return {
      totalSitters: sitters.length,
      activeSitters: sitters.filter(s => s.available).length,
      averageRating: sitters.reduce((acc, s) => acc + (s.averageRating || 0), 0) / sitters.length || 0,
      totalServices: sitters.reduce((acc, s) => acc + (s.serviceCount || 0), 0)
    };
  }
};
