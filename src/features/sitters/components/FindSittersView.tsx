import { AnimatePresence, motion } from 'framer-motion';
import {
  SearchFilters,
  SitterGrid,
  SitterStats,
  SittersEmptyState,
  SittersErrorState,
  SittersLoadingState
} from '../components';

import type { ExtendedSitter } from '@/features/sitters/types';
import { SittersProvider } from '@/features/sitters/context/SittersContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useSittersActions } from '@/features/sitters/hooks/useSittersActions';
import { useSittersContext } from '@/features/sitters/hooks/useSittersContext';

/**
 * Componente interno que renderiza la UI.
 * Funciona como el "orquestador" de la vista.
 */
function SittersViewContent() {
    const navigate = useNavigate();
    
    // 1. Obtenemos el estado y los cuidadores filtrados del contexto.
    const { state, filteredSitters } = useSittersContext();
    
    // ✨ CORRECCIÓN CLAVE:
    // Llamamos al hook y guardamos el objeto que devuelve (que contiene `refetch`)
    // en una constante llamada `actions`. El hook se encarga por sí solo de la carga inicial de datos.
    const actions = useSittersActions(); 

    const handleViewProfile = (sitter: ExtendedSitter) => {
        console.log(`Navegando al perfil de: ${sitter.sitterName} (ID: ${sitter.id})`);
        // navigate(`/cuidadores/${sitter.id}`);
    };

    const handleHireSitter = (sitter: ExtendedSitter) => {
        navigate('/dashboard/new-booking', { state: { sitterId: sitter.id } });
    };

    // --- Lógica de Renderizado Robusta ---

    // 1. Muestra el esqueleto de carga SÓLO la primera vez.
    // ✨ CORRECCIÓN: Usamos `state.isLoading` que es el nombre correcto de la propiedad.
    if (state.isLoading && state.sitters.length === 0) {
        return <SittersLoadingState />;
    }

    // 2. Si el reducer recibe un error, muestra el estado de error.
    // ✨ CORRECCIÓN: `actions` ahora existe y `actions.refetch` es accesible.
    if (state.error) {
        return <SittersErrorState error={state.error} onRetry={actions.refetch} />;
    }
    
    // 3. Si ya hay datos (o no hay), muestra el layout principal.
    return (
        <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <SitterStats />
            <SearchFilters />
            
            <AnimatePresence mode="wait">
                {!state.isLoading && filteredSitters.length === 0 ? (
                    <motion.div
                        key="empty-state"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <SittersEmptyState />
                    </motion.div>
                ) : (
                    <motion.div key="sitter-grid">
                        <SitterGrid
                            sitters={filteredSitters}
                            isLoading={state.isLoading} 
                            onViewProfile={handleViewProfile}
                            onHire={handleHireSitter}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/**
 * Componente exportado. Envuelve la vista en su propio proveedor de estado.
 */
export function FindSittersView() {
    return (
        <SittersProvider>
            <SittersViewContent />
        </SittersProvider>
    );
}