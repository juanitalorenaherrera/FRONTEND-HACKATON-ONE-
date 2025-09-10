import { useCallback, useRef, useEffect } from 'react';
import { useSittersContext } from '../../sitters/context/SittersContext';
import { getActiveSitters, getSitterStats, searchSitters } from '../../../services/sitterService';
import type { SitterFilters } from '../types';

export function useSittersActions() {
    // 1. Obtenemos `dispatch` en lugar de `actions`.
    const { state, dispatch } = useSittersContext();
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (filters: SitterFilters, signal: AbortSignal) => {
        // 2. Usamos `dispatch` para enviar acciones al reducer.
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            const hasActiveSearch = Object.keys(filters).length > 0 && filters.searchTerm;
            
            const [sittersData, statsData] = await Promise.all([
                hasActiveSearch ? searchSitters(filters) : getActiveSitters(),
                getSitterStats()
            ]);

            if (signal.aborted) return;
            
            // 3. Despachamos una única acción con todos los datos.
            dispatch({ type: 'SET_DATA', payload: { sitters: sittersData, stats: statsData } });

        } catch (err) {
            if (signal.aborted) return;
            const message = err instanceof Error ? err.message : 'Error al obtener los cuidadores';
            dispatch({ type: 'SET_ERROR', payload: message });
        }
    }, [dispatch]);

    useEffect(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();
        fetchData(state.filters, abortControllerRef.current.signal);
        return () => abortControllerRef.current?.abort();
    }, [state.filters, fetchData]);

    const refetch = useCallback(() => {
        // La acción de refetch sigue funcionando igual, pero a través de dispatch.
        dispatch({ type: 'CLEAR_FILTERS' });
    }, [dispatch]);

    return {
        refetch,
    };
}