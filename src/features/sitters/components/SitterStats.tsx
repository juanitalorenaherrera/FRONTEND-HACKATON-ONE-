import { useMemo } from 'react';
import { Users, UserCheck, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSittersContext } from '@/features/sitters/hooks/useSittersContext';
import { Skeleton } from '@/components/ui/Skeleton';

// 5. Creación de un sub-componente para evitar la repetición de JSX.
const StatCard = ({ icon: Icon, value, label }: { icon: LucideIcon; value: number; label: string }) => (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
        <div className="bg-orange-100 p-3 rounded-xl">
            <Icon className="w-6 h-6 text-orange-600" />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

// 1. El componente ya no recibe props para los datos.
export function SitterStats({ className = '' }: { className?: string }) {
    // 2. Conexión directa al contexto para obtener el estado.
    const { state } = useSittersContext();

    // 3. Memoización de cálculos derivados para optimizar el rendimiento.
    //    El componente calcula estos valores por sí mismo a partir del estado global.
    const availableCount = useMemo(() => 
        state.sitters.filter(sitter => sitter.isAvailable).length,
        [state.sitters]
    );

    const topRatedCount = useMemo(() => 
        state.sitters.filter(sitter => (sitter.averageRating || 0) >= 4.8).length,
        [state.sitters]
    );

    // 4. Manejo del estado de carga inicial con un esqueleto.
    //    Se muestra mientras `state.stats` aún no ha sido cargado por la API.
    if (!state.stats) {
        return (
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-2xl p-4 border flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-7 w-12" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    
    const statsList = [
        { icon: Users, value: state.stats.totalSitters, label: 'Cuidadores Totales' },
        { icon: UserCheck, value: availableCount, label: 'Disponibles Ahora' },
        { icon: Award, value: topRatedCount, label: 'Mejor Valorados' },
        { icon: Users, value: state.stats.verifiedSitters, label: 'Perfiles Verificados' }
    ];

    return (
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
            {statsList.map((stat, index) => (
                <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} />
            ))}
        </div>
    );
}