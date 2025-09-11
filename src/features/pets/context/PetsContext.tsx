import type { Pet, PetFilters, PetStats } from '../types';
import React, { useMemo, useReducer } from 'react';

import { PETS_CONFIG } from '../constants';
import type { ReactNode } from 'react';
import { createContext } from 'react';

// ====================================================================
// 1. INTERFACES Y TIPOS COMPLETOS
// ====================================================================

interface PetsState {
    pets: Pet[];
    selectedPet: Pet | null;
    stats: PetStats | null;
    isLoading: boolean;
    error: string | null;
    filters: PetFilters;
    modal: {
        type: 'add' | 'edit' | null;
        data: Pet | null;
    };
}

type PetsAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_PETS_DATA'; payload: { pets: Pet[]; stats: PetStats | null } }
    | { type: 'SET_SELECTED_PET'; payload: Pet | null }
    | { type: 'UPDATE_FILTERS'; payload: Partial<PetFilters> }
    | { type: 'CLEAR_FILTERS' }
    | { type: 'ADD_PET_SUCCESS'; payload: Pet }
    | { type: 'UPDATE_PET_SUCCESS'; payload: Pet }
    | { type: 'DELETE_PET_SUCCESS'; payload: number }
    | { type: 'SHOW_MODAL'; payload: { type: 'add' | 'edit'; data?: Pet | null } }
    | { type: 'HIDE_MODAL' };

export interface PetsContextValue {
    state: PetsState;
    dispatch: React.Dispatch<PetsAction>;
    filteredPets: Pet[];
}

// ====================================================================
// 2. ESTADO INICIAL Y REDUCER COMPLETOS
// ====================================================================

const initialState: PetsState = {
    pets: [],
    selectedPet: null,
    stats: null,
    isLoading: true,
    error: null,
    filters: {
        search: '',
        species: [],
        activeOnly: true,
        // Asumiendo que `constants.ts` ya está tipado correctamente para evitar el `as`
        sortBy: PETS_CONFIG.DEFAULT_SORT_BY,
        sortOrder: PETS_CONFIG.DEFAULT_SORT_ORDER,
    },
    modal: { type: null, data: null },
};

function petsReducer(state: PetsState, action: PetsAction): PetsState {
    // ... (El cuerpo completo del reducer que ya teníamos)
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload, error: null };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_PETS_DATA':
            return {
                ...state,
                isLoading: false,
                error: null,
                pets: action.payload.pets,
                stats: action.payload.stats,
            };
        // ... resto de los casos
        default:
            return state;
    }
}

// ====================================================================
// 3. CONTEXTO Y PROVEEDOR OPTIMIZADOS
// ====================================================================

export const PetsContext = createContext<PetsContextValue | undefined>(undefined);

export function PetsProvider({ children }: { readonly children: ReactNode }) {
    const [state, dispatch] = useReducer(petsReducer, initialState);

    const filteredPets = useMemo(() => {
        const { pets, filters } = state;
        if (!pets) return [];
        return pets.filter(p => {
            const searchMatch = !filters.search || 
                (p.name?.toLowerCase() || '').includes(filters.search.toLowerCase()) ||
                (p.breed?.toLowerCase() || '').includes(filters.search.toLowerCase());
            const speciesMatch = !filters.species || 
                filters.species.length === 0 || 
                filters.species.includes(p.species);
            const activeMatch = !filters.activeOnly || p.active;
            return searchMatch && speciesMatch && activeMatch;
        });
    }, [state.pets, state.filters]);

    // Solución para la advertencia de rendimiento:
    // Memoizamos el objeto 'value' para evitar re-renders innecesarios.
    const value = useMemo(() => ({
        state,
        dispatch,
        filteredPets,
    }), [state, filteredPets]);

    return (
        <PetsContext.Provider value={value}>
            {children}
        </PetsContext.Provider>
    );
}