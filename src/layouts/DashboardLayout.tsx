import { Outlet, useLocation } from 'react-router';
import { useMemo } from 'react';

import { ClientSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header/DashboardHeader';

const ROUTE_MAP: Record<string, string> = {
	'pets': 'pets',
	'find-sitters': 'findSitters',
	'bookings': 'appointments'
};

export function DashboardLayout() {
	const location = useLocation();
	const path = location.pathname;

	const activeItem = useMemo(() => {
		const activeView = path.split('/')[2] || 'dashboard';
		return ROUTE_MAP[activeView] || 'dashboard';
	}, [path]);

	return (
		<div className="flex h-screen bg-gray-50">
			<ClientSidebar activeItem={activeItem} />

			<div className="flex-1 flex flex-col overflow-hidden">
				<DashboardHeader />
				<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
