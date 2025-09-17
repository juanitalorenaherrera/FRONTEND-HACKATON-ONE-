import { create } from "zustand";
import type {
	BookingSummary,
	BookingStats,
	PageResponse,
} from '@/features/booking/types';
import { type BookingsState, type BookingsAction, initialState } from "@/types/bookingStore";


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

	// Lógica de filtrado (si se necesita en el frontend)
	applyFilters: () => {
		const { bookings, filters } = get();
		
		const filtered = bookings.filter(booking => 
			filters.status?.includes(booking.status) ?? true
		);
		
		// Aplicar ordenamiento
		filtered.sort((a, b) => {
			const aValue = a[filters.sortBy as keyof BookingSummary];
			const bValue = b[filters.sortBy as keyof BookingSummary];
			
			if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
			if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
			return 0;
		});
		
		set({ filteredBookings: filtered });
	},
}));