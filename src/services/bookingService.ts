import type {
	BookingDetail,
	BookingFormData,
	BookingStatus,
	BookingSummary,
	PageResponse,
	UpdateBookingRequest
} from '@/features/booking/types';

import type { Role } from '@/features/auth/types/authStore';
import axios from './auth';

const API_URL = '/api/bookings';
/**
 * Crea una nueva reserva.
 * Corresponde a: POST /api/bookings
 */
export async function createBooking(
	data: BookingFormData
): Promise<BookingDetail> {
	const payload = {
		petId: data.petId,
		sitterId: data.sitterId,
		serviceOfferingId: data.serviceId, // Mapea el nombre del campo
		startTime: data.startDate?.toISOString(),
		endTime: data.endDate?.toISOString(),
		notes: data.additionalNotes,
	};

	const { data: responseData } = await axios.post<BookingDetail>(
		API_URL,
		payload
	);
	return responseData;
}
/**
 * Obtiene las reservas de un usuario específico con paginación y filtros.
 * Corresponde a: GET /api/bookings/user/{userId}
 */
export async function getBookingsByUser(
	userId: number,
	role: Role,
	filters: { status?: string; page?: number; size?: number }
): Promise<PageResponse<BookingSummary>> {
	const { data } = await axios.get<PageResponse<BookingSummary>>(
		`${API_URL}`,
		{ params: { userId, role, ...filters } }
	);
	return data;
}
/**
 * Obtiene los detalles completos de una reserva por su ID.
 * Corresponde a: GET /api/bookings/{id}
 */
export async function getBookingById(
	bookingId: number
): Promise<BookingDetail> {
	const { data } = await axios.get<BookingDetail>(`${API_URL}/${bookingId}`);
	return data;
}
/**
 * Actualiza una reserva existente.
 * Corresponde a: PUT /api/bookings/{id}
 */
export async function updateBooking(
	bookingId: number,
	request: UpdateBookingRequest
): Promise<BookingDetail> {
	const { data } = await axios.put<BookingDetail>(
		`${API_URL}/${bookingId}`,
		request
	);
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
	await axios.delete(`${API_URL}/${bookingId}`);
}

// Método para obtener la tarifa de la plataforma.
export const getPlatformFee = async (): Promise<{ percentage: number }> => {
	const response = await axios.get<{ percentage: number }>(
		`${API_URL}/platform-fees/latest`
	);
	return response.data;
};
