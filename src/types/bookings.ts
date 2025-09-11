// ========== INTERFACES ALINEADAS CON BACKEND ==========

/**
 * Estados de reserva según el backend
 */
export enum BookingStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

/**
 * Interface para crear una nueva reserva
 * Basada en CreateBookingRequest del backend
 */
export interface CreateBookingRequest {
	petId: number;
	sitterId: number;
	serviceOfferingId: number;
	startTime: string; // ISO string
	notes?: string;
}

/**
 * Interface para actualizar una reserva
 * Basada en UpdateBookingRequest del backend
 */
export interface UpdateBookingRequest {
	startTime?: string;
	notes?: string;
	totalPrice?: number;
	actualStartTime?: string;
	actualEndTime?: string;
}

/**
 * Interface para resumen de reservas
 * Basada en BookingSummaryResponse del backend
 */
export interface BookingSummaryResponse {
	id: number;
	petName: string;
	sitterName: string;
	startTime: string;
	status: BookingStatus;
	totalPrice: number;
}

/**
 * Interface para detalles completos de reserva
 * Basada en BookingDetailResponse del backend
 */
export interface BookingDetailResponse {
	id: number;
	petId: number;
	petName: string;
	sitterId: number;
	sitterName: string;
	serviceOfferingId: number;
	serviceName: string;
	bookedByUserId: number;
	bookedByUserName: string;
	startTime: string;
	endTime: string;
	actualStartTime?: string;
	actualEndTime?: string;
	status: BookingStatus;
	totalPrice: number;
	notes?: string;
	cancellationReason?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Interface para paginación
 */
export interface PageResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}
