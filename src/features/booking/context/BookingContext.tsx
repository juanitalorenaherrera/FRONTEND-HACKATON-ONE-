import React, { createContext, useContext, ReactNode, useReducer, useMemo } from 'react';
import { BookingSummary, BookingStats, BookingFilters } from '../types';
import { PageResponse } from '../types';

interface BookingsState {
    bookings: BookingSummary[];
    stats: BookingStats | null;
    pagination: {
        page: number;
        totalPages: number;
        totalElements: number;
        size: number;
    };
    isLoading: boolean;
    error: string | null;
    filters: BookingFilters;
}

type BookingsAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_DATA'; payload: { page: PageResponse<BookingSummary>, stats: BookingStats } }
    | { type: 'UPDATE_FILTERS'; payload: Partial<BookingFilters> };

const initialState: BookingsState = {
    bookings: [],
    stats: null,
    pagination: { page: 0, totalPages: 0, totalElements: 0, size: 15 },
    isLoading: true,
    error: null,
    filters: { sortBy: 'startTime', sortDirection: 'desc' },
};

function bookingsReducer(state: BookingsState, action: BookingsAction): BookingsState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload, error: null };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_DATA':
            return {
                ...state,
                isLoading: false,
                bookings: action.payload.page.content,
                stats: action.payload.stats,
                pagination: {
                    page: action.payload.page.number,
                    totalPages: action.payload.page.totalPages,
                    totalElements: action.payload.page.totalElements,
                    size: action.payload.page.size,
                },
            };
        case 'UPDATE_FILTERS':
            return { ...state, filters: { ...state.filters, ...action.payload }, pagination: { ...initialState.pagination, page: 0 } };
        default:
            return state;
    }
}

interface BookingsContextValue {
    state: BookingsState;
    dispatch: React.Dispatch<BookingsAction>;
}

const BookingsContext = createContext<BookingsContextValue | undefined>(undefined);

export function BookingsProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(bookingsReducer, initialState);
    return (
        <BookingsContext.Provider value={{ state, dispatch }}>
            {children}
        </BookingsContext.Provider>
    );
}

export const useBookingsContext = () => {
    const context = useContext(BookingsContext);
    if (!context) {
        throw new Error('useBookingsContext must be used within a BookingsProvider');
    }
    return context;
};