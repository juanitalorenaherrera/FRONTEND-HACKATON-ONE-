import { create } from "zustand";
import {
	type BookingSummary,
	type BookingStats,
	type PageResponse,
	BookingStatus,
	type CreateBookingRequest,
} from '@/features/booking/types';
import { type BookingsState, type BookingsAction, initialState } from "@/types/bookingStore";
import * as bookingService from '@/services/bookingService';
import { useAuthStore } from '@/store/AuthStore';
import type { Role } from '@/types/authStore';
import { BOOKING_CONFIG } from '@/features/booking/constants/config';
import { filterAndSortBookings, shouldRefreshCache } from '@/features/booking/utils/bookingUtils';

interface BookingActionOptions {
	skipCache?: boolean;
	silent?: boolean;
	optimistic?: boolean;
}


export const useBookingsStore = create<BookingsState & BookingsAction>((set, get) => ({
	...initialState,

	// Acciones que modifican el estado
	setLoading: (isLoading: boolean) => set({ isLoading, error: null }),
	setError: (error: string | null) => set({ error, isLoading: false }),
	setDataSuccess: (payload: { page: PageResponse<BookingSummary>; stats: BookingStats }) => {
		set((state) => ({
			isLoading: false,
			bookings: payload.page.content,
			stats: payload.stats,
			pagination: {
				...state.pagination,
				currentPage: payload.page.number + 1,
				totalPages: payload.page.totalPages,
				totalElements: payload.page.totalElements,
				hasNext: !payload.page.last,
			},
		}));
		get().applyFilters(); // Se llama a la lógica de filtrado después de actualizar los datos
	},
	setSelectedBooking: (selectedBooking) => set({ selectedBooking }),
	deleteBooking: (bookingId: number) => {
		set((state) => {
			const newBookings = state.bookings.filter(
				(b) => b.id !== bookingId
			);
			return {
				bookings: newBookings,
				stats: state.stats
					? { ...state.stats, totalCount: state.stats.totalCount - 1 }
					: null,
			};
		});
		get().applyFilters();
	},
	updateBooking: (updatedBooking) => {
		set((state) => ({
			bookings: state.bookings.map((b) =>
				b.id === updatedBooking.id ? updatedBooking : b
			),
		}));
		get().applyFilters();
	},
	addBooking: (newBooking) => {
		set((state) => ({
			bookings: [newBooking, ...state.bookings],
		}));
		get().applyFilters();
	},
	setPage: (page) => {
		set((state) => ({
			pagination: { ...state.pagination, currentPage: page },
		}));
		get().applyFilters();
	},

	// Lógica de filtrado usando la función importada
	applyFilters: () => {
		const { bookings, filters } = get();
		const filtered = filterAndSortBookings(bookings, filters);
		set({ filteredBookings: filtered });
	},

	// Estado adicional para funcionalidades avanzadas
	lastFetch: null as Date | null,
	optimisticTimeouts: new Map<number, NodeJS.Timeout>(),
	autoRefreshInterval: null as NodeJS.Timeout | null,

	// Funciones avanzadas migradas desde UseBooking.ts
	loadBookings: async (options: BookingActionOptions = {}) => {
		const { skipCache = false, silent = false } = options;
		const user = useAuthStore.getState().profile;
		if (!user) {
			get().setError('Usuario no autenticado.');
			return;
		}

		// Cache management
		const { lastFetch, bookings } = get();
		if (!skipCache && !shouldRefreshCache(lastFetch?.getTime() || null, BOOKING_CONFIG.CACHE_DURATION) && bookings.length > 0) {
			return;
		}

		if (!silent) {
			get().setLoading(true);
		}

		try {
			const { pagination } = get();
			const filters = {
				page: pagination.currentPage - 1,
				size: pagination.pageSize,
			};
			const bookingsPage = await bookingService.getBookingsByUser(user.id, user.role as Role, filters);
			const stats = {
				totalCount: bookingsPage.totalElements,
				pendingCount: 0,
				confirmedCount: 0,
				inProgressCount: 0,
				upcomingCount: 0
			};
			get().setDataSuccess({ page: bookingsPage, stats });
			set({ lastFetch: new Date() });
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Error desconocido';
			get().setError(message);
		}
	},

	refreshBookings: async (accountId: number) => {
		const user = useAuthStore.getState().profile;
		if (!user) {
			get().setError('Usuario no autenticado.');
			return;
		}

		get().setLoading(true);
		try {
			const { pagination } = get();
			const filters = {
				page: pagination.currentPage - 1,
				size: pagination.pageSize,
			};
			const bookingsPage = await bookingService.getBookingsByUser(accountId, user.role as Role, filters);
			const stats = {
				totalCount: 0,
				pendingCount: 0,
				confirmedCount: 0,
				inProgressCount: 0,
				upcomingCount: 0
			};
			get().setDataSuccess({ page: bookingsPage, stats });
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Error desconocido';
			get().setError(message);
		}
	},

	createBooking: async (bookingData: CreateBookingRequest, options: BookingActionOptions = {}) => {
		const { optimistic = true } = options;
		let tempBooking: BookingSummary | null = null;

		if (optimistic) {
			// Optimistic update
			tempBooking = {
				id: Date.now(),
				petName: 'Cargando...',
				sitterName: 'Cargando...',
				startTime: bookingData.startTime,
				status: BookingStatus.PENDING,
				totalPrice: 0,
			};
			get().addBooking(tempBooking);
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
				get().deleteBooking(tempBooking.id);
			}

			const bookingSummary: BookingSummary = {
				id: newBooking.id,
				petName: newBooking.petName,
				sitterName: newBooking.sitterName,
				startTime: newBooking.startTime,
				status: newBooking.status,
				totalPrice: newBooking.totalPrice,
			};
			get().addBooking(bookingSummary);
			return newBooking;
		} catch (error) {
			if (optimistic && tempBooking) {
				get().deleteBooking(tempBooking.id);
			}
			const message = error instanceof Error ? error.message : 'Error al crear reserva';
			get().setError(message);
			throw error;
		}
	},

	deleteBookingById: async (bookingId: number, options: BookingActionOptions = {}) => {
		const { optimistic = true } = options;
		const { bookings } = get();
		const bookingToDelete = bookings.find(b => b.id === bookingId);
		
		if (!bookingToDelete) {
			throw new Error('Reserva no encontrada');
		}

		if (optimistic) {
			get().deleteBooking(bookingId);
		}

		try {
			await bookingService.deleteBooking(bookingId);
			if (!optimistic) {
				get().deleteBooking(bookingId);
			}
		} catch (error) {
			if (optimistic) {
				get().addBooking(bookingToDelete);
			}
			const message = error instanceof Error ? error.message : 'Error al eliminar reserva';
			get().setError(message);
			throw error;
		}
	},

	updateStatus: async (bookingId: number, newStatus: BookingStatus, reason?: string, options: BookingActionOptions = {}) => {
		const { optimistic = true } = options;
		const { bookings, optimisticTimeouts } = get();
		const originalBooking = bookings.find(b => b.id === bookingId);
		
		if (!originalBooking) {
			throw new Error('Reserva no encontrada');
		}

		let timeoutId: NodeJS.Timeout | null = null;

		if (optimistic) {
			const updatedBooking: BookingSummary = {
				...originalBooking,
				status: newStatus,
			};
			get().updateBooking(updatedBooking);

			// Timeout para rollback
			timeoutId = setTimeout(() => {
				get().updateBooking(originalBooking);
				get().setError('Timeout al actualizar estado');
			}, BOOKING_CONFIG.OPTIMISTIC_UPDATE_TIMEOUT);

			optimisticTimeouts.set(bookingId, timeoutId);
		}

		try {
			const updatedBookingDetail = await bookingService.updateBookingStatus(bookingId, newStatus, reason);
			
			if (timeoutId) {
				clearTimeout(timeoutId);
				optimisticTimeouts.delete(bookingId);
			}

			const updatedBookingSummary: BookingSummary = {
				id: updatedBookingDetail.id,
				petName: updatedBookingDetail.petName,
				sitterName: updatedBookingDetail.sitterName,
				startTime: updatedBookingDetail.startTime,
				status: updatedBookingDetail.status,
				totalPrice: updatedBookingDetail.totalPrice,
			};
			get().updateBooking(updatedBookingSummary);
			return updatedBookingDetail;
		} catch (error) {
			if (timeoutId) {
				clearTimeout(timeoutId);
				optimisticTimeouts.delete(bookingId);
			}
			if (optimistic) {
				get().updateBooking(originalBooking);
			}
			const message = error instanceof Error ? error.message : 'Error al actualizar estado';
			get().setError(message);
			throw error;
		}
	},

	selectBooking: async (bookingId: number | null) => {
		if (bookingId === null) {
			get().setSelectedBooking(null);
			return;
		}
		try {
			const bookingDetail = await bookingService.getBookingById(bookingId);
			get().setSelectedBooking(bookingDetail);
			return bookingDetail;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Error al cargar detalles';
			get().setError(message);
			throw error;
		}
	},

	// Auto-refresh functionality
	startAutoRefresh: () => {
		const interval = setInterval(() => {
			if (!document.hidden) {
				get().loadBookings({ silent: true });
			}
		}, BOOKING_CONFIG.AUTO_REFRESH_INTERVAL);
		set({ autoRefreshInterval: interval });
	},

	stopAutoRefresh: () => {
		const { autoRefreshInterval } = get();
		if (autoRefreshInterval) {
			clearInterval(autoRefreshInterval);
			set({ autoRefreshInterval: null });
		}
	},

	// Utility functions
	clearError: () => set({ error: null }),

	resetState: () => {
		const { optimisticTimeouts, autoRefreshInterval } = get();
		
		// Clear timeouts
		optimisticTimeouts.forEach(timeout => clearTimeout(timeout));
		optimisticTimeouts.clear();
		
		// Clear auto-refresh
		if (autoRefreshInterval) {
			clearInterval(autoRefreshInterval);
		}
		
		set({ ...initialState, optimisticTimeouts: new Map(), autoRefreshInterval: null, lastFetch: null });
	},

	cleanup: () => {
		const { optimisticTimeouts, autoRefreshInterval } = get();
		
		optimisticTimeouts.forEach(timeout => clearTimeout(timeout));
		optimisticTimeouts.clear();
		
		if (autoRefreshInterval) {
			clearInterval(autoRefreshInterval);
		}
	},

	// Computed getters
	getPendingBookings: () => {
		const { filteredBookings } = get();
		return filteredBookings.filter(b => b.status === BookingStatus.PENDING);
	},

	getUpcomingBookings: () => {
		const { filteredBookings } = get();
		return filteredBookings.filter(b => {
			const bookingDate = new Date(b.startTime);
			return bookingDate > new Date() && b.status !== BookingStatus.CANCELLED;
		});
	},

	getTotalBookings: () => {
		const { pagination } = get();
		return pagination.totalElements;
	},

	getHasNextPage: () => {
		const { pagination } = get();
		return pagination.hasNext;
	},

	getHasPreviousPage: () => {
		const { pagination } = get();
		return pagination.currentPage > 1;
	},

	getShouldRefresh: () => {
		const { lastFetch } = get();
		return shouldRefreshCache(lastFetch?.getTime() || null, BOOKING_CONFIG.CACHE_DURATION);
	},
}));