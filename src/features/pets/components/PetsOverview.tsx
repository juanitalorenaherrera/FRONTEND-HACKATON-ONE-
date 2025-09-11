// features/pets/components/PetsOverview.tsx

import { PetsEmptyState, PetsErrorState, PetsLoadingState } from './states';

import { PetsFilters } from './PetsFilters';
import { PetsGrid } from './PetsGrid';
import { PetsHeader } from './PetsHeader';
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useMemo } from 'react';
import { usePetsActions } from '../hooks/usePetsActions';
import { usePetsContext } from '../hooks/usePetsContext';

export function PetsOverview({ className = '' }: { className?: string }) {
    const { state, filteredPets } = usePetsContext();
    const { refreshPets } = usePetsActions();
    const { user } = useAuth();

    const handleRetry = () => {
        // Usamos el 'user' del AuthContext para obtener el accountId
        if (user?.accountId) {
            refreshPets(user.accountId);
        }
    };
    
    // He movido el cálculo de los totales aquí usando useMemo para que PetsHeader sea más "tonto"
    const totalActivePets = useMemo(() => state.pets.filter(p => p.active).length, [state.pets]);

    const renderContent = () => {

        console.log("Renderizando con el estado:", state);
        if (state.isLoading && state.pets.length === 0) {
            return <PetsLoadingState />;
        }
        if (state.error) {
            return <PetsErrorState error={state.error} onRetry={handleRetry} />;
        }
        if (state.pets.length === 0) {
            return <PetsEmptyState />;
        }
        return (
            <>
                <PetsFilters />
                {filteredPets.length > 0 ? (
                    <PetsGrid pets={filteredPets} />
                ) : (
                    <div className="text-center py-12 text-gray-600">
                        <p>Ninguna mascota coincide con los filtros aplicados.</p>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
            <PetsHeader totalActivePets={totalActivePets} />
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
}