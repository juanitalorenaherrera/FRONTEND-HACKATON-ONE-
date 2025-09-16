// features/booking/components/BookingsList.tsx

import { BookingCard } from './BookingCard';
import type { BookingSummary } from '../types';

interface BookingsListProps {
	bookings: BookingSummary[];
}

export function BookingsList({ bookings }: BookingsListProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{bookings.map((booking) => (
				<BookingCard key={booking.id} booking={booking} />
			))}
		</div>
	);
}
