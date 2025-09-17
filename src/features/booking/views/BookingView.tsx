// features/booking/pages/BookingsView.tsx - NUEVO ARCHIVO

import { useEffect } from 'react';

import { BookingsOverview } from '@/features/booking/components/BookingOverview';
//import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/AuthStore';
import { useBookingsStore } from '@/store/BookingStore';

export function BookingsViewContent() {
	const loadBookings = useBookingsStore((state) => state.loadBookings);
	const isLoading = useBookingsStore((state) => state.isLoading);
	const user = useAuthStore((state) => state.profile);

    // LÓGICA DE CARGA CENTRALIZADA: Este es el lugar correcto para el useEffect.
    useEffect(() => {
        if (user?.id && isLoading) {
            loadBookings();
        }
    }, [user, isLoading, loadBookings]);


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
