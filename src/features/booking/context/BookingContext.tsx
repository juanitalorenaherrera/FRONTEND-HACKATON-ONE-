/* eslint-disable react-refresh/only-export-components */
import type { BookingSummary, BookingDetail, BookingFilters, BookingStats, PaginationState, PageResponse } from '@/features/booking/types';
import { BookingStatus } from '@/features/booking/types';
import React, { createContext, useMemo, useReducer } from 'react';

import type { ReactNode } from 'react';

// ====================================================================
// 1. INTERFACES Y TIPOS COMPLETOS
// ====================================================================

interface BookingsState {
    bookings: BookingSummary[];
    selectedBooking: BookingDetail | null;
    stats: BookingStats | null;
    isLoading: boolean;
    error: string | null;
    filters: BookingFilters;
    pagination: PaginationState;
}

// Todas las acciones que pueden modificar el estado de las reservas
type BookingsAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_DATA_SUCCESS'; payload: { page: PageResponse<BookingSummary>; stats: BookingStats } }
    | { type: 'SET_SELECTED_BOOKING'; payload: BookingDetail | null }
    | { type: 'DELETE_BOOKING_SUCCESS'; payload: number } // id de la reserva
    | { type: 'UPDATE_BOOKING_SUCCESS'; payload: BookingSummary } // Resumen de la reserva
    | { type: 'ADD_BOOKING_SUCCESS'; payload: BookingSummary }
    | { type: 'SET_PAGE'; payload: number };

export interface BookingContextValue {
    state: BookingsState;
    dispatch: React.Dispatch<BookingsAction>;
    filteredBookings: BookingSummary[];
}

// ====================================================================
// 2. ESTADO INICIAL Y REDUCER COMPLETOS
// ====================================================================

const initialState: BookingsState = {
    bookings: [],
    selectedBooking: null,
    stats: null,
    isLoading: true,
    error: null,
    filters: {
        status: [BookingStatus.PENDING, BookingStatus.CONFIRMED], // Ejemplo de filtro inicial
        sortBy: 'startTime',
        sortOrder: 'asc',
    },
    pagination: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: 0,
        hasNext: false,
    },
};

function bookingsReducer(state: BookingsState, action: BookingsAction): BookingsState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload, error: null };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_DATA_SUCCESS':
            return {
                ...state,
                isLoading: false,
                bookings: action.payload.page.content,
                stats: action.payload.stats,
                pagination: {
                    ...state.pagination,
                    currentPage: action.payload.page.number + 1, // Spring pages son 0-indexed
                    totalPages: action.payload.page.totalPages,
                    totalElements: action.payload.page.totalElements,
                    hasNext: !action.payload.page.last,
                },
            };
        case 'SET_SELECTED_BOOKING':
            return { ...state, selectedBooking: action.payload };
        case 'DELETE_BOOKING_SUCCESS':
            return { 
                ...state,
                bookings: state.bookings.filter(b => b.id !== action.payload),
                stats: state.stats ? { ...state.stats, totalCount: state.stats.totalCount - 1 } : null,
            };
        case 'UPDATE_BOOKING_SUCCESS':
            return {
                ...state,
                bookings: state.bookings.map(b => b.id === action.payload.id ? action.payload : b),
            };
        case 'ADD_BOOKING_SUCCESS':
            return { ...state, bookings: [action.payload, ...state.bookings] };
        case 'SET_PAGE':
            return { ...state, pagination: { ...state.pagination, currentPage: action.payload } };
        default:
            return state;
    }
}

// ====================================================================
// 3. CONTEXTO Y PROVEEDOR OPTIMIZADOS
// ====================================================================

export const BookingContext = createContext<BookingContextValue | undefined>(undefined);
 
export function BookingsProvider({ children }: { readonly children: ReactNode }) {
    const [state, dispatch] = useReducer(bookingsReducer, initialState);

    const filteredBookings = useMemo(() => {
        // Aquí iría la lógica de filtrado del frontend si la necesitaras.
        // Por ahora, devolvemos las reservas tal cual vienen de la paginación.
        return state.bookings;
    }, [state.bookings]); // Dependencia simplificada

    const value = useMemo(() => ({
        state,
        dispatch,
        filteredBookings,
    }), [state, filteredBookings]);

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}