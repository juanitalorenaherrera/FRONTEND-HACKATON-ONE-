import type { ExtendedSitter } from '@/types/sitter';
import { EmptyState } from './EmptyState';
import { SitterCard } from './SitterCard';


// 1. Las props se simplifican drásticamente.
interface SitterGridProps {
    sitters: ExtendedSitter[];
    onHire: (sitter: ExtendedSitter) => void;
    onViewProfile: (sitter: ExtendedSitter) => void;
}

export function SitterGrid({ sitters, onHire, onViewProfile }: SitterGridProps) {
    
    // 2. La única lógica condicional es si la lista está vacía o no.
    if (sitters.length === 0) {
        // Renderiza el componente autónomo que ya no necesita props.
        return <EmptyState />;
    }

    // 3. Si hay datos, se mapean para renderizar las tarjetas.
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sitters.map((sitter, index) => (
                <div
                    key={sitter.id}
                    // 4. Se conserva la animación de entrada escalonada.
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-fade-in-up" // Asegúrate de tener esta animación en tu tailwind.config.js
                >
                    <SitterCard
                        sitter={sitter}
                        onHire={onHire}
                        onViewProfile={onViewProfile}
                    />
                </div>
            ))}
        </div>
    );
}