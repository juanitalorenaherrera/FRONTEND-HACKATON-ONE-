// features/booking/components/BookingCard.tsx

import { Calendar, Dog, User } from 'lucide-react';

import { BOOKING_STATUS_CONFIG } from '@/features/booking/constants/constants'; // Asumiendo que creas este archivo
import type { BookingSummary } from '../types/bookingTypes';

// import { formatBookingDateTime } from '../utils/bookingUtils'; // Asumiendo que creas este archivo

// Helper simple para formatear fecha (puedes moverlo a utils)
const formatDateTime = (iso: string) =>
	new Date(iso).toLocaleString('es-ES', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

export function BookingCard({ booking }: { booking: BookingSummary }) {
	const statusConfig = BOOKING_STATUS_CONFIG[booking.status];

	return (
		<div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
			<div className="flex justify-between items-center mb-3">
				<h3 className="font-bold text-lg text-gray-800">
					Cita de Cuidado
				</h3>
				<span
					className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
				>
					{statusConfig.label}
				</span>
			</div>

			<div className="space-y-3 text-sm text-gray-600">
				<div className="flex items-center gap-2">
					<Dog className="w-4 h-4 text-orange-500" />
					<span className="font-medium text-gray-800">
						{booking.petName}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<User className="w-4 h-4 text-teal-500" />
					<span>{booking.sitterName}</span>
				</div>
				<div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
					<Calendar className="w-4 h-4 text-gray-400" />
					<span>{formatDateTime(booking.startTime)}</span>
				</div>
			</div>
			<div className="text-right mt-4">
				<p className="text-xl font-bold text-gray-800">
					${booking.totalPrice.toFixed(2)}
				</p>
			</div>
		</div>
	);
}
