// features/pets/components/profile/PetProfileTabs.tsx

import { Activity, Calendar, Heart } from 'lucide-react';
import { useState } from 'react';

import type { Pet } from '../../types';
import { PetAppointmentsTab } from './PetAppointmentsTab';
import { PetMedicalTab } from './PetMedicalTab';

// Importamos los componentes de contenido que creamos para cada pestaña


// import { PetVaccinationsTab } from './PetVaccinationsTab'; // (Crearíamos este siguiendo el mismo patrón)

// 1. ARRAY DE CONFIGURACIÓN
// Define todo lo que necesitamos para cada pestaña en un solo lugar.
const TABS_CONFIG = [
    {
        id: 'medical',
        label: 'Información Médica',
        icon: Activity,
        Component: PetMedicalTab,
    },
    {
        id: 'appointments',
        label: 'Historial de Citas',
        icon: Calendar,
        Component: PetAppointmentsTab,
    },
    {
        id: 'vaccines',
        label: 'Vacunas',
        icon: Heart,
        // Component: PetVaccinationsTab, // Placeholder para el futuro componente de vacunas
        Component: () => <div>Contenido de Vacunas Próximamente...</div>, // Placeholder
    },
];

export function PetProfileTabs({ pet }: { pet: Pet }) {
    // 2. ESTADO LOCAL
    // El estado de la pestaña activa es un concern de UI que pertenece únicamente a este componente.
    const [activeTab, setActiveTab] = useState(TABS_CONFIG[0].id); // La primera pestaña es la activa por defecto

    // 3. RENDERIZADO DECLARATIVO
    // Encontramos el componente a renderizar basado en el estado `activeTab`.
    const ActiveTabContent = TABS_CONFIG.find(tab => tab.id === activeTab)?.Component;

    return (
        <div>
            {/* Navegación de Pestañas */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 -mb-px">
                    {TABS_CONFIG.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                    isActive
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Contenido de la Pestaña Activa */}
            <div className="mt-6">
                {/* Renderizamos el componente activo, pasándole el objeto `pet` */}
                {ActiveTabContent && <ActiveTabContent pet={pet} />}
            </div>
        </div>
    );
}