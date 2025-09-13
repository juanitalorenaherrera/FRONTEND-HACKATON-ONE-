import * as bookingService from '../../../services/bookingService';

import type { BookingStatus, CreateBookingRequest } from '../types';

import { useBookingContext } from '../hooks/useBookingContext';
import { useCallback } from 'react';
import { useAuthStore } from '../../../store/AuthStore';

/**
 * Hook que encapsula las funciones para interactuar con la feature de reservas.
 */
export function useBookingActions() {
	const { state, dispatch } = useBookingContext();
	const user = useAuthStore((state) => state.profile);

    const loadBookings = useCallback(async () => {
        if (!user) return dispatch({ type: 'SET_ERROR', payload: 'Usuario no autenticado.' });

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const filters = {
                page: state.pagination.currentPage - 1, // Spring es 0-indexed
                size: state.pagination.pageSize,
                // ...otros filtros de state.filters
            };
            const bookingsPage = await bookingService.getBookingsByUser(user.id, user.role as 'CLIENT' | 'SITTER', filters);

            // La lógica para calcular stats es un buen candidato para un utilitario
            const stats = {
                totalCount: 0,
                pendingCount: 0,
                confirmedCount: 0,
                inProgressCount: 0,
                upcomingCount: 0
            };

            dispatch({ type: 'SET_DATA_SUCCESS', payload: { page: bookingsPage, stats } });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            dispatch({ type: 'SET_ERROR', payload: message });
        }
    }, [user, dispatch, state.pagination.currentPage, state.pagination.pageSize]);

    const refreshBookings = useCallback(async (accountId: number) => {
        if (!user) return dispatch({ type: 'SET_ERROR', payload: 'Usuario no autenticado.' });
        
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const filters = {
                page: state.pagination.currentPage - 1,
                size: state.pagination.pageSize,
            };
            const bookingsPage = await bookingService.getBookingsByUser(accountId, user.role as 'CLIENT' | 'SITTER', filters);
            const stats = {
                totalCount: 0,
                pendingCount: 0,
                confirmedCount: 0,
                inProgressCount: 0,
                upcomingCount: 0
            };
            dispatch({ type: 'SET_DATA_SUCCESS', payload: { page: bookingsPage, stats } });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            dispatch({ type: 'SET_ERROR', payload: message });
        }
    }, [user, dispatch, state.pagination.currentPage, state.pagination.pageSize]);

    const createBooking = useCallback(async (bookingData: CreateBookingRequest) => {
        try {
            await bookingService.createBooking(bookingData);
            await loadBookings(); // Recargamos para ver el nuevo dato
        } catch {
            const message = 'Error al crear la reserva';
            dispatch({ type: 'SET_ERROR', payload: message });
            throw new Error(message);
        }
    }, [dispatch, loadBookings]);
    
    const deleteBooking = useCallback(async (bookingId: number) => {
        try {
            await bookingService.deleteBooking(bookingId);
            dispatch({ type: 'DELETE_BOOKING_SUCCESS', payload: bookingId });
        } catch {
            dispatch({ type: 'SET_ERROR', payload: 'No se pudo eliminar la reserva' });
        }
    }, [dispatch]);
    
    const updateStatus = useCallback(async (bookingId: number, newStatus: BookingStatus, reason?: string) => {
        try {
            await bookingService.updateBookingStatus(bookingId, newStatus, reason);
            await loadBookings(); // Reload to get updated data
        } catch {
            dispatch({ type: 'SET_ERROR', payload: 'No se pudo actualizar el estado' });
        }
    }, [dispatch, loadBookings]);
    
    const selectBooking = useCallback(async (bookingId: number | null) => {
        if (bookingId === null) {
            return dispatch({ type: 'SET_SELECTED_BOOKING', payload: null });
        }
        try {
            const bookingDetail = await bookingService.getBookingById(bookingId);
            dispatch({ type: 'SET_SELECTED_BOOKING', payload: bookingDetail });
        } catch {
            dispatch({ type: 'SET_ERROR', payload: 'Error al cargar detalles' });
        }
    }, [dispatch]);


    
    const setPage = useCallback((page: number) => {
        dispatch({ type: 'SET_PAGE', payload: page });
    }, [dispatch]);

    return {
        // Solo retornamos las funciones. El estado se consume con `useBookingContext`.
        loadBookings,
        refreshBookings, 
        createBooking,
        deleteBooking,
        updateStatus,
        selectBooking,
        setPage,
    };
}