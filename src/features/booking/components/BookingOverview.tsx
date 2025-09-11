// features/booking/components/BookingsOverview.tsx - VERSIÓN CORREGIDA

import { BookingsEmptyState } from '../components/states/BookingEmptyState';
import { BookingsErrorState } from '../components/states/BookingErrorState';
import { BookingsList } from './BookingList';
import { BookingsLoadingState } from '../components/states/BookingsLoadingState';
import React from 'react';
import { useAuth } from '../../../context/AuthContext'; // <-- Necesario para el reintento
import { useBookingActions } from '../hooks/useBookingActions'; // <-- Obtiene las acciones
import { useBookingContext } from '../hooks/useBookingContext'; // <-- Obtiene el estado

export function BookingsOverview() {
    // SEPARACIÓN CORRECTA: El estado y las acciones vienen de hooks diferentes.
    const { state } = useBookingContext();
    const { refreshBookings } = useBookingActions(); // Usamos refresh para el botón de reintento
    const { user } = useAuth();

    // EL useEffect PARA CARGAR DATOS SE HA ELIMINADO DE AQUÍ.
    
    const handleRetry = () => {
        if (user?.accountId) {
            refreshBookings(user.accountId);
        }
    };

    const renderContent = () => {
        if (state.isLoading && state.bookings.length === 0) {
            return <BookingsLoadingState />;
        }
        if (state.error) {
            return <BookingsErrorState message={state.error} onRetry={handleRetry} />;
        }
        if (state.bookings.length === 0) {
            return <BookingsEmptyState />;
        }
        return <BookingsList bookings={state.bookings} />;
    };

    return <div className="space-y-6">{renderContent()}</div>;
}