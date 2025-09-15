// src/types/dashboard.ts (VERSIÓN ALINEADA CON EL BACKEND)

/**
 * Representa una única métrica del dashboard, con su valor
 * y el cambio porcentual respecto al periodo anterior.
 */
export interface StatItem {
  value: number;
  change: number; // Ej: 0.15 para +15%, -0.5 para -50%
}

/**
 * DTO para la respuesta del endpoint de estadísticas del dashboard.
 * Corresponde a la estructura de DashboardStatsDTO.java del backend.
 * Corresponde a: GET /api/dashboard/stats
 */
export interface DashboardStats {
  activePets: StatItem;
  scheduledAppointments: StatItem;
  vaccinesUpToDate: StatItem;
  pendingReminders: StatItem;
}