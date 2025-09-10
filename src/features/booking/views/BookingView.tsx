import React from 'react';
import { BookingsProvider, useBookingsContext } from '../context/BookingContext';
import { useBookingActions } from '../hooks/useBookingActions';
// Asumimos que creas estos componentes básicos
// import { BookingList, BookingStats, BookingFilters } from '../components';

function BookingsViewContent() {
    const { state } = useBookingsContext();
    const { refetch } = useBookingActions(1, 'CLIENT'); // IDs de ejemplo

    if (state.isLoading) return <div>Cargando reservas...</div>;
    if (state.error) return <div>Error: {state.error} <button onClick={refetch}>Reintentar</button></div>;

    return (
        <div className="space-y-6">
            <h2>Mis Reservas</h2>
            {/*
            <BookingStats stats={state.stats} />
            <BookingFilters filters={state.filters} />
            <BookingList bookings={state.bookings} />
            */}
            <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
    );
}

export function BookingsView() {
    return (
        <BookingsProvider>
            <BookingsViewContent />
        </BookingsProvider>
    );
}

export default BookingsView;