// ===========================================
// features/booking/hooks/useBookings.ts - Hook Principal
// ===========================================

import * as bookingService from '../../../services/bookingService';

import type { BookingActionOptions, BookingDetail, BookingFilters, BookingSummary, CreateBookingRequest, UpdateBookingRequest } from '../types';
import { filterAndSortBookings, shouldRefreshCache } from '../utils/bookingUtils';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { BOOKING_CONFIG } from '../constants';
import { useBookingContext } from '../context/BookingContext';

interface UseBookingsOptions {
    userId: number;
    role: 'CLIENT' | 'SITTER';
    autoRefresh?: boolean;
}

export function useBookings({ userId, role, autoRefresh = true }: UseBookingsOptions) {
    const { state, dispatch } = useBookingContext();
    const optimisticTimeouts = useRef<Map<number, NodeJS.Timeout>>(new Map());
    const refreshInterval = useRef<NodeJS.Timeout>();
    
    // Memoized filtered bookings
    const filteredBookings = useMemo(() => 
        filterAndSortBookings(state.bookings, state.filters),
        [state.bookings, state.filters]
    );
    
    // Cache management
    const shouldRefresh = useMemo(() => 
        shouldRefreshCache(state.lastFetch, BOOKING_CONFIG.CACHE_DURATION),
        [state.lastFetch]
    );
    
    // Core actions
    const loadBookings = useCallback(async (options: BookingActionOptions = {}) => {
        const { skipCache = false, silent = false } = options;
        
        // Don't refetch if cache is still valid unless forced
        if (!skipCache && !shouldRefresh && state.bookings.length > 0) {
            return;
        }
        
        if (!silent) {
            dispatch({ type: 'SET_LOADING', payload: true });
        }
        
        try {
            const [bookingsResponse, statsResponse] = await Promise.all([
                bookingService.getBookingsByUser(
                    userId,
                    role,
                    state.filters.status,
                    state.pagination.page,
                    state.pagination.size
                ),
                bookingService.getBookingStats().catch(() => null) // Don't fail if stats fail
            ]);
            
            const paginationData = {
                page: bookingsResponse.number,
                size: bookingsResponse.size,
                totalElements: bookingsResponse.totalElements,
                totalPages: bookingsResponse.totalPages,
                hasNext: !bookingsResponse.last,
                hasPrevious: !bookingsResponse.first,
            };
            
            dispatch({ 
                type: 'SET_BOOKINGS', 
                payload: { bookings: bookingsResponse.content, pagination: paginationData }
            });
            
            if (statsResponse) {
                dispatch({ type: 'SET_STATS', payload: statsResponse });
            }
            
        } catch (error) {
            dispatch({ 
                type: 'SET_ERROR', 
                payload: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }, [dispatch, shouldRefresh, state.bookings.length, state.filters, state.pagination, userId, role]);
    
    const createBooking = useCallback(async (
        bookingData: CreateBookingRequest, 
        options: BookingActionOptions = {}
    ) => {
        const { optimistic = true } = options;
        
        let tempBooking: BookingSummary | null = null;
        
        if (optimistic) {
            // Create temporary booking for optimistic update
            tempBooking = {
                id: Date.now(), // Temporary ID
                petName: 'Cargando...', // Will be replaced with real data
                sitterName: 'Cargando...', // Will be replaced with real data
                startTime: bookingData.startTime,
                status: bookingService.BookingStatus.PENDING,
                totalPrice: 0, // Will be calculated by backend
            };
            
            dispatch({ type: 'ADD_BOOKING', payload: tempBooking });
        }
        
        dispatch({ type: 'SET_UPDATING', payload: true });
        
        try {
            const newBooking = await bookingService.createBooking(bookingData);
            
            if (optimistic && tempBooking) {
                // Remove temp booking and add real one
                dispatch({ type: 'DELETE_BOOKING', payload: tempBooking.id });
            }
            
            // Convert BookingDetail to BookingSummary for list display
            const bookingSummary: BookingSummary = {
                id: newBooking.id,
                petName: newBooking.petName,
                sitterName: newBooking.sitterName,
                startTime: newBooking.startTime,
                status: newBooking.status,
                totalPrice: newBooking.totalPrice,
            };
            
            dispatch({ type: 'ADD_BOOKING', payload: bookingSummary });
            dispatch({ type: 'SET_UPDATING', payload: false });
            
            return newBooking;
        } catch (error) {
            // Rollback optimistic update
            if (optimistic && tempBooking) {
                dispatch({ type: 'DELETE_BOOKING', payload: tempBooking.id });
            }
            
            dispatch({ type: 'SET_UPDATING', payload: false });
            dispatch({ 
                type: 'SET_ERROR', 
                payload: error instanceof Error ? error.message : 'Error al crear reserva'
            });
            throw error;
        }
    }, [dispatch]);
    
    const updateBookingStatus = useCallback(async (
        bookingId: number, 
        newStatus: bookingService.BookingStatus,
        reason?: string,
        options: BookingActionOptions = {}
    ) => {
        const { optimistic = true } = options;
        
        const originalBooking = state.bookings.find(b => b.id === bookingId);
        if (!originalBooking) {
            throw new Error('Reserva no encontrada');
        }
        
        let timeoutId: NodeJS.Timeout | null = null;
        
        if (optimistic) {
            // Optimistic update
            const updatedBooking: BookingSummary = {
                ...originalBooking,
                status: newStatus,
            };
            
            dispatch({ type: 'UPDATE_BOOKING', payload: updatedBooking });
            
            // Set timeout to rollback if API call fails
            timeoutId = setTimeout(() => {
                dispatch({ type: 'UPDATE_BOOKING', payload: originalBooking });
                dispatch({ type: 'SET_ERROR', payload: 'Timeout al actualizar estado' });
            }, BOOKING_CONFIG.OPTIMISTIC_UPDATE_TIMEOUT);
            
            optimisticTimeouts.current.set(bookingId, timeoutId);
        }
        
        dispatch({ type: 'SET_UPDATING', payload: true });
        
        try {
            const updatedBookingDetail = await bookingService.updateBookingStatus(bookingId, newStatus, reason);
            
            // Clear timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
                optimisticTimeouts.current.delete(bookingId);
            }
            
            // Convert to summary for list display
            const updatedBookingSummary: BookingSummary = {
                id: updatedBookingDetail.id,
                petName: updatedBookingDetail.petName,
                sitterName: updatedBookingDetail.sitterName,
                startTime: updatedBookingDetail.startTime,
                status: updatedBookingDetail.status,
                totalPrice: updatedBookingDetail.totalPrice,
            };
            
            dispatch({ type: 'UPDATE_BOOKING', payload: updatedBookingSummary });
            dispatch({ type: 'SET_UPDATING', payload: false });
            
            return updatedBookingDetail;
        } catch (error) {
            // Clear timeout and rollback
            if (timeoutId) {
                clearTimeout(timeoutId);
                optimisticTimeouts.current.delete(bookingId);
            }
            
            if (optimistic) {
                dispatch({ type: 'UPDATE_BOOKING', payload: originalBooking });
            }
            
            dispatch({ type: 'SET_UPDATING', payload: false });
            dispatch({ 
                type: 'SET_ERROR', 
                payload: error instanceof Error ? error.message : 'Error al actualizar estado'
            });
            throw error;
        }
    }, [dispatch, state.bookings]);
    
    const deleteBooking = useCallback(async (
        bookingId: number,
        options: BookingActionOptions = {}
    ) => {
        const { optimistic = true } = options;
        
        const bookingToDelete = state.bookings.find(b => b.id === bookingId);
        if (!bookingToDelete) {
            throw new Error('Reserva no encontrada');
        }
        
        if (optimistic) {
            dispatch({ type: 'DELETE_BOOKING', payload: bookingId });
        }
        
        dispatch({ type: 'SET_UPDATING', payload: true });
        
        try {
            await bookingService.deleteBooking(bookingId);
            
            if (!optimistic) {
                dispatch({ type: 'DELETE_BOOKING', payload: bookingId });
            }
            
            dispatch({ type: 'SET_UPDATING', payload: false });
            
        } catch (error) {
            // Rollback optimistic update
            if (optimistic) {
                dispatch({ type: 'ADD_BOOKING', payload: bookingToDelete });
            }
            
            dispatch({ type: 'SET_UPDATING', payload: false });
            dispatch({ 
                type: 'SET_ERROR', 
                payload: error instanceof Error ? error.message : 'Error al eliminar reserva'
            });
            throw error;
        }
    }, [dispatch, state.bookings]);
    
    // Utility actions
    const selectBooking = useCallback(async (bookingId: number) => {
        try {
            const bookingDetail = await bookingService.getBookingById(bookingId);
            dispatch({ type: 'SET_CURRENT_BOOKING', payload: bookingDetail });
            return bookingDetail;
        } catch (error) {
            dispatch({ 
                type: 'SET_ERROR', 
                payload: error instanceof Error ? error.message : 'Error al cargar detalles'
            });
            throw error;
        }
    }, [dispatch]);
    
    const updateFilters = useCallback((filters: Partial<BookingFilters>) => {
        dispatch({ type: 'SET_FILTERS', payload: filters });
    }, [dispatch]);
    
    const changePage = useCallback((newPage: number) => {
        dispatch({ type: 'SET_PAGINATION', payload: { page: newPage } });
    }, [dispatch]);
    
    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, [dispatch]);
    
    const resetState = useCallback(() => {
        // Clear all optimistic timeouts
        optimisticTimeouts.current.forEach(timeout => clearTimeout(timeout));
        optimisticTimeouts.current.clear();
        
        if (refreshInterval.current) {
            clearInterval(refreshInterval.current);
        }
        
        dispatch({ type: 'RESET_STATE' });
    }, [dispatch]);
    
    // Auto-refresh functionality
    useEffect(() => {
        if (!autoRefresh) return;
        
        refreshInterval.current = setInterval(() => {
            if (!document.hidden) { // Only refresh if page is visible
                loadBookings({ silent: true });
            }
        }, BOOKING_CONFIG.AUTO_REFRESH_INTERVAL);
        
        return () => {
            if (refreshInterval.current) {
                clearInterval(refreshInterval.current);
            }
        };
    }, [autoRefresh, loadBookings]);
    
    // Load bookings when filters or pagination change
    useEffect(() => {
        loadBookings();
    }, [state.filters, state.pagination.page]);
    
    // Cleanup on unmount
    const cleanup = useCallback(() => {
        optimisticTimeouts.current.forEach(timeout => clearTimeout(timeout));
        optimisticTimeouts.current.clear();
        
        if (refreshInterval.current) {
            clearInterval(refreshInterval.current);
        }
    }, []);
    
    return {
        // State
        bookings: state.bookings,
        filteredBookings,
        currentBooking: state.currentBooking,
        stats: state.stats,
        filters: state.filters,
        pagination: state.pagination,
        isLoading: state.isLoading,
        isUpdating: state.isUpdating,
        error: state.error,
        
        // Cache info
        shouldRefresh,
        lastFetch: state.lastFetch,
        
        // Actions
        loadBookings,
        createBooking,
        updateBookingStatus,
        deleteBooking,
        selectBooking,
        updateFilters,
        changePage,
        clearError,
        resetState,
        cleanup,
        
        // Computed metrics
        totalBookings: state.pagination.totalElements,
        hasNextPage: state.pagination.hasNext,
        hasPreviousPage: state.pagination.hasPrevious,
        
        // Quick access to common booking states
        pendingBookings: filteredBookings.filter(b => b.status === bookingService.BookingStatus.PENDING),
        upcomingBookings: filteredBookings.filter(b => {
            const bookingDate = new Date(b.startTime);
            return bookingDate > new Date() && b.status !== bookingService.BookingStatus.CANCELLED;
        }),
    };
}