// features/pets/components/PetsOverview.tsx

import { PetsEmptyState, PetsErrorState, PetsLoadingState } from './states';
import { useMemo, useState } from 'react';

import { PetsFilters } from './PetsFilters';
import { PetsGrid } from './PetsGrid';
import { PetsHeader } from './PetsHeader';
import { useAuthStore } from '../../../store/AuthStore';
import { usePetsActions } from '../hooks/usePetsActions';

export function PetsOverview({ className = '' }: { className?: string }) {
    const { 
        pets, 
        isLoading, 
        error, 
        refreshPets 
    } = usePetsActions();
    
    const user = useAuthStore((state) => state.profile);
    
    // Estado local para filtros (anteriormente en PetStore)
    const [filters, setFilters] = useState({
        species: '',
        active: 'all', // 'all' | 'active' | 'inactive'
        search: ''
    });

    // Lógica de filtrado movida al componente (anteriormente en PetStore)
    const filteredPets = useMemo(() => {
        return pets.filter(pet => {
            // Filtro por especie
            if (filters.species && pet.species !== filters.species) {
                return false;
            }
            
            // Filtro por estado activo/inactivo
            if (filters.active !== 'all') {
                const isActive = filters.active === 'active';
                if (pet.active !== isActive) {
                    return false;
                }
            }
            
            // Filtro por búsqueda (nombre o raza)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesName = pet.name.toLowerCase().includes(searchLower);
                const matchesBreed = pet.breed?.toLowerCase().includes(searchLower);
                if (!matchesName && !matchesBreed) {
                    return false;
                }
            }
            
            return true;
        });
    }, [pets, filters]);

    const handleRetry = () => {
        // Usamos el 'user' del AuthContext para obtener el accountId
        if (user?.id) {
            refreshPets(user.id);
        }
    };

    const renderContent = () => {
        console.log("Renderizando con mascotas:", pets.length, "filtradas:", filteredPets.length);
        
        if (isLoading && pets.length === 0) {
            return <PetsLoadingState />;
        }
        if (error) {
            return <PetsErrorState error={error} onRetry={handleRetry} />;
        }
        if (pets.length === 0) {
            return <PetsEmptyState />;
        }
        return (
            <>
                <PetsFilters 
                    filters={filters}
                    onFiltersChange={setFilters}
                    availableSpecies={[...new Set(pets.map(pet => pet.species).filter(Boolean))]}
                />
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
            <PetsHeader />
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
}