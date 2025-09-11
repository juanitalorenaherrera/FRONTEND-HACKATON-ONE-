// features/pets/pages/PetsView.tsx - VERSIÓN FINAL Y CORRECTA

import React, { useEffect } from 'react';

import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Outlet } from 'react-router-dom'; // Asegúrate de que Outlet esté importado
import { PetsProvider } from '../context/PetsContext';
import { useAuth } from '../../../context/AuthContext';
import { usePetsActions } from '../hooks/usePetsActions';
import { usePetsContext } from '../hooks/usePetsContext';

function PetsViewContent() {
    const { state: petsState } = usePetsContext();
    const { loadPets } = usePetsActions();
    const { user, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        if (user?.accountId && petsState.isLoading) {
            loadPets(user.accountId);
        }
    }, [user, petsState.isLoading, loadPets]);

    if (isAuthLoading) {
        return <div className="..."><LoadingSpinner title="Verificando sesión..." /></div>;
    }

    if (!user) {
        return <div className="...">Por favor, inicia sesión para ver tus mascotas.</div>;
    }
    
    // El renderizado ahora es simple. Solo contiene el layout y el Outlet.
    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Mascotas</h1>
                <p className="text-gray-600">Gestiona la información y cuidado de tus compañeros peludos.</p>
            </header>
            <main>
                {/* El router se encarga de poner PetsOverview o PetProfile aquí */}
                <Outlet />
            </main>
        </div>
    );
}

export function PetsView() {
    return (
        <PetsProvider>
            <PetsViewContent />
        </PetsProvider>
    );
}