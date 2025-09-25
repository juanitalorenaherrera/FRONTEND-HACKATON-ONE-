// src/features/sitters/hooks/useSittersActions.ts

import type { ExtendedSitter, SitterFilters } from '@/features/sitters/types';
import { getActiveSitters, getSitterStats, searchSitters } from '@/services/sitterService';
import { useCallback, useEffect, useRef } from 'react';

import { useSittersContext } from './useSittersContext';

export function useSittersActions() {
    const { state, dispatch } = useSittersContext();
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (filters: SitterFilters, signal: AbortSignal) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            const hasActiveSearch = Object.values(filters).some(value => value !== '' && value !== null && value !== undefined);
            
            const [sittersData, statsData] = await Promise.all([
                hasActiveSearch ? searchSitters(filters) : getActiveSitters(),
                getSitterStats()
            ]);

            if (signal.aborted) return;
            
            dispatch({ type: 'SET_DATA', payload: { sitters: sittersData as ExtendedSitter[], stats: statsData } });

        } catch (err) {
            if (signal.aborted) return;
            const message = err instanceof Error ? err.message : 'Error al obtener los cuidadores';
            dispatch({ type: 'SET_ERROR', payload: message });
        }
    }, [dispatch]);

    // --- CORRECCIÓN CLAVE ---
    // Creamos una dependencia estable serializando el objeto de filtros.
    // JSON.stringify crea un string que SÓLO cambia si los valores dentro de
    // state.filters cambian, rompiendo así el bucle de referencia.
    const stableFilters = JSON.stringify(state.filters);

    useEffect(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();
        
        // Usamos state.filters directamente aquí, pero el useEffect depende de la versión estable.
        fetchData(state.filters, abortControllerRef.current.signal);
        
        return () => abortControllerRef.current?.abort();
    }, [stableFilters, fetchData, state.filters]); // <-- El bucle se rompe aquí

    const refetch = useCallback(() => {
        dispatch({ type: 'CLEAR_FILTERS' });
    }, [dispatch]);

    return {
        refetch,
    };
}