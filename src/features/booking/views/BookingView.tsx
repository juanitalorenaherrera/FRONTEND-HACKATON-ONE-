// features/booking/pages/BookingsView.tsx - NUEVO ARCHIVO

import React, { useEffect } from 'react';

import { BookingsOverview } from '../components/BookingOverview';
import { BookingsProvider } from '../context/BookingContext';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useAuth } from '../../../context/AuthContext';
import { useBookingActions } from '../hooks/useBookingActions';
import { useBookingContext } from '../hooks/useBookingContext';

function BookingsViewContent() {
    const { state: bookingsState } = useBookingContext();
    const { loadBookings } = useBookingActions();
    const { user, isLoading: isAuthLoading } = useAuth();

    // LÓGICA DE CARGA CENTRALIZADA: Este es el lugar correcto para el useEffect.
    useEffect(() => {
        if (user?.accountId && bookingsState.isLoading) {
            loadBookings(user.accountId);
        }
    }, [user, bookingsState.isLoading, loadBookings]);

    if (isAuthLoading) {
        return <div className="..."><LoadingSpinner title="Verificando sesión..." /></div>;
    }
    if (!user) {
        return <div className="...">Por favor, inicia sesión para ver tus citas.</div>;
    }

    return (
        <div className="container mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
                <p className="text-gray-600">Aquí puedes ver y gestionar todas tus reservas.</p>
            </header>
            <main>
                <BookingsOverview />
            </main>
        </div>
    );
}

// El componente exportado que envuelve todo en su Provider.
export function BookingsView() {
    return (
        <BookingsProvider>
            <BookingsViewContent />
        </BookingsProvider>
    );
}