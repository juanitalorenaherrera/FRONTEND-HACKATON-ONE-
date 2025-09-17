// ===========================================
// ClientDashboard.tsx - Versión Final Refactorizada
// ===========================================
import { Outlet, useLocation } from 'react-router';

import { ClientSidebar } from '../features/dashboard/components/DashboardSidebar';
import { DashboardHeader } from '../features/dashboard/components/dashboard-header/DashboardHeader';

/**
 * Actúa como el layout principal para todas las vistas del cliente.
 * Provee el contexto de mascotas, la barra lateral y el encabezado,
 * y un espacio <Outlet /> para que el router renderice el contenido de la ruta activa.
 */
export function ClientDashboard() {
	const location = useLocation();

	const getActiveItem = () => {
		const activeView = location.pathname.split('/')[2] || 'dashboard';
		const routeMap: Record<string, string> = {
			pets: 'pets',
			'find-sitters': 'findSitters',
			bookings: 'appointments',
		};
		return routeMap[activeView] || 'dashboard';
	};

	return (
		// 3. Envolvemos todo en el PetsProvider.
		// Ahora, ClientSidebar y todo lo que se renderice en <Outlet /> tendrá acceso al contexto.
		<div className="flex h-screen bg-gray-50">
			<ClientSidebar activeItem={getActiveItem()} />

			<div className="flex-1 flex flex-col overflow-hidden">
				<DashboardHeader />
				<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
					{/* El router renderizará el componente de la ruta activa aquí (PetsView, BookingsView, etc.) */}
					<Outlet />
				</main>
			</div>
		</div>
	);
}
