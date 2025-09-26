import { BookingCard } from '../components/BookingCard';
import type { BookingsListProps } from '../types/booking';

export function BookingsList({ bookings }: BookingsListProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{bookings.map((booking) => (
				<BookingCard key={booking.id} booking={booking} />
			))}
		</div>
	);
}
