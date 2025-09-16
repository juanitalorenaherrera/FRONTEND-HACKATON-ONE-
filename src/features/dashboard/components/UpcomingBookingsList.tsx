import { Calendar, Clock, MapPin } from 'lucide-react';

import { BookingSummaryResponse } from '../../../types/api_types';
import { motion } from 'framer-motion';

interface UpcomingAppointmentsProps {
  bookings?: BookingSummaryResponse[];
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ bookings = [] }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-bold text-neutral-800 mb-4">Próximas Citas</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80">
        {bookings.length > 0 ? (
          <ul className="divide-y divide-neutral-200">
            {bookings.map((booking) => (
              <li key={booking.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={booking.sitterImageUrl ?? 'https://via.placeholder.com/48'} alt={booking.sitterName} className="w-12 h-12 rounded-full object-cover"/>
                  <div>
                    <p className="font-bold text-neutral-800">{booking.serviceType}</p>
                    <p className="text-sm text-neutral-500">con {booking.sitterName}</p>
                  </div>
                </div>
                <div className="text-sm text-neutral-600 flex flex-col sm:items-end gap-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pet-teal" />
                    <span>{new Date(booking.bookingDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pet-teal" />
                    <span>{new Date(booking.bookingDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-500">🐾 No tienes citas programadas próximamente.</p>
            <button className="mt-4 px-4 py-2 text-sm font-semibold bg-pet-orange text-white rounded-lg hover:bg-pet-orange/90 transition-colors">
              Buscar un cuidador
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
};