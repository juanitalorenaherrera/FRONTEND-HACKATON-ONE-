import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { SitterSearchBar } from './SitterSearchBar';
import { SortDropdown } from './SortDropdown';
import { AdvancedFilters } from './AdvancedFilters';
import { useSittersStore } from '@/store/SitterStore';

export function SearchFilters() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const filters = useSittersStore((state) => state.filters);
	const updateFilter = useSittersStore((state) => state.updateFilter);
    
    // Estado local para el input de búsqueda para no actualizar el contexto en cada tecleo
    const [localSearchTerm] = useState(filters.searchTerm || '');
    const debouncedSearchTerm = useDebounce(localSearchTerm, 500); // 500ms de debounce

    // Efecto que actualiza el filtro global solo cuando el término de búsqueda "debounced" cambia.
    useEffect(() => {
        updateFilter({ searchTerm: debouncedSearchTerm });
    }, [debouncedSearchTerm, updateFilter]);

    const hasActiveFilters = !!(filters.searchTerm || filters.maxDistance || filters.minRating || filters.maxHourlyRate || filters.specialty || filters.availableOnly);

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                    <SitterSearchBar
                        placeholder="Buscar por nombre, especialidad o ubicación..."
                    />
                    </div>
                    <div className="flex items-center gap-3 justify-between md:justify-end">
                        <SortDropdown />
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="relative flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                        <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Filtros</span>
                        {hasActiveFilters && (
                        <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-orange-500" />
                        )}
                        </button>
                    </div>
                </div>
            {isModalOpen && <AdvancedFilters onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}