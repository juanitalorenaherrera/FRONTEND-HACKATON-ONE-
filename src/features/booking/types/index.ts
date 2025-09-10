import { BookingStatus } from './enums';

// ===========================================
// Modelos de Datos (Backend y UI)
// ===========================================

export interface BookingSummary {
    id: number;
    petName: string;
    sitterName: string;
    startTime: string; // ISO String
    status: BookingStatus;
    totalPrice: number;
}

export interface BookingDetail extends BookingSummary {
    petId: number;
    sitterId: number;
    serviceOfferingId: number;
    serviceName: string;
    bookedByUserId: number;
    bookedByUserName: string;
    endTime: string; // ISO String
    actualStartTime?: string;
    actualEndTime?: string;
    notes?: string;
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookingStats {
    totalThisMonth: number;
    todayCount: number;
    confirmedCount: number;
    upcomingBookings: BookingSummary[];
}

// ===========================================
// Payloads de API (Requests y Responses)
// ===========================================

export interface CreateBookingRequest {
    petId: number;
    sitterId: number;
    serviceOfferingId: number;
    startTime: string; // ISO string
    notes?: string;
}

export interface UpdateBookingRequest {
    startTime?: string;
    notes?: string;
    totalPrice?: number;
    actualStartTime?: string;
    actualEndTime?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

// ===========================================
// Filtros y Estados
// ===========================================

export interface BookingFilters {
    status?: BookingStatus;
    dateRange?: {
        from: Date;
        to: Date;
    };
    sortBy?: 'startTime' | 'totalPrice';
    sortDirection?: 'asc' | 'desc';
}

// Separamos el Enum para poder importarlo en otros lugares si es necesario
// src/features/booking/types/enums.ts
export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED', 
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}