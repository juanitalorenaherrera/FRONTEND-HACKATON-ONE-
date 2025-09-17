// Mock service para desarrollo sin backend
import type { DashboardData } from '../types/dashboardData';

export const getMockDashboardData = (): Promise<DashboardData> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				userProfile: {
					id: 1,
					firstName: 'Usuario',
					lastName: 'Demo',
					email: 'demo@example.com',
					role: 'user',
					initials: 'UD',
				},
				stats: {
					activePets: 3,
					activePetsChange: '+1 esta semana',
					scheduledAppointments: 2,
					scheduledAppointmentsChange: 'Próxima: Mañana',
					vaccinesUpToDate: '2/3',
					vaccinesChange: '1 pendiente',
					pendingReminders: 1,
					pendingRemindersChange: 'Vacuna pendiente',
				},
				userPets: [
					{
						id: 1,
						accountId: 1,
						accountName: 'Usuario Demo',
						name: 'Max',
						species: 'Perro',
						breed: 'Golden Retriever',
						age: 3,
						createdAt: new Date().toISOString(),
						active: true,
					},
				],
				recentSitters: [],
				nextAppointment: null,
			});
		}, 500);
	});
};
