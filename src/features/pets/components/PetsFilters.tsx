// features/pets/components/PetsFilters.tsx - Versión Refactorizada

import { Filter, Search, X } from 'lucide-react';

import { useState } from 'react';

interface PetsFiltersProps {
    className?: string;
    filters: {
        species: string;
        active: 'all' | 'active' | 'inactive';
        search: string;
    };
    onFiltersChange: (filters: any) => void;
    availableSpecies: string[];
}

export function PetsFilters({ 
    className = '', 
    filters, 
    onFiltersChange,
    availableSpecies 
}: PetsFiltersProps) {
    // Estado local solo para la visibilidad de la UI
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Handlers que actualizan los filtros en el componente padre
    const handleFilterChange = (update: Partial<typeof filters>) => {
        onFiltersChange({ ...filters, ...update });
    };

    const handleSpeciesChange = (species: string) => {
        handleFilterChange({ species });
    };
    
    const clearAllFilters = () => {
        onFiltersChange({
            species: '',
            active: 'all',
            search: ''
        });
    };

    // Verificar si hay filtros activos
    const hasActiveFilters = filters.species || filters.active !== 'all' || filters.search;
    
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o raza..."
                        value={filters.search || ''}
                        onChange={(e) => handleFilterChange({ search: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                    {filters.search && (
                        <button
                            onClick={() => handleFilterChange({ search: '' })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                
                {/* Filter Toggle */}
                <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all duration-200 ${
                        showAdvancedFilters || hasActiveFilters
                            ? 'bg-orange-50 border-orange-200 text-orange-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filtros</span>
                    {hasActiveFilters && (
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    )}
                </button>
            </div>
            
            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Filtros Avanzados</h4>
                        {hasActiveFilters && (
                            <button 
                                onClick={clearAllFilters} 
                                className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                            >
                                Limpiar todo
                            </button>
                        )}
                    </div>
                    
                    {/* Species Filter */}
                    {availableSpecies.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Especie
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleSpeciesChange('')}
                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                        !filters.species
                                            ? 'bg-orange-100 border-orange-300 text-orange-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Todas
                                </button>
                                {availableSpecies.map((species) => (
                                    <button
                                        key={species}
                                        onClick={() => handleSpeciesChange(species)}
                                        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors capitalize ${
                                            filters.species === species
                                                ? 'bg-orange-100 border-orange-300 text-orange-700'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {species}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: 'all', label: 'Todas' },
                                { value: 'active', label: 'Activas' },
                                { value: 'inactive', label: 'Inactivas' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleFilterChange({ active: option.value as any })}
                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                        filters.active === option.value
                                            ? 'bg-orange-100 border-orange-300 text-orange-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}