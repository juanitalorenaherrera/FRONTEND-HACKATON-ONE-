// ===========================================
// services/bookingService.ts - Servicio completo alineado con backend
// ===========================================

import axios from '../services/auth';
import { type BookingDetailResponse, type CreateBookingRequest, BookingStatus, type BookingSummaryResponse,type UpdateBookingRequest, type PageResponse } from '../types/bookings';

const API_URL = '/api/bookings';

// ========== SERVICIOS ==========

/**
 * Crea una nueva reserva
 */
export const createBooking = async (
	request: CreateBookingRequest
): Promise<BookingDetailResponse> => {
	try {
		const response = await axios.post(`${API_URL}`, request);
		return response.data;
	} catch (error) {
		console.error('Error creating booking:', error);
		throw new Error('No se pudo crear la reserva');
	}
};

/**
 * Obtiene todas las reservas con paginación
 */
export const getAllBookings = async (
	page = 0,
	size = 20
): Promise<PageResponse<BookingSummaryResponse>> => {
	try {
		const response = await axios.get(`${API_URL}`, {
			params: { page, size },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching bookings:', error);
		throw new Error('No se pudieron cargar las reservas');
	}
};

/**
 * Obtiene una reserva específica por ID
 */
export const getBookingById = async (
	id: number
): Promise<BookingDetailResponse> => {
	try {
		const response = await axios.get(`${API_URL}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching booking by ID:', error);
		throw new Error('No se pudo cargar la reserva');
	}
};

/**
 * Actualiza una reserva existente
 */
export const updateBooking = async (
	id: number,
	request: UpdateBookingRequest
): Promise<BookingDetailResponse> => {
	try {
		const response = await axios.put(`${API_URL}/${id}`, request);
		return response.data;
	} catch (error) {
		console.error('Error updating booking:', error);
		throw new Error('No se pudo actualizar la reserva');
	}
};

/**
 * Elimina una reserva
 */
export const deleteBooking = async (id: number): Promise<void> => {
	try {
		await axios.delete(`${API_URL}/${id}`);
	} catch (error) {
		console.error('Error deleting booking:', error);
		throw new Error('No se pudo eliminar la reserva');
	}
};

/**
 * Obtiene reservas de un usuario específico
 */
export const getBookingsByUser = async (
	userId: number,
	role?: 'CLIENT' | 'SITTER',
	status?: string,
	page = 0,
	size = 20
): Promise<PageResponse<BookingSummaryResponse>> => {
	try {
		const response = await axios.get(`${API_URL}/user/${userId}`, {
			params: { role, status, page, size },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching bookings by user:', error);
		throw new Error('No se pudieron cargar las reservas del usuario');
	}
};

/**
 * Cambia el estado de una reserva
 */
export const updateBookingStatus = async (
	id: number,
	newStatus: BookingStatus,
	reason?: string
): Promise<BookingDetailResponse> => {
	try {
		const response = await axios.patch(`${API_URL}/${id}/status`, null, {
			params: { newStatus, reason },
		});
		return response.data;
	} catch (error) {
		console.error('Error updating booking status:', error);
		throw new Error('No se pudo actualizar el estado de la reserva');
	}
};

/**
 * Obtiene reservas próximas del usuario (para dashboard)
 */
export const getUpcomingBookings = async (
	limit = 5
): Promise<BookingSummaryResponse[]> => {
	try {
		const response = await axios.get(`${API_URL}`, {
			params: {
				page: 0,
				size: limit,
				sort: 'startTime,asc', // Ordenar por fecha de inicio ascendente
			},
		});

		// Filtrar solo las que están en el futuro y no canceladas
		const now = new Date();
		return response.data.content.filter(
			(booking: BookingSummaryResponse) => {
				const bookingDate = new Date(booking.startTime);
				return (
					bookingDate > now &&
					booking.status !== BookingStatus.CANCELLED
				);
			}
		);
	} catch (error) {
		console.error('Error fetching upcoming bookings:', error);
		throw new Error('No se pudieron cargar las próximas reservas');
	}
};

/**
 * Obtiene reservas de hoy
 */
export const getTodayBookings = async (): Promise<BookingSummaryResponse[]> => {
	try {
		const today = new Date();
		const startOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		);
		const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

		const response = await axios.get(`${API_URL}`, {
			params: {
				page: 0,
				size: 50, // Suficiente para un día
			},
		});

		// Filtrar reservas de hoy
		return response.data.content.filter(
			(booking: BookingSummaryResponse) => {
				const bookingDate = new Date(booking.startTime);
				return bookingDate >= startOfDay && bookingDate < endOfDay;
			}
		);
	} catch (error) {
		console.error('Error fetching today bookings:', error);
		throw new Error('No se pudieron cargar las reservas de hoy');
	}
};

/**
 * Obtiene estadísticas de reservas para el dashboard
 */
export const getBookingStats = async () => {
	try {
		const [upcomingResponse, todayBookings] = await Promise.all([
			getAllBookings(0, 100), // Obtener suficientes para calcular estadísticas
			getTodayBookings(),
		]);

		const allBookings = upcomingResponse.content;
		const now = new Date();

		// Calcular estadísticas
		const thisMonth = allBookings.filter((booking) => {
			const bookingDate = new Date(booking.startTime);
			return (
				bookingDate.getMonth() === now.getMonth() &&
				bookingDate.getFullYear() === now.getFullYear()
			);
		});

		const confirmed = allBookings.filter(
			(booking) => booking.status === BookingStatus.CONFIRMED
		);

		return {
			totalThisMonth: thisMonth.length,
			todayCount: todayBookings.length,
			confirmedCount: confirmed.length,
			upcomingBookings: allBookings
				.filter((booking) => {
					const bookingDate = new Date(booking.startTime);
					return (
						bookingDate > now &&
						booking.status !== BookingStatus.CANCELLED
					);
				})
				.slice(0, 5), // Solo las próximas 5
		};
	} catch (error) {
		console.error('Error fetching booking stats:', error);
		return {
			totalThisMonth: 0,
			todayCount: 0,
			confirmedCount: 0,
			upcomingBookings: [],
		};
	}
};
