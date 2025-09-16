// ===========================================
// components/LoadingState.tsx - Estado de carga
// ===========================================
import { Skeleton } from '@/components/ui/Skeleton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// El componente ya no es genérico, es el estado de carga específico para los cuidadores.
// Podemos renombrarlo para mayor claridad.
export function SittersLoadingState({ className = '' }: { className?: string }) {
    return (
        <div className={`space-y-8 ${className}`}>
            {/* Header Skeleton (ahora compuesto por primitivas) */}
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="w-3/4 space-y-2">
                        <Skeleton className="h-8 w-full max-w-md" />
                        <Skeleton className="h-6 w-full max-w-sm" />
                    </div>
                    <div className="w-1/4 space-y-2">
                        <Skeleton className="h-8 w-16 ml-auto" />
                        <Skeleton className="h-4 w-32 ml-auto" />
                    </div>
                </div>
            </div>

            {/* SitterGrid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Generamos un array de 6 elementos para los skeletons de las tarjetas */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="p-6 bg-white rounded-2xl border">
                        <div className="flex items-start gap-4">
                            <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
                            <div className="w-full space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-5/6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Opcional: Si la carga es muy larga, puedes mostrar un spinner.
                Normalmente, un buen esqueleto es suficiente. Lo incluyo para el ejemplo. */}
            <div className="pt-10">
                <LoadingSpinner 
                    title="Afinando la búsqueda..."
                    description="Estamos encontrando los mejores cuidadores para ti."
                />
            </div>
        </div>
    );
}
