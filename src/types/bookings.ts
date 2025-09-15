// src/types/booking.ts (VERSIÓN FINAL)

// =======================================================
// DTOs - Data Transfer Objects (Alineados con la API)
// =======================================================

/**
 * Representa los posibles estados de una reserva.
 */
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// --- REQUEST DTOs (Datos que el Frontend ENVÍA al Backend) ---

/**
 * DTO para crear una nueva reserva.
 */
export interface CreateBookingRequest {
  petId: number;
  sitterId: number;
  serviceOfferingId: number;
  startTime: string; // ISO string
  notes?: string;
}

/**
 * DTO para actualizar los detalles de una reserva.
 */
export interface UpdateBookingRequest {
  startTime?: string;
  notes?: string;
}

/**
 * DTO para actualizar solo el estado de una reserva.
 */
export interface UpdateBookingStatusRequest {
  newStatus: BookingStatus;
  reason?: string;
}

/**
 * DTO para los parámetros de búsqueda de reservas.
 */
export interface GetBookingsRequest {
  userId: number;
  role: string; // O tu enum Role
  status?: BookingStatus;
  page?: number;
  size?: number;
}

// --- RESPONSE DTOs (Datos que el Backend DEVUELVE al Frontend) ---

/**
 * DTO para un resumen de reserva (usado en listas).
 */
export interface BookingSummary {
  id: number;
  petName: string;
  sitterName: string;
  startTime: string;
  status: BookingStatus;
  totalPrice: number;
}

/**
 * DTO para los detalles completos de una reserva.
 */
export interface BookingDetail {
  id: number;
  petId: number;
  petName: string;
  sitterId: number;
  sitterName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
}

// =======================================================
// Tipos Genéricos (Pueden moverse a un archivo global)
// =======================================================

/**
 * DTO genérico para respuestas paginadas de la API.
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // Número de la página actual
  size: number;
}