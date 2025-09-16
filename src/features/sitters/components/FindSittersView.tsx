import { SittersProvider, useSittersContext } from '../context/SittersContext';
import { useSittersActions } from '../hooks/useSittersActions';
import {
    SitterStats,
    SearchFilters,
    SitterGrid,
    SittersLoadingState,
    SittersErrorState
} from '../components';
import type { ExtendedSitter } from '../../../types/sitter';

/**
 * Componente interno que renderiza la UI.
 * Se asegura de que siempre se renderice dentro del SittersProvider.
 */
function SittersViewContent() {
    // 1. Obtiene el estado y el estado derivado (`filteredSitters`) del contexto.
    const { state, filteredSitters } = useSittersContext();

    // 2. Activa el hook de lógica. Este hook se encargará de reaccionar
    //    a los cambios en `state.filters` y de hacer las llamadas a la API.
    useSittersActions();

    // 3. Define los manejadores de acciones que pasarás a los componentes hijos.
    //    Este es el límite de la "feature", un buen lugar para la lógica de navegación.
    const handleViewProfile = (sitter: ExtendedSitter) => {
        console.log(`Navegando al perfil de: ${sitter.sitterName} (ID: ${sitter.id})`);
        // Lógica de navegación real iría aquí. Ej: navigate(`/cuidadores/${sitter.id}`);
    };

    const handleHireSitter = (sitter: ExtendedSitter) => {
        console.log(`Iniciando contratación de: ${sitter.sitterName}`);
        // Lógica para mostrar un modal de contratación o navegar a una página de reserva.
    };

    // 4. Renderizado condicional basado en el estado del contexto.
    //    El esqueleto solo se muestra en la carga inicial (cuando no hay cuidadores en el estado).
    if (state.isLoading && state.sitters.length === 0) {
        return <SittersLoadingState />;
    }

    //    El estado de error se muestra si la propiedad `error` en el estado tiene un valor.
    if (state.error) {
        return <SittersErrorState />;
    }

    //    Una vez cargado, se muestra el layout principal.
    return (
        <div className="space-y-8">
            <SitterStats />
            <SearchFilters />
            <SitterGrid
                sitters={filteredSitters}
                onHire={handleHireSitter}
                onViewProfile={handleViewProfile}
            />
        </div>
    );
}


/**
 * Componente exportado. Su única responsabilidad es
 * envolver la lógica y la UI en el `SittersProvider`.
 */
export function FindSittersView() {
    return (
        <SittersProvider>
            <SittersViewContent />
        </SittersProvider>
    );
}