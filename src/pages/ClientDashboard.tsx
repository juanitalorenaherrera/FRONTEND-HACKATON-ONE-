import { ClientSidebar } from '../components/clientDashboard/DashboardSidebar';
import { DashboardHeader } from '../components/clientDashboard/DashboardHeader';
import { DashboardStats } from '../components/clientDashboard/DashboardStats';
import { FindSittersView } from './FindSittersView';
import MainDashboardView from './MainDashboardView';
import { PetProfile } from './PetProfile';
import { PetsView } from './PetsView';
import { useState } from 'react';

// 1. Importamos los componentes que acabas de organizar
// Este es el componente principal que organiza toda la página del dashboard
export function ClientDashboard() {
    // Estado para manejar qué vista se está mostrando en el área principal
    const [activeView, setActiveView] = useState('dashboard');
    // Estado para saber qué mascota está seleccionada (para ver su perfil)
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    // Función para cambiar de vista desde el Sidebar
    const handleNavItemSelect = (item: string) => {
        setActiveView(item);
        setSelectedPetId(null); // Reseteamos la mascota seleccionada al cambiar de vista
    };
    
    // Función para manejar la selección de una mascota y mostrar su perfil
    const handlePetSelect = (petId: string) => {
        setSelectedPetId(petId);
        setActiveView('petProfile'); // Cambiamos a la vista de perfil de mascota
    };

    // Función para volver desde el perfil de la mascota a la vista anterior
    const handleBackFromProfile = () => {
        setSelectedPetId(null);
        setActiveView('pets'); // Volvemos a la vista "Mis Mascotas"
    };

    // Función para renderizar el contenido principal según la vista activa
    const renderMainContent = () => {
        if (activeView === 'petProfile' && selectedPetId) {
            return <PetProfile petId={selectedPetId} onBack={handleBackFromProfile} />;
        }
        
        switch (activeView) {
            case 'dashboard':
                return <MainDashboardView onPetSelect={handlePetSelect} />;
            case 'pets':
                return <PetsView onPetSelect={handlePetSelect} />;
            case 'findSitters': // <-- 2. Añade un nuevo caso para la vista de cuidadores
                return <FindSittersView />;
            case 'appointments':
                return <div className="text-center py-12 bg-white rounded-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Reservas</h2>
                    <p className="text-gray-600">Aquí aparecerán tus citas y reservas</p>
                </div>;
            case 'favorites':
                return <div className="text-center py-12 bg-white rounded-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Favoritos</h2>
                    <p className="text-gray-600">Tus cuidadores favoritos aparecerán aquí</p>
                </div>;
            case 'notifications':
                return <div className="text-center py-12 bg-white rounded-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Notificaciones</h2>
                    <p className="text-gray-600">Aquí verás todas tus notificaciones</p>
                </div>;
            case 'billing':
                return <div className="text-center py-12 bg-white rounded-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Facturación</h2>
                    <p className="text-gray-600">Gestiona tus pagos y facturas</p>
                </div>;
            case 'profile':
                return <div className="text-center py-12 bg-white rounded-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfil</h2>
                    <p className="text-gray-600">Edita tu información personal</p>
                </div>;
            case 'settings':
                return <div className="text-center py-12 bg-white rounded-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuración</h2>
                    <p className="text-gray-600">Personaliza tu experiencia</p>
                </div>;
            // Agrega más casos para 'appointments', 'favorites', etc.
            default:
                return <MainDashboardView onPetSelect={handlePetSelect} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* 2. El Sidebar de navegación a la izquierda - Cambio aquí también */}
            <ClientSidebar activeItem={activeView} onItemSelect={handleNavItemSelect} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* 3. El Header en la parte superior del área de contenido */}
                <DashboardHeader onMenuToggle={() => {}} />

                {/* 4. El contenido principal que cambia dinámicamente */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <DashboardStats />
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
}