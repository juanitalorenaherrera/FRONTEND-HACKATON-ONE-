// src/layouts/DashboardLayout.tsx - VERSIÓN FINAL Y ÚNICA

import { Outlet, useLocation } from 'react-router-dom';

import { ClientSidebar } from '../features/dashboard/components/DashboardSidebar';
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';
import { PetsProvider } from '../features/pets/context/PetsContext';
import React from 'react';

// Importa TODOS los providers que necesitarán los componentes de este layout

// import { BookingsProvider } from '../features/booking/context/BookingContext'; // Ejemplo

export function DashboardLayout() {
    const location = useLocation();

    // Lógica para determinar el ítem activo del sidebar
    const getActiveItem = () => {
        const pathSegments = location.pathname.split('/');
        const activeView = pathSegments[2] || 'dashboard';
        
        switch (activeView) {
            case 'pets': return 'pets';
            case 'find-sitters': return 'findSitters';
            case 'bookings': return 'appointments';
            default: return 'dashboard';
        }
    };

    return (
        // Envolvemos todo en los providers necesarios.
        // El orden no suele importar a menos que un provider dependa de otro.
        <PetsProvider>
        {/* <BookingsProvider> */}
            <div className="flex h-screen bg-gray-50">
                <ClientSidebar activeItem={getActiveItem()} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <DashboardHeader />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        {/* </BookingsProvider> */}
        </PetsProvider>
    );
}