import { createContext } from 'react';
import type { ExtendedSitter, SitterStats, SitterFilters } from '@/features/sitters/types';

// 1. FORMA DEL ESTADO
export interface SittersState {
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

// 2. ACCIONES
export type SittersAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_DATA'; payload: { sitters: ExtendedSitter[], stats: SitterStats } }
    | { type: 'SET_FILTERS'; payload: SitterFilters }
    | { type: 'UPDATE_FILTER'; payload: Partial<SitterFilters> }
    | { type: 'CLEAR_FILTERS' }
    | { type: 'TOGGLE_FAVORITE'; payload: number }
    | { type: 'SET_SELECTED_SITTER'; payload: ExtendedSitter | null };

// 3. VALOR DEL CONTEXTO
export interface SittersContextValue {
    state: SittersState;
    actions: {
        setFilters: (filters: SitterFilters) => void;
        updateFilter: (update: Partial<SitterFilters>) => void;
        clearFilters: () => void;
        toggleFavorite: (sitterId: number) => void;
        setSelectedSitter: (sitter: ExtendedSitter | null) => void;
    };
    dispatch: React.Dispatch<SittersAction>;
    filteredSitters: ExtendedSitter[];
}

// 4. CONTEXTO
export const SittersContext = createContext<SittersContextValue | undefined>(undefined);

// 5. ESTADO INICIAL
export const initialState: SittersState = {
    sitters: [],
    stats: null,
    favorites: new Set(),
    selectedSitter: null,
    isLoading: true,
    error: null,
    filters: { sortBy: 'relevance', sortDirection: 'desc' },
    pagination: { page: 1, hasMore: true },
};

// 6. REDUCER
export function sittersReducer(state: SittersState, action: SittersAction): SittersState {
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
        case 'TOGGLE_FAVORITE': {
            const newFavorites = new Set(state.favorites);
            if (newFavorites.has(action.payload)) newFavorites.delete(action.payload);
            else newFavorites.add(action.payload);
            return { ...state, favorites: newFavorites };
        }
        case 'SET_SELECTED_SITTER':
            return { ...state, selectedSitter: action.payload };
        default:
            return state;
    }
}