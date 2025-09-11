// features/pets/components/PetsFilters.tsx - Versión Refactorizada

import { useMemo, useState } from 'react';

import { PET_SPECIES_OPTIONS } from '../constants';
import type { PetFilters } from '../types';
import { Search } from 'lucide-react';
import { usePetsContext } from '../hooks/usePetsContext';

interface PetsFiltersProps {
    className?: string;
}

export function PetsFilters({ className = '' }: PetsFiltersProps) {
    // 1. LEEMOS EL ESTADO DIRECTAMENTE DEL CONTEXTO. No hay un hook `usePets`.
    const { state, dispatch } = usePetsContext();
    const { filters, pets } = state;

    // El estado local para la visibilidad de la UI es correcto, se mantiene.
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // 2. LOS HANDLERS AHORA DESPACHAN ACCIONES. Son simples y declarativos.
    const handleFilterChange = (update: Partial<PetFilters>) => {
        dispatch({ type: 'UPDATE_FILTERS', payload: update });
    };

    const handleSpeciesToggle = (species: string) => {
        const currentSpecies = filters.species || [];
        const newSpecies = currentSpecies.includes(species)
            ? currentSpecies.filter(s => s !== species)
            : [...currentSpecies, species];
        handleFilterChange({ species: newSpecies });
    };
    
    const clearAllFilters = () => {
        dispatch({ type: 'CLEAR_FILTERS' });
    };
    
    // 3. LA LÓGICA DERIVADA SE MANTIENE. Es una buena práctica.
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.species && filters.species.length > 0) count++;
        if (!filters.activeOnly) count++;
        // Añadir más condiciones si es necesario
        return count;
    }, [filters]);

    const availableSpecies = useMemo(() => {
        const petSpecies = [...new Set(pets.map(p => p.species?.toLowerCase()).filter(Boolean))];
        return PET_SPECIES_OPTIONS.filter(option => 
            petSpecies.includes(option.value)
        );
    }, [pets]);
    
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar mascotas..."
                        // 4. EL VALOR VIENE DIRECTAMENTE DEL ESTADO GLOBAL. No hay `searchValue` local.
                        value={filters.search || ''}
                        onChange={(e) => handleFilterChange({ search: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                
                {/* Filter Toggle */}
                <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-xl...`}
                >
                    {/* ... Contenido del botón sin cambios ... */}
                </button>
            </div>
            
            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Filtros Avanzados</h4>
                        <button onClick={clearAllFilters} className="text-sm text-orange-600 hover:underline">
                            Limpiar todo
                        </button>
                    </div>
                    
                    {/* Species Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Especies</label>
                        <div className="flex flex-wrap gap-2">
                            {availableSpecies.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSpeciesToggle(option.value)}
                                    className={`... ${filters.species?.includes(option.value) ? 'bg-orange-100' : 'bg-white'}`}
                                >
                                    {/* ... Contenido del botón de especie ... */}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Status and Sort Filters ... */}
                    {/* Se refactorizarían de manera similar, llamando a `handleFilterChange` */}
                </div>
            )}
        </div>
    );
}