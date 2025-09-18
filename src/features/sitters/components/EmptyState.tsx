import { FilterX, Users } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useSittersContext } from '@/features/sitters/hooks/useSittersContext';

export const EmptyState = () => {
    // 1. Obtenemos estado y acciones del contexto (tu lógica original)
    const { state, actions } = useSittersContext();

    // 2. Determinamos si hay filtros activos
    const hasActiveFilters = !!(
        state.filters.searchTerm || 
        state.filters.maxDistance || 
        state.filters.minRating || 
        state.filters.maxHourlyRate || 
        state.filters.specialty || 
        state.filters.availableOnly
    );

    // 3. Definimos el contenido dinámicamente
    const Icon = hasActiveFilters ? FilterX : Users;
    const title = hasActiveFilters 
        ? "Ningún cuidador coincide con tus filtros" 
        : "Aún no hay cuidadores disponibles";
    const description = hasActiveFilters
        ? "Prueba ajustar o eliminar los filtros para ampliar tu búsqueda y encontrar al cuidador perfecto."
        : "Parece que no hay cuidadores activos en tu área por ahora. ¡Vuelve a comprobarlo más tarde!";

    return (
        <motion.div
            className="flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-3xl bg-glass-neutral border border-white/20 backdrop-blur-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="p-4 bg-pet-teal/10 rounded-full mb-6">
                <Icon className="w-12 h-12 text-pet-teal" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                {title}
            </h2>
            <p className="text-neutral-500 max-w-md mb-6">
                {description}
            </p>

            {/* 4. Mostramos un botón de acción específico para cada caso */}
            {hasActiveFilters ? (
                <Button 
                    variant="secondary" 
                    onClick={actions.clearFilters}
                >
                    <FilterX className="w-4 h-4 mr-2" />
                    Limpiar Filtros
                </Button>
            ) : (
                <Button 
                    variant="outline"
                    onClick={() => window.location.reload()}
                >
                    <Users className="w-4 h-4 mr-2" />
                    Refrescar Búsqueda
                </Button>
            )}
        </motion.div>
    );
};