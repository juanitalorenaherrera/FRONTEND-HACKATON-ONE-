import { useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { ExtendedSitter, SitterFilters } from '@/features/sitters/types';
import { 
    SittersContext, 
    sittersReducer, 
    initialState,
    type SittersContextValue 
} from './sittersContext';

export function SittersProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(sittersReducer, initialState);

    // 6. DERIVACIÓN DE ESTADO (LÓGICA COMPLETA)
    const filteredSitters = useMemo(() => {
        let result = [...state.sitters];
        const { filters } = state;

        // --- 6.1 Lógica de Filtrado ---
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            result = result.filter(sitter =>
                sitter.sitterName.toLowerCase().includes(term) ||
                sitter.location?.toLowerCase().includes(term) ||
                sitter.bio?.toLowerCase().includes(term)
            );
        }
        if (filters.minRating) {
            result = result.filter(sitter => (sitter.averageRating || 0) >= filters.minRating!);
        }
        if (filters.maxHourlyRate) {
            result = result.filter(sitter => (sitter.hourlyRate || Infinity) <= filters.maxHourlyRate!);
        }
        if (filters.specialty) {
            result = result.filter(sitter => sitter.specialties?.includes(filters.specialty!));
        }

        // --- 6.2 Lógica de Ordenamiento ---
        const direction = filters.sortDirection === 'asc' ? 1 : -1;
        
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case 'rating':
                    return ((b.averageRating || 0) - (a.averageRating || 0)) * direction;
                case 'hourlyRate':
                    return ((a.hourlyRate || 0) - (b.hourlyRate || 0)) * direction;
                case 'distance': {
                    const distA = parseFloat(a.distance || '999');
                    const distB = parseFloat(b.distance || '999');
                    return (distA - distB) * direction;
                }
                case 'relevance':
                default: {
                    // Un cuidador disponible y con mejor rating es más relevante
                    const scoreA = (a.averageRating || 0) * (a.isAvailable ? 1.5 : 1);
                    const scoreB = (b.averageRating || 0) * (b.isAvailable ? 1.5 : 1);
                    return (scoreB - scoreA) * direction;
                }
            }
        });
        
        return result;
    }, [state]);

    // 7. API DE ACCIONES
    const actions = useMemo(() => ({
        setFilters: (filters: SitterFilters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
        updateFilter: (update: Partial<SitterFilters>) => dispatch({ type: 'UPDATE_FILTER', payload: update }),
        clearFilters: () => dispatch({ type: 'CLEAR_FILTERS' }),
        toggleFavorite: (sitterId: number) => dispatch({ type: 'TOGGLE_FAVORITE', payload: sitterId }),
        setSelectedSitter: (sitter: ExtendedSitter | null) => dispatch({ type: 'SET_SELECTED_SITTER', payload: sitter }),
    }), []);

    const contextValue: SittersContextValue = {
        state,
        actions,
        dispatch, // Se incluye dispatch para que lo use el `useSittersActions`
        filteredSitters,
    };

    return (
        <SittersContext.Provider value={contextValue}>
            {children}
        </SittersContext.Provider>
    );
}

