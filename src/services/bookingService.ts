import { Booking, BookingStatus, CreateBookingDTO } from '../types/common.types';

import { ApiResponse } from '../types/api.types';
import { apiClient } from './api';

export class BookingService {
  // GET /bookings - Historial de reservas del usuario
  async getAll(): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings');
    return response.data.data;
  }

  // GET /bookings/{id} - Detalle de reserva específica
  async getById(id: string): Promise<Booking> {
    const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data.data;
  }

  // POST /bookings - Crear nueva reserva
  async create(bookingData: CreateBookingDTO): Promise<Booking> {
    const response = await apiClient.post<ApiResponse<Booking>>('/bookings', bookingData);
    return response.data.data;
  }

  // PUT /bookings/{id}/status - Actualizar estado de reserva
  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const response = await apiClient.put<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
    return response.data.data;
  }

  // POST /bookings/{id}/cancel - Cancelar reserva
  async cancel(id: string, reason?: string): Promise<void> {
    await apiClient.post(`/bookings/${id}/cancel`, { reason });
  }

  // GET /bookings/upcoming - Próximas reservas
  async getUpcoming(): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings/upcoming');
    return response.data.data;
  }

  // GET /bookings/past - Reservas pasadas
  async getPast(): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings/past');
    return response.data.data;
  }

  // GET /bookings/pending - Reservas pendientes de confirmación
  async getPending(): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings/pending');
    return response.data.data;
  }

  // POST /bookings/{id}/review - Dejar reseña después del servicio
  async addReview(id: string, rating: number, comment: string): Promise<void> {
    await apiClient.post(`/bookings/${id}/review`, { rating, comment });
  }

  // GET /bookings/{id}/messages - Mensajes con el cuidador
  async getMessages(id: string): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/bookings/${id}/messages`);
    return response.data.data;
  }

  // POST /bookings/{id}/messages - Enviar mensaje al cuidador
  async sendMessage(id: string, message: string): Promise<void> {
    await apiClient.post(`/bookings/${id}/messages`, { message });
  }

  // GET /bookings/calculate-price - Calcular precio de reserva
  async calculatePrice(
    sitterId: string,
    service: string,
    startDate: string,
    endDate: string
  ): Promise<{ amount: number; tax: number; total: number }> {
    const response = await apiClient.get<ApiResponse<any>>('/bookings/calculate-price', {
      params: { sitterId, service, startDate, endDate }
    });
    return response.data.data;
  }
}

export const bookingService = new BookingService();