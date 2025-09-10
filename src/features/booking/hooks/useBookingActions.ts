import { useEffect, useCallback } from 'react';
import { useBookingsContext } from '../context/BookingContext';
import * as bookingService from '../../../services/bookingService';

export function useBookingActions(userId: number, role: 'CLIENT' | 'SITTER') {
    const { state, dispatch } = useBookingsContext();

    const fetchData = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const [bookingsPage, bookingStats] = await Promise.all([
                bookingService.getBookingsByUser(
                    userId,
                    role,
                    state.filters.status,
                    state.pagination.page,
                    state.pagination.size
                ),
                bookingService.getBookingStats()
            ]);
            dispatch({ type: 'SET_DATA', payload: { page: bookingsPage, stats: bookingStats } });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar las reservas';
            dispatch({ type: 'SET_ERROR', payload: message });
        }
    }, [dispatch, state.filters, state.pagination.page, state.pagination.size, userId, role]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const setPage = (page: number) => {
        // Lógica para cambiar de página podría ir aquí, actualizando los filtros
        dispatch({ type: 'UPDATE_FILTERS', payload: { /* ... */ } });
    };

    return { refetch: fetchData, setPage };
}