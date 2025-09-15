// src/services/bookingService.ts

import type {
  BookingDetail,
  BookingSummary,
  CreateBookingRequest,
  GetBookingsRequest,
  PageResponse,
  UpdateBookingRequest,
  UpdateBookingStatusRequest,
} from '../types/bookings';

import authApi from './auth';

const API_URL = '/api/bookings';

/**
 * Crea una nueva reserva.
 * @param bookingData - Objeto con los detalles para la nueva reserva.
 */
export const createBooking = async (
  bookingData: CreateBookingRequest
): Promise<BookingDetail> => {
  const { data } = await authApi.post<BookingDetail>(API_URL, bookingData);
  return data;
};

/**
 * Obtiene las reservas de un usuario con paginación y filtros.
 * @param params - Objeto con los parámetros de filtrado y paginación.
 */
export const getBookingsByUser = async (
  params: GetBookingsRequest
): Promise<PageResponse<BookingSummary>> => {
  // Axios se encarga de serializar el objeto 'params' en la URL
  const { data } = await authApi.get<PageResponse<BookingSummary>>(API_URL, { params });
  return data;
};

/**
 * Obtiene los detalles completos de una reserva por su ID.
 * @param bookingId - El ID de la reserva a obtener.
 */
export const getBookingById = async (bookingId: number): Promise<BookingDetail> => {
  const { data } = await authApi.get<BookingDetail>(`${API_URL}/${bookingId}`);
  return data;
};

/**
 * Actualiza una reserva existente (ej. cambiar notas o fecha).
 * @param bookingId - El ID de la reserva a actualizar.
 * @param updateData - Los campos de la reserva a modificar.
 */
export const updateBooking = async (
  bookingId: number,
  updateData: UpdateBookingRequest
): Promise<BookingDetail> => {
  const { data } = await authApi.put<BookingDetail>(`${API_URL}/${bookingId}`, updateData);
  return data;
};

/**
 * Cambia el estado de una reserva (ej. confirmar, cancelar).
 * @param bookingId - El ID de la reserva a modificar.
 * @param statusUpdate - Objeto con el nuevo estado y una razón opcional.
 */
export const updateBookingStatus = async (
  bookingId: number,
  statusUpdate: UpdateBookingStatusRequest
): Promise<BookingDetail> => {
  const { data } = await authApi.patch<BookingDetail>(
    `${API_URL}/${bookingId}/status`,
    statusUpdate // El body ahora contiene los datos
  );
  return data;
};

/**
 * Elimina una reserva.
 * @param bookingId - El ID de la reserva a eliminar.
 */
export const deleteBooking = async (bookingId: number): Promise<void> => {
  await authApi.delete(`${API_URL}/${bookingId}`);
};