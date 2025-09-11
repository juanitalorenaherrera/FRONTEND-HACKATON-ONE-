// services/bookingService.ts

import type {
  BookingDetail,
  BookingStatus,
  BookingSummary,
  CreateBookingRequest,
  PageResponse,
  UpdateBookingRequest,
} from '../features/booking/types';

import axios from 'axios';

const API_URL = 'http://localhost:8088/api/bookings';

// Helper para obtener el token y los headers.
// Es crucial que esta lógica esté centralizada.
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    // En una app real, esto podría redirigir al login o invalidar una sesión.
    throw new Error('Authentication token not found.');
  }
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

/**
 * Crea una nueva reserva.
 * Corresponde a: POST /api/bookings
 */
export async function createBooking(request: CreateBookingRequest): Promise<BookingDetail> {
  const { data } = await axios.post<BookingDetail>(API_URL, request, getAuthHeaders());
  return data;
}

/**
 * Obtiene las reservas de un usuario específico con paginación y filtros.
 * Corresponde a: GET /api/bookings/user/{userId}
 */
export async function getBookingsByUser(
  userId: number,
  role: 'CLIENT' | 'SITTER',
  filters: { status?: string; page?: number; size?: number }
): Promise<PageResponse<BookingSummary>> {
  const { data } = await axios.get<PageResponse<BookingSummary>>(`${API_URL}/user/${userId}`, {
    ...getAuthHeaders(),
    params: {
      role,
      status: filters.status,
      page: filters.page,
      size: filters.size,
    },
  });
  return data;
}

/**
 * Obtiene los detalles completos de una reserva por su ID.
 * Corresponde a: GET /api/bookings/{id}
 */
export async function getBookingById(bookingId: number): Promise<BookingDetail> {
  const { data } = await axios.get<BookingDetail>(`${API_URL}/${bookingId}`, getAuthHeaders());
  return data;
}

/**
 * Actualiza una reserva existente.
 * Corresponde a: PUT /api/bookings/{id}
 */
export async function updateBooking(bookingId: number, request: UpdateBookingRequest): Promise<BookingDetail> {
  const { data } = await axios.put<BookingDetail>(`${API_URL}/${bookingId}`, request, getAuthHeaders());
  return data;
}

/**
 * Cambia el estado de una reserva.
 * Corresponde a: PATCH /api/bookings/{id}/status
 */
export async function updateBookingStatus(
  bookingId: number,
  newStatus: BookingStatus,
  reason?: string
): Promise<BookingDetail> {
  const { data } = await axios.patch<BookingDetail>(
    `${API_URL}/${bookingId}/status`,
    null, // El body es null para PATCH en este caso
    {
      ...getAuthHeaders(),
      params: { newStatus, reason },
    }
  );
  return data;
}

/**
 * Elimina una reserva.
 * Corresponde a: DELETE /api/bookings/{id}
 */
export async function deleteBooking(bookingId: number): Promise<void> {
  await axios.delete(`${API_URL}/${bookingId}`, getAuthHeaders());
}