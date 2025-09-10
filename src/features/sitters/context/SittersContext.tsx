import React, { createContext, useContext, ReactNode, useReducer, useMemo } from 'react';
import type { ExtendedSitter, SitterStats, SitterFilters } from '../types';
import { SITTER_CONFIG } from '../config/sitters.config';

// 1. FORMA DEL ESTADO (sin cambios)
interface SittersState {
    sitters: ExtendedSitter[];
    stats: SitterStats | null;
    favorites: Set<number>;
    selectedSitter: ExtendedSitter | null;
    isLoading: boolean;
    error: string | null;
    filters: SitterFilters;
    pagination: {
        page: number;
        hasMore: boolean;
    };
}

// 2. ACCIONES (sin cambios)
type SittersAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_DATA'; payload: { sitters: ExtendedSitter[], stats: SitterStats } }
    | { type: 'SET_FILTERS'; payload: SitterFilters }
    | { type: 'UPDATE_FILTER'; payload: Partial<SitterFilters> }
    | { type: 'CLEAR_FILTERS' }
    | { type: 'TOGGLE_FAVORITE'; payload: number }
    | { type: 'SET_SELECTED_SITTER'; payload: ExtendedSitter | null };

// Estado inicial (sin cambios)
const initialState: SittersState = {
    sitters: [],
    stats: null,
    favorites: new Set(),
    selectedSitter: null,
    isLoading: true,
    error: null,
    filters: { sortBy: 'relevance', sortDirection: 'desc' },
    pagination: { page: 1, hasMore: true },
};

// 3. REDUCER (sin cambios)
function sittersReducer(state: SittersState, action: SittersAction): SittersState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload, error: null };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_DATA':
            return { ...state, isLoading: false, error: null, sitters: action.payload.sitters, stats: action.payload.stats };
        case 'SET_FILTERS':
            return { ...state, filters: action.payload, pagination: { ...state.pagination, page: 1 } };
        case 'UPDATE_FILTER':
            return { ...state, filters: { ...state.filters, ...action.payload }, pagination: { ...state.pagination, page: 1 } };
        case 'CLEAR_FILTERS':
            return { ...state, filters: initialState.filters, pagination: { ...state.pagination, page: 1 } };
        case 'TOGGLE_FAVORITE':
            const newFavorites = new Set(state.favorites);
            if (newFavorites.has(action.payload)) newFavorites.delete(action.payload);
            else newFavorites.add(action.payload);
            return { ...state, favorites: newFavorites };
        case 'SET_SELECTED_SITTER':
            return { ...state, selectedSitter: action.payload };
        default:
            return state;
    }
}

// 4. VALOR DEL CONTEXTO (ACTUALIZADO para incluir dispatch)
interface SittersContextValue {
    state: SittersState;
    actions: {
        setFilters: (filters: SitterFilters) => void;
        updateFilter: (update: Partial<SitterFilters>) => void;
        clearFilters: () => void;
        toggleFavorite: (sitterId: number) => void;
        setSelectedSitter: (sitter: ExtendedSitter | null) => void;
    };
    dispatch: React.Dispatch<SittersAction>; // Exponemos dispatch para el hook de lógica
    filteredSitters: ExtendedSitter[];
}

const SittersContext = createContext<SittersContextValue | undefined>(undefined);

// 5. PROVIDER
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
                case 'distance':
                    const distA = parseFloat(a.distance || '999');
                    const distB = parseFloat(b.distance || '999');
                    return (distA - distB) * direction;
                case 'relevance':
                default:
                    // Un cuidador disponible y con mejor rating es más relevante
                    const scoreA = (a.averageRating || 0) * (a.isAvailable ? 1.5 : 1);
                    const scoreB = (b.averageRating || 0) * (b.isAvailable ? 1.5 : 1);
                    return (scoreB - scoreA) * direction;
            }
        });
        
        return result;
    }, [state.sitters, state.filters]);

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

// 8. HOOK DE CONSUMO
export function useSittersContext() {
    const context = useContext(SittersContext);
    if (context === undefined) {
        throw new Error('useSittersContext must be used within a SittersProvider');
    }
    return context;
}