// features/booking/hooks/useBookingContext.ts

import { BookingContext, BookingContextValue } from '../context/BookingContext';

import { useContext } from 'react';

// Importa el CONTEXTO y el TIPO del valor desde el archivo del provider


/**
 * Hook personalizado para consumir el contexto de reservas.
 * Provee una forma segura y centralizada para que los componentes accedan al estado de las reservas.
 */
export function useBookingContext() {
    const context = useContext(BookingContext);

    // Esta validación es crucial para detectar errores de implementación tempranamente.
    if (context === undefined) {
        throw new Error('useBookingContext must be used within a BookingsProvider');
    }

    return context;
}