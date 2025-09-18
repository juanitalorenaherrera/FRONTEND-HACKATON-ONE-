// features/booking/components/BookingsOverview.tsx - VERSIÓN CORREGIDA

import { BookingsEmptyState } from '../components/states/BookingEmptyState';
import { BookingsErrorState } from '../components/states/BookingErrorState';
import { BookingsList } from './BookingList';
import { BookingsLoadingState } from '../components/states/BookingsLoadingState';
import { useAuthStore } from '../../../store/AuthStore';
import { useBookingActions } from '../hooks/useBookingActions'; // <-- Obtiene las acciones
import { useBookingContext } from '../hooks/useBookingContext'; // <-- Obtiene el estado

export function BookingsOverview() {
    // SEPARACIÓN CORRECTA: El estado y las acciones vienen de hooks diferentes.
    const { state } = useBookingContext();
    const { refreshBookings } = useBookingActions(); // Usamos refresh para el botón de reintento
   	const user = useAuthStore((state) => state.profile); // Obtener el usuario autenticado

    // EL useEffect PARA CARGAR DATOS SE HA ELIMINADO DE AQUÍ.
    
    const handleRetry = () => {
        if (user?.id) {
            refreshBookings();


        }
    };

    const renderContent = () => {
        if (state.isLoading && state.bookings.length === 0) {
            return <BookingsLoadingState />;
        }
        if (state.error) {
            return <BookingsErrorState error={state.error} onRetry={handleRetry} />;
        }
        if (state.bookings.length === 0) {
            return <BookingsEmptyState />;
        }
        return <BookingsList bookings={state.bookings} />;
    };

    return <div className="space-y-6">{renderContent()}</div>;
}