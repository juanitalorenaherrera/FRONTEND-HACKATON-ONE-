// src/types/dashboard.ts (VERSIÓN CORREGIDA)

// =======================================================
// 1. AÑADIMOS LAS IMPORTACIONES
// Le decimos a este archivo dónde encontrar los tipos que queremos reutilizar.
// =======================================================

import type { BookingSummary } from './bookings';
import type { SitterProfileSummary } from './sitter';

// =======================================================
// DTOs - Data Transfer Objects (Alineados con la API del Dashboard)
// =======================================================

/**
 * DTO para la respuesta del endpoint de estadísticas del dashboard.
 */
export interface DashboardStats {
  activePets: number;
  activePetsChange: string;
  scheduledAppointments: number;
  scheduledAppointmentsChange: string;
  vaccinesUpToDate: string;
  vaccinesChange: string;
  pendingReminders: number;
  pendingRemindersChange: string;
}

/**
 * DTO para la respuesta del endpoint de datos principales del dashboard.
 */
// 2. AHORA ESTO FUNCIONA
// TypeScript ya sabe qué son 'BookingSummary' y 'SitterProfileSummary'
// porque los hemos importado.
export interface MainDashboardData {
  nextAppointment: BookingSummary | null;
  recentSitters: SitterProfileSummary[];
}