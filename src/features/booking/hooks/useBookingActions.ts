import * as bookingService from '@/services/bookingService';

import type { BookingFormData, BookingStatus } from '../types';

import type { Role } from '@/features/auth/types/authStore';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/AuthStore';
import { useBookingContext } from '../hooks/useBookingContext';
import { useCallback } from 'react';

export function useBookingActions() {
	const { state, dispatch } = useBookingContext();
	const user = useAuthStore((state) => state.profile);

	const loadBookings = useCallback(async () => {
		if (!user)
			return dispatch({
				type: 'SET_ERROR',
				payload: 'Usuario no autenticado.',
			});

		dispatch({ type: 'SET_LOADING', payload: true });
		try {
			const filters = {
				page: state.pagination.currentPage - 1,
				size: state.pagination.pageSize,
			};
			const bookingsPage = await bookingService.getBookingsByUser(
				user.id,
				user.role as Role,
				filters
			);

			// Suponemos que las stats se calcularán en el frontend o vendrán en otra llamada
			const stats = {
				totalCount: bookingsPage.totalElements,
				pendingCount: 0, // Placeholder
				confirmedCount: 0, // Placeholder
				inProgressCount: 0, // Placeholder
				upcomingCount: 0, // Placeholder
			};

			dispatch({
				type: 'SET_DATA_SUCCESS',
				payload: { page: bookingsPage, stats },
			});
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: 'Error desconocido al cargar reservas';
			dispatch({ type: 'SET_ERROR', payload: message });
		}
	}, [
		user,
		dispatch,
		state.pagination.currentPage,
		state.pagination.pageSize,
	]);

	const refreshBookings = useCallback(async () => {
		await loadBookings();
	}, [loadBookings]);

	const createBooking = useCallback(
		async (bookingFormData: BookingFormData) => {
			try {
				await bookingService.createBooking(bookingFormData);
				toast.success('Reserva creada con éxito.');
				await loadBookings();
			} catch (error) {
				const message = 'Error al crear la reserva';
				console.error(message, error);
				dispatch({ type: 'SET_ERROR', payload: message });
				toast.error(message);
				throw new Error(message);
			}
		},
		[dispatch, loadBookings]
	);

	const deleteBooking = useCallback(
		async (bookingId: number) => {
			try {
				await bookingService.deleteBooking(bookingId);
				toast.success('Reserva eliminada.');
				dispatch({
					type: 'DELETE_BOOKING_SUCCESS',
					payload: bookingId,
				});
			} catch {
				const message = 'No se pudo eliminar la reserva';
				dispatch({ type: 'SET_ERROR', payload: message });
				toast.error(message);
			}
		},
		[dispatch]
	);

	const updateStatus = useCallback(
		async (
			bookingId: number,
			newStatus: BookingStatus,
			reason?: string
		) => {
			try {
				await bookingService.updateBookingStatus(
					bookingId,
					newStatus,
					reason
				);
				toast.success(`Estado actualizado a ${newStatus}.`);
				await loadBookings();
			} catch {
				const message = 'No se pudo actualizar el estado';
				dispatch({ type: 'SET_ERROR', payload: message });
				toast.error(message);
			}
		},
		[dispatch, loadBookings]
	);

	const selectBooking = useCallback(
		async (bookingId: number | null) => {
			if (bookingId === null) {
				return dispatch({
					type: 'SET_SELECTED_BOOKING',
					payload: null,
				});
			}
			try {
				const bookingDetail = await bookingService.getBookingById(
					bookingId
				);
				dispatch({
					type: 'SET_SELECTED_BOOKING',
					payload: bookingDetail,
				});
			} catch {
				const message = 'Error al cargar los detalles';
				dispatch({ type: 'SET_ERROR', payload: message });
				toast.error(message);
			}
		},
		[dispatch]
	);

	const setPage = useCallback(
		(page: number) => {
			dispatch({ type: 'SET_PAGE', payload: page });
		},
		[dispatch]
	);

	return {
		loadBookings,
		refreshBookings,
		createBooking,
		deleteBooking,
		updateStatus,
		selectBooking,
		setPage,
	};
}
