import React from 'react';
import { useSittersContext } from '../context/SittersContext';
import { ErrorState as GenericErrorState } from '../../../components/ui/ErrorState'; // Importamos el componente genérico

export function SittersErrorState({ className = '' }: { className?: string }) {
    const { state, actions } = useSittersContext();

    if (!state.error) {
        return null;
    }

    return (
        <GenericErrorState
            title="Error al Cargar Cuidadores"
            message={state.error}
            onRetry={actions.clearFilters}
            className={className}
        />
    );
}