// src/services/dashboardService.ts (VERSIÓN CORREGIDA Y FINAL)

import type { DashboardStats, MainDashboardData } from '../types/dashboard';

import type { PetSummary } from '../types/pets';
import type { SitterProfileSummary } from '../types/sitter';
import authApi from './auth';

const API_URL = '/api/dashboard';

/**
 * Obtiene las estadísticas principales del dashboard.
 */
// 2. CORRECCIÓN: Usamos el nombre de tipo refactorizado 'DashboardStats'.
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await authApi.get<DashboardStats>(`${API_URL}/stats`);
  return data;
};

/**
 * Obtiene los datos principales del dashboard (próxima cita, cuidadores recientes).
 */
// 3. CORRECCIÓN: Reemplazamos 'any' con nuestro DTO 'MainDashboardData'.
export const getMainDashboardData = async (): Promise<MainDashboardData> => { 
  const { data } = await authApi.get<MainDashboardData>(`${API_URL}/main`);
  return data;
};

/**
 * Obtiene un resumen de los perfiles de cuidadores recientes.
 */
export const getRecentSitters = async (): Promise<SitterProfileSummary[]> => {
  const { data } = await authApi.get<SitterProfileSummary[]>(`${API_URL}/sitter-profiles`);
  return data;
};

/**
 * Obtiene un resumen de las mascotas del usuario.
 * NOTA: Como dice el comentario, esta función pertenece a `petService.ts`.
 * Deberías eliminarla de este archivo y, cuando la necesites en el `dashboardLoader`,
 * importarla desde `petService` para no duplicar código.
 */
export const getPetsSummary = async (): Promise<PetSummary[]> => {
  const { data } = await authApi.get<PetSummary[]>('/api/pets/summary');
  return data;
};