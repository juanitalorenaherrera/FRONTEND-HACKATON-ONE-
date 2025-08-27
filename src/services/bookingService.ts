// src/services/bookingService.ts

import axios from "axios";

const API_URL = "http://localhost:8080/bookings";

// Describe los datos necesarios para CREAR una reserva
export interface BookingData {
    sitterId: string | number;
    serviceId: string | number;
    date: string;
}

// Describe el objeto de reserva COMPLETO que devuelve la API
export interface Booking extends BookingData {
    id: string | number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    ownerId: string | number;
}

/**
 * Crea una nueva reserva.
 * Requiere el token del dueño que está haciendo la reserva.
 */
export const createBooking = async (
    token: string, 
    bookingData: BookingData
): Promise<Booking> => { // Reemplazamos 'any' con el tipo 'Booking'
    const response = await axios.post<Booking>(API_URL, bookingData, { // Opcional: tipar la respuesta de axios
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};