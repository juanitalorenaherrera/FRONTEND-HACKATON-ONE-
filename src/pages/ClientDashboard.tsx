import { Outlet, useLocation } from 'react-router-dom';

import { ClientSidebar } from '../features/dashboard/components/DashboardSidebar';
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';
import { PetsProvider } from '../features/pets/context/PetsContext'; // <-- 1. IMPORTANTE: Importamos el Provider

/**
 * Actúa como el layout principal para todas las vistas del cliente.
 * Provee el contexto de mascotas, la barra lateral y el encabezado, 
 * y un espacio <Outlet /> para que el router renderice el contenido de la ruta activa.
 */
export function ClientDashboard() {
    const location = useLocation();

    // 2. Lógica mejorada para determinar el ítem activo en el sidebar.
    // Es más precisa que usar `includes()`.
    const getActiveItem = () => {
        const pathSegments = location.pathname.split('/'); // ej: ['', 'dashboard', 'pets', '123']
        // El segmento que nos interesa es el que viene después de 'dashboard'
        const activeView = pathSegments[2] || 'dashboard'; 
        
        switch (activeView) {
            case 'pets':
                return 'pets';
            case 'find-sitters':
                return 'findSitters';
            case 'bookings':
                return 'appointments';
            // Agrega más casos según tus rutas
            default:
                return 'dashboard';
        }
    };

    return (
        // 3. Envolvemos todo en el PetsProvider.
        // Ahora, ClientSidebar y todo lo que se renderice en <Outlet /> tendrá acceso al contexto.
        <PetsProvider>
            <div className="flex h-screen bg-gray-50">
                <ClientSidebar 
                    activeItem={getActiveItem()} 
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <DashboardHeader />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                        {/* El router renderizará el componente de la ruta activa aquí (PetsView, BookingsView, etc.) */}
                        <Outlet />
                    </main>
                </div>
            </div>
        </PetsProvider>
    );
}