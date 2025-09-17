import type { BookingDetail, BookingFilters, BookingStats, BookingSummary, PaginationState } from "@/features/booking/types";
import { BookingStatus, type PageResponse } from "./bookings";

export interface BookingsState {
	bookings: BookingSummary[];
	selectedBooking: BookingDetail | null;
	stats: BookingStats | null;
	isLoading: boolean;
	error: string | null;
	filters: BookingFilters;
	pagination: PaginationState;
	filteredBookings: BookingSummary[];
}

export interface BookingsAction {
	// Acciones o "mutations"
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	setDataSuccess: (payload: {
		page: PageResponse<BookingSummary>;
		stats: BookingStats;
	}) => void;
	setSelectedBooking: (booking: BookingDetail | null) => void;
	deleteBooking: (bookingId: number) => void;
	updateBooking: (booking: BookingSummary) => void;
	addBooking: (booking: BookingSummary) => void;
	setPage: (page: number) => void;
	// Acciones para la lógica de filtrado si se necesitara en el frontend.
	applyFilters: () => void;
}

export const initialState: BookingsState = {
	bookings: [],
	selectedBooking: null,
	stats: null,
	isLoading: true,
	error: null,
	filters: {
		status: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
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
	filteredBookings: [],
};