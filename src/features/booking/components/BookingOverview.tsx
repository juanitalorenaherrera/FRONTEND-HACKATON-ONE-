// features/booking/components/BookingsOverview.tsx - VERSIÓN CORREGIDA

import { BookingsEmptyState } from '@/features/booking/components/states/BookingEmptyState';
import { BookingsErrorState } from '@/features/booking/components/states/BookingErrorState';
import { BookingsList } from './BookingList';
import { BookingsLoadingState } from '@/features/booking/components/states/BookingsLoadingState';
import { useAuthStore } from '@/store/AuthStore';
import { useBookingsStore } from '@/store/BookingStore';

export function BookingsOverview() {
    // SEPARACIÓN CORRECTA: El estado y las acciones vienen de la store de Zustand.
	const isLoading = useBookingsStore((state) => state.isLoading)
	const error = useBookingsStore((state) => state.error)
	const bookings = useBookingsStore((state) => state.bookings)
    const refreshBookings = useBookingsStore((state) => state.refreshBookings); // Usamos refresh para el botón de reintento
   	const user = useAuthStore((state) => state.profile); // Obtener el usuario autenticado

    // EL useEffect PARA CARGAR DATOS SE HA ELIMINADO DE AQUÍ.
    
    const handleRetry = () => {
        if (user?.id) {
            refreshBookings(user.id);
        }
    };

    const renderContent = () => {
        if (isLoading && bookings.length === 0) {
            return <BookingsLoadingState />;
        }
        if (error) {
            return <BookingsErrorState error={error} onRetry={handleRetry} />;
        }
        if (bookings.length === 0) {
            return <BookingsEmptyState />;
        }
        return <BookingsList bookings={bookings} />;
    };

    return <div className="space-y-6">{renderContent()}</div>;
}