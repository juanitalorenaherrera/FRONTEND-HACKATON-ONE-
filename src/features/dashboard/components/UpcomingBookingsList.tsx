import { Calendar, Clock } from 'lucide-react';

import { BookingInfo } from '../../../features/dashboard/types'; // Usaremos tipos específicos
import { motion } from 'framer-motion';

interface UpcomingBookingsListProps {
  bookings: BookingInfo[];
}

export const UpcomingBookingsList = ({ bookings }: UpcomingBookingsListProps) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-neutral-500">No tienes próximas reservas. ¡Es un buen momento para planificar una!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.slice(0, 3).map((booking, index) => ( // Mostramos solo las 3 más próximas
        <motion.div
          key={booking.id}
          className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-pet-teal/10 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="p-3 bg-pet-teal text-white rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="font-bold text-neutral-800">Cita con {booking.sitterName}</p>
            <p className="text-sm text-neutral-600 flex items-center gap-2">
              <Clock size={14} /> {new Date(booking.startDate).toLocaleString()}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};