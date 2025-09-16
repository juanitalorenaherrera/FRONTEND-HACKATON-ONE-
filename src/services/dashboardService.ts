// /src/services/dashboardService.ts

import type { MainDashboardData } from '../types/dashboard';
import { api } from './api'; // ¡Ahora importamos nuestra instancia centralizada!

/**
 * Obtiene todos los datos necesarios para renderizar el dashboard principal del usuario
 * en una sola llamada, tal como lo expone el backend.
 * @returns Una promesa que se resuelve con el objeto completo de datos del dashboard.
 */
export const getDashboardData = async (): Promise<MainDashboardData> => {
  // Se llama al único y correcto endpoint del backend para el dashboard.
    const { data } = await api.get<MainDashboardData>('/api/dashboard');
    return data;
};