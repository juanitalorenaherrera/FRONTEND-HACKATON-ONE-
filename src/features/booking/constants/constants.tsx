// ===========================================
// features/booking/constants/index.ts - Configuración Centralizada
// ===========================================

import { BookingStatus } from '@/features/booking/types/bookingTypes';
import type {
	BookingsState,
	BookingStats,
	BookingSummary,
} from '@/features/booking/types/bookingTypes';
import { useBookingContext } from '@/features/booking/hooks/useBookingContext';
import { useAuthStore } from '@/store/AuthStore';
import { useCallback } from 'react';
import { getBookingsByUser } from '@/services/bookingService';

export const BOOKING_CONFIG = {
	CACHE_DURATION: 3 * 60 * 1000, // 3 minutes (más frecuente que pets)
	DEFAULT_PAGE_SIZE: 15,
	MAX_PAGE_SIZE: 100,
	OPTIMISTIC_UPDATE_TIMEOUT: 10000, // 10 seconds
	RETRY_ATTEMPTS: 3,
	DEBOUNCE_SEARCH_MS: 500,
	AUTO_REFRESH_INTERVAL: 60000, // 1 minute for critical bookings
} as const;

export const BOOKING_STATUS_CONFIG = {
	[BookingStatus.PENDING]: {
		label: 'Pendiente',
		color: 'yellow',
		bgColor: 'bg-yellow-50',
		textColor: 'text-yellow-700',
		borderColor: 'border-yellow-200',
		canCancel: true,
		canEdit: true,
	},
	[BookingStatus.CONFIRMED]: {
		label: 'Confirmada',
		color: 'blue',
		bgColor: 'bg-blue-50',
		textColor: 'text-blue-700',
		borderColor: 'border-blue-200',
		canCancel: true,
		canEdit: false,
	},
	[BookingStatus.IN_PROGRESS]: {
		label: 'En Progreso',
		color: 'green',
		bgColor: 'bg-green-50',
		textColor: 'text-green-700',
		borderColor: 'border-green-200',
		canCancel: false,
		canEdit: false,
	},
	[BookingStatus.COMPLETED]: {
		label: 'Completada',
		color: 'gray',
		bgColor: 'bg-gray-50',
		textColor: 'text-gray-700',
		borderColor: 'border-gray-200',
		canCancel: false,
		canEdit: false,
	},
	[BookingStatus.CANCELLED]: {
		label: 'Cancelada',
		color: 'red',
		bgColor: 'bg-red-50',
		textColor: 'text-red-700',
		borderColor: 'border-red-200',
		canCancel: false,
		canEdit: false,
	},
} as const;

export const BOOKING_ACTIONS = {
	VIEW: 'view',
	EDIT: 'edit',
	CANCEL: 'cancel',
	CONFIRM: 'confirm',
	START: 'start',
	COMPLETE: 'complete',
	CONTACT_SITTER: 'contact_sitter',
	RESCHEDULE: 'reschedule',
} as const;

export default function useBookingActions() {
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
				page: (state as BookingsState).pagination.currentPage - 1,
				size: (state as BookingsState).pagination.pageSize,
				// ...otros filtros de state.filters
			};
			const bookingsPage = await getBookingsByUser(
				user.id,
				user.role,
				filters
			);

			// La lógica para calcular stats es un buen candidato para un utilitario
			const stats: BookingStats = bookingsPage.content.reduce(
				(acc: BookingStats, booking: BookingSummary) => {
					acc.totalCount++;
					switch (booking.status) {
						case BookingStatus.PENDING:
							acc.pendingCount++;
							break;
						case BookingStatus.CONFIRMED:
							acc.confirmedCount++;
							break;
						case BookingStatus.IN_PROGRESS:
							acc.inProgressCount++;
							break;
						case BookingStatus.COMPLETED:
							acc.upcomingCount++;
							break;
						case BookingStatus.CANCELLED:
							break;
					}
					return acc;
				},
				{
					totalCount: 0,
					pendingCount: 0,
					confirmedCount: 0,
					inProgressCount: 0,
					upcomingCount: 0,
				}
			);

			dispatch({
				type: 'SET_DATA_SUCCESS',
				payload: { page: bookingsPage, stats },
			});
		} catch (error) {
			// ...
			console.log(error);
		}
	}, [user, dispatch, state]);

	console.log(loadBookings);
}
