// ===========================================
// MainDashboardView.tsx - Versión alineada
// ===========================================

import type {
	Appointment,
	Sitter,
} from '../../types/dashboardData';

import { AlertCircle } from 'lucide-react';
import HeroBanner from './components/sections/MainDashboard/HeroBanner/HeroBanner';
import MyPetsSection from './components/sections/MainDashboard/MyPets/MyPetsSection';
import NextAppointmentCard from './components/sections/MainDashboard/NextBooking/NextBookingCard';
import QuickActionsSection from './components/sections/MainDashboard/QuickActions/QuickActionsSection';
import React from 'react';
import RecentSittersSection from './components/sections/MainDashboard/RecentSitters/RecentSittersSection';
import RecommendationBanner from './components/sections/MainDashboard/RecommendationBanner/RecommendationBanner';
import StatsSection from './components/sections/MainDashboard/Stats/StatsSection';
import UpcomingEventsCalendar from './components/sections/MainDashboard/UpcomingEvents/UpcomingEventsCalendar';
import { useDashboardData } from './hooks/useDashboardData';

interface MainDashboardViewProps {
	onPetSelect?: (petId: string) => void;
	className?: string;
}

const MainDashboardView: React.FC<MainDashboardViewProps> = ({
	onPetSelect,
	className = '',
}) => {
	// Usar el hook personalizado para obtener todos los datos
	const {
		isLoading,
		error,
		refetch,
		userProfile,
		userPets,
		recentSitters,
		stats,
		nextAppointment,
	} = useDashboardData();

	// Handlers para las diferentes acciones
	const handleServiceClick = (serviceId: string) => {
		console.log(`Service clicked: ${serviceId}`);
		switch (serviceId) {
			case 'find-sitter':
				// Navegar a búsqueda de cuidadores
				break;
			case 'care-24-7':
				// Navegar a cuidado 24/7
				break;
			case 'grooming':
				// Navegar a servicios de grooming
				break;
			case 'emergency':
				// Navegar a servicios de emergencia
				break;
			default:
				console.log(`Unknown service: ${serviceId}`);
		}
	};

	const handleHireSitter = (sitter: Sitter) => {
		console.log('Hiring sitter:', sitter.id);
		// Implementar lógica de contratación
		// Posible navegación: /hire-sitter/${sitter.id}
	};

	const handleViewSitterProfile = (sitter: Sitter) => {
		console.log('Viewing sitter profile:', sitter.id);
		// Implementar navegación al perfil del cuidador
		// Posible navegación: /sitter-profile/${sitter.id}
	};

	const handleViewAllSitters = () => {
		console.log('Viewing all sitters');
		// Implementar navegación a lista completa de cuidadores
		// Posible navegación: /sitters
	};

	const handleStatClick = (statId: string) => {
		console.log(`Stat clicked: ${statId}`);
		switch (statId) {
			case 'vaccines':
				// Navegar a recordatorios de vacunas
				break;
			case 'reminders':
				// Navegar a recordatorios pendientes
				break;
			case 'pets':
				// Navegar a lista de mascotas
				break;
			case 'appointments':
				// Navegar a citas programadas
				break;
			default:
				console.log(`Unknown stat: ${statId}`);
		}
	};

	const handleQuickAction = (actionId: string) => {
		console.log(`Quick action: ${actionId}`);
		switch (actionId) {
			case 'new-pet':
				// Navegar a agregar mascota
				break;
			case 'schedule-appointment':
				// Navegar a agendar cita
				break;
			case 'emergency':
				// Navegar a servicios de emergencia
				break;
			case 'reminders':
				// Navegar a recordatorios
				break;
			case 'find-sitter':
				// Navegar a búsqueda de cuidadores
				break;
			default:
				console.log(`Unknown action: ${actionId}`);
		}
	};

	const handleRecommendationAction = (actionId: string) => {
		console.log(`Recommendation action: ${actionId}`);
		// Implementar navegación según la recomendación
	};

	const handleEventClick = (eventId: string) => {
		console.log(`Event clicked: ${eventId}`);
		// Implementar navegación según el evento
	};

	const handleAppointmentContact = (appointment: Appointment) => {
		console.log('Contacting sitter for appointment:', appointment.id);
		// Implementar contacto con cuidador
		// Posible acción: abrir modal de contacto o navegar a chat
	};

	const handleAppointmentDetails = (appointment: Appointment) => {
		console.log('Viewing appointment details:', appointment.id);
		// Implementar vista de detalles de cita
		// Posible navegación: /appointment/${appointment.id}
	};

	const handleAppointmentReschedule = (appointment: Appointment) => {
		console.log('Rescheduling appointment:', appointment.id);
		// Implementar reprogramación de cita
		// Posible navegación: /reschedule/${appointment.id}
	};

	const handlePetSelect = (petId: string) => {
		console.log('Pet selected:', petId);
		if (onPetSelect) {
			onPetSelect(petId);
		}
		// Posible navegación: /pet-profile/${petId}
	};

	const handleRetry = () => {
		console.log('Retrying dashboard data fetch');
		refetch();
	};

	// Loading state con skeleton mejorado
	if (isLoading) {
		return (
			<div
				className={`grid grid-cols-1 xl:grid-cols-10 gap-8 ${className}`}
			>
				<div className="xl:col-span-7 space-y-8">
					{/* Hero Banner Skeleton */}
					<div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl h-64 animate-pulse shadow-sm"></div>

					{/* Next Appointment Skeleton */}
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
							<div className="space-y-2">
								<div className="h-6 bg-gray-200 rounded w-32"></div>
								<div className="h-4 bg-gray-200 rounded w-24"></div>
							</div>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
							<div className="h-20 bg-gray-200 rounded-xl"></div>
							<div className="h-20 bg-gray-200 rounded-xl"></div>
						</div>
						<div className="pt-4 border-t border-gray-100">
							<div className="flex gap-3">
								<div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
								<div className="h-12 bg-gray-200 rounded-xl w-24"></div>
								<div className="h-12 bg-gray-200 rounded-xl w-24"></div>
							</div>
						</div>
					</div>

					{/* Recent Sitters Skeleton */}
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
							<div className="space-y-2">
								<div className="h-6 bg-gray-200 rounded w-48"></div>
								<div className="h-4 bg-gray-200 rounded w-32"></div>
							</div>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="bg-gray-50 rounded-2xl p-6 shadow-sm animate-pulse"
								>
									<div className="flex items-center gap-4 mb-4">
										<div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
										<div className="flex-1 space-y-2">
											<div className="h-4 bg-gray-200 rounded"></div>
											<div className="h-3 bg-gray-200 rounded w-3/4"></div>
										</div>
									</div>
									<div className="space-y-3 mb-4">
										<div className="h-3 bg-gray-200 rounded"></div>
										<div className="h-3 bg-gray-200 rounded"></div>
									</div>
									<div className="flex gap-3 pt-4 border-t border-gray-200">
										<div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
										<div className="h-12 bg-gray-200 rounded-xl w-12"></div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Quick Actions Skeleton */}
					<div className="space-y-6">
						<div className="h-6 bg-gray-200 rounded w-40"></div>
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
								>
									<div className="h-16 bg-gray-200 rounded-2xl mx-auto mb-4 w-16"></div>
									<div className="h-4 bg-gray-200 rounded"></div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Sidebar Skeleton */}
				<div className="xl:col-span-3 space-y-6">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
						>
							<div className="flex items-center gap-3 mb-6">
								<div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
								<div className="space-y-2">
									<div className="h-5 bg-gray-200 rounded w-24"></div>
									<div className="h-4 bg-gray-200 rounded w-20"></div>
								</div>
							</div>
							<div className="space-y-4">
								<div className="h-16 bg-gray-200 rounded-xl"></div>
								<div className="h-16 bg-gray-200 rounded-xl"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// Error state mejorado
	if (error) {
		return (
			<div
				className={`flex items-center justify-center min-h-96 ${className}`}
			>
				<div className="text-center max-w-md mx-auto p-8 bg-red-50 border border-red-200 rounded-2xl shadow-lg">
					<AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
					<h3 className="text-2xl font-bold text-red-900 mb-3">
						Error al cargar el dashboard
					</h3>
					<p className="text-red-700 mb-6 leading-relaxed">{error}</p>
					<div className="flex gap-3 justify-center">
						<button
							onClick={handleRetry}
							className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
						>
							Reintentar
						</button>
						<button
							onClick={() => (window.location.href = '/')}
							className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
						>
							Ir al inicio
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`grid grid-cols-1 xl:grid-cols-10 gap-8 ${className}`}>
			{/* Columna Principal - 70% */}
			<div className="xl:col-span-7 space-y-8">
				{/* Hero Banner */}
				<HeroBanner
					userProfile={userProfile}
					userPets={userPets}
					recentSitters={recentSitters}
					onServiceClick={handleServiceClick}
				/>

				{/* Próxima Cita - Solo mostrar si existe */}
				{nextAppointment && (
					<NextAppointmentCard
						nextAppointment={nextAppointment}
						onContact={handleAppointmentContact}
						onViewDetails={handleAppointmentDetails}
						onReschedule={handleAppointmentReschedule}
					/>
				)}

				{/* Cuidadores Recientes */}
				<RecentSittersSection
					recentSitters={recentSitters}
					onHireSitter={handleHireSitter}
					onViewSitterProfile={handleViewSitterProfile}
					onViewAll={handleViewAllSitters}
				/>

				{/* Acciones Rápidas */}
				<QuickActionsSection onActionClick={handleQuickAction} />
			</div>

			{/* Sidebar Derecha - 30% */}
			<div className="xl:col-span-3 space-y-6">
				{/* Mis Mascotas */}
				<MyPetsSection
					userPets={userPets}
					onPetSelect={handlePetSelect}
				/>

				{/* Stats Cards */}
				<StatsSection stats={stats} onStatClick={handleStatClick} />

				{/* Recomendación del Día */}
				<RecommendationBanner
					userPets={userPets}
					onActionClick={handleRecommendationAction}
				/>

				{/* Mini Calendar */}
				<UpcomingEventsCalendar
					stats={stats}
					nextAppointment={nextAppointment}
					onEventClick={handleEventClick}
				/>
			</div>
		</div>
	);
};

export default MainDashboardView;
