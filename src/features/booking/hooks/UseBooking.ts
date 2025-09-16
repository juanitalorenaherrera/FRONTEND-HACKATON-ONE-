// ===========================================
// features/booking/hooks/useBookings.ts - Hook Principal
// ===========================================

import * as bookingService from '@/services/bookingService';

import type { BookingSummary, CreateBookingRequest } from '../types';
import { BookingStatus } from '@/features/booking/types';
import { Role } from '@/types/authStore';
import {
	filterAndSortBookings,
	shouldRefreshCache,
} from '../utils/bookingUtils';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { BOOKING_CONFIG } from '@/features/booking/constants/config';
import { useBookingContext } from './useBookingContext';

interface BookingActionOptions {
	skipCache?: boolean;
	silent?: boolean;
	optimistic?: boolean;
}

interface UseBookingsOptions {
	userId: number;
	role: Role;
	autoRefresh?: boolean;
}

export function useBookings({
	userId,
	role,
	autoRefresh = true,
}: UseBookingsOptions) {
	const { state, dispatch } = useBookingContext();
	const optimisticTimeouts = useRef<Map<number, NodeJS.Timeout>>(new Map());
	const refreshInterval = useRef<NodeJS.Timeout>(
		setInterval(
			() => loadBookings({ skipCache: true }),
			BOOKING_CONFIG.AUTO_REFRESH_INTERVAL
		)
	);

	// Memoized filtered bookings
	const filteredBookings = useMemo(
		() => filterAndSortBookings(state.bookings, state.filters),
		[state.bookings, state.filters]
	);

	// Cache management - lastFetch not available in current state
	const shouldRefresh = useMemo(
		() => shouldRefreshCache(null, BOOKING_CONFIG.CACHE_DURATION),
		[]
	);

	// Core actions
	const loadBookings = useCallback(
		async (options: BookingActionOptions = {}) => {
			const { skipCache = false, silent = false } = options;

			// Don't refetch if cache is still valid unless forced
			if (!skipCache && !shouldRefresh && state.bookings.length > 0) {
				return;
			}

			if (!silent) {
				dispatch({ type: 'SET_LOADING', payload: true });
			}

			try {
				const bookingsResponse = await bookingService.getBookingsByUser(
					userId,
					role,
					{
						page: state.pagination.currentPage,
						size: state.pagination.pageSize,
					}
				);

				const stats = {
					totalCount: bookingsResponse.totalElements,
					pendingCount: 0,
					confirmedCount: 0,
					inProgressCount: 0,
					upcomingCount: 0,
				};

				dispatch({
					type: 'SET_DATA_SUCCESS',
					payload: { page: bookingsResponse, stats },
				});
			} catch (error) {
				dispatch({
					type: 'SET_ERROR',
					payload:
						error instanceof Error
							? error.message
							: 'Error desconocido',
				});
			}
		},
		[
			dispatch,
			shouldRefresh,
			state.bookings.length,
			state.pagination,
			userId,
			role,
		]
	);

	const createBooking = useCallback(
		async (
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
					status: BookingStatus.PENDING,
					totalPrice: 0, // Will be calculated by backend
				};

				dispatch({ type: 'ADD_BOOKING_SUCCESS', payload: tempBooking });
			}

			try {
				const newBooking = await bookingService.createBooking(
					bookingData.petId,
					bookingData.sitterId,
					bookingData.serviceOfferingId,
					bookingData.startTime,
					bookingData.notes
				);

				if (optimistic && tempBooking) {
					// Remove temp booking and add real one
					dispatch({
						type: 'DELETE_BOOKING_SUCCESS',
						payload: tempBooking.id,
					});
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

				dispatch({
					type: 'ADD_BOOKING_SUCCESS',
					payload: bookingSummary,
				});

				return newBooking;
			} catch (error) {
				// Rollback optimistic update
				if (optimistic && tempBooking) {
					dispatch({
						type: 'DELETE_BOOKING_SUCCESS',
						payload: tempBooking.id,
					});
				}

				dispatch({
					type: 'SET_ERROR',
					payload:
						error instanceof Error
							? error.message
							: 'Error al crear reserva',
				});
				throw error;
			}
		},
		[dispatch]
	);

	const updateBookingStatus = useCallback(
		async (
			bookingId: number,
			newStatus: BookingStatus,
			reason?: string,
			options: BookingActionOptions = {}
		) => {
			const { optimistic = true } = options;

			const originalBooking = state.bookings.find(
				(b: BookingSummary) => b.id === bookingId
			);
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

				dispatch({
					type: 'UPDATE_BOOKING_SUCCESS',
					payload: updatedBooking,
				});

				// Set timeout to rollback if API call fails
				timeoutId = setTimeout(() => {
					dispatch({
						type: 'UPDATE_BOOKING_SUCCESS',
						payload: originalBooking,
					});
					dispatch({
						type: 'SET_ERROR',
						payload: 'Timeout al actualizar estado',
					});
				}, BOOKING_CONFIG.OPTIMISTIC_UPDATE_TIMEOUT);

				optimisticTimeouts.current.set(bookingId, timeoutId);
			}

			try {
				const updatedBookingDetail =
					await bookingService.updateBookingStatus(
						bookingId,
						newStatus,
						reason
					);

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

				dispatch({
					type: 'UPDATE_BOOKING_SUCCESS',
					payload: updatedBookingSummary,
				});

				return updatedBookingDetail;
			} catch (error) {
				// Clear timeout and rollback
				if (timeoutId) {
					clearTimeout(timeoutId);
					optimisticTimeouts.current.delete(bookingId);
				}

				if (optimistic) {
					dispatch({
						type: 'UPDATE_BOOKING_SUCCESS',
						payload: originalBooking,
					});
				}
				dispatch({
					type: 'SET_ERROR',
					payload:
						error instanceof Error
							? error.message
							: 'Error al actualizar estado',
				});
				throw error;
			}
		},
		[dispatch, state.bookings]
	);

	const deleteBooking = useCallback(
		async (bookingId: number, options: BookingActionOptions = {}) => {
			const { optimistic = true } = options;

			const bookingToDelete = state.bookings.find(
				(b: BookingSummary) => b.id === bookingId
			);
			if (!bookingToDelete) {
				throw new Error('Reserva no encontrada');
			}

			if (optimistic) {
				dispatch({
					type: 'DELETE_BOOKING_SUCCESS',
					payload: bookingId,
				});
			}

			try {
				await bookingService.deleteBooking(bookingId);

				if (!optimistic) {
					dispatch({
						type: 'DELETE_BOOKING_SUCCESS',
						payload: bookingId,
					});
				}
			} catch (error) {
				// Rollback optimistic update
				if (optimistic) {
					dispatch({
						type: 'ADD_BOOKING_SUCCESS',
						payload: bookingToDelete,
					});
				}

				dispatch({
					type: 'SET_ERROR',
					payload:
						error instanceof Error
							? error.message
							: 'Error al eliminar reserva',
				});
				throw error;
			}
		},
		[dispatch, state.bookings]
	);

	// Utility actions
	const selectBooking = useCallback(
		async (bookingId: number) => {
			try {
				const bookingDetail = await bookingService.getBookingById(
					bookingId
				);
				dispatch({
					type: 'SET_SELECTED_BOOKING',
					payload: bookingDetail,
				});
				return bookingDetail;
			} catch (error) {
				dispatch({
					type: 'SET_ERROR',
					payload:
						error instanceof Error
							? error.message
							: 'Error al cargar detalles',
				});
				throw error;
			}
		},
		[dispatch]
	);

	const updateFilters = useCallback(() => {
		// Filters are handled by the backend API call, no local state update needed
	}, []);

	const changePage = useCallback(
		(newPage: number) => {
			dispatch({ type: 'SET_PAGE', payload: newPage });
		},
		[dispatch]
	);

	const clearError = useCallback(() => {
		// Error clearing is handled by other actions, no specific action needed
	}, []);

	const resetState = useCallback(() => {
		// Clear all optimistic timeouts
		optimisticTimeouts.current.forEach((timeout) => clearTimeout(timeout));
		optimisticTimeouts.current.clear();

		if (refreshInterval.current) {
			clearInterval(refreshInterval.current);
		}

		// State reset is handled by reloading data, no specific action needed
	}, []);

	// Auto-refresh functionality
	useEffect(() => {
		if (!autoRefresh) return;

		refreshInterval.current = setInterval(() => {
			if (!document.hidden) {
				// Only refresh if page is visible
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
	}, [loadBookings, state.filters, state.pagination.currentPage]);

	// Cleanup on unmount
	const cleanup = useCallback(() => {
		optimisticTimeouts.current.forEach((timeout) => clearTimeout(timeout));
		optimisticTimeouts.current.clear();

		if (refreshInterval.current) {
			clearInterval(refreshInterval.current);
		}
	}, []);

	return {
		// State
		bookings: state.bookings,
		filteredBookings,
		currentBooking: state.selectedBooking,
		stats: state.stats,
		filters: state.filters,
		pagination: state.pagination,
		isLoading: state.isLoading,

		error: state.error,

		// Cache info
		shouldRefresh,

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
		hasPreviousPage: state.pagination.currentPage > 1,

		// Quick access to common booking states
		pendingBookings: filteredBookings.filter(
			(b) => b.status === BookingStatus.PENDING
		),
		upcomingBookings: filteredBookings.filter((b) => {
			const bookingDate = new Date(b.startTime);
			return (
				bookingDate > new Date() && b.status !== BookingStatus.CANCELLED
			);
		}),
	};
}
