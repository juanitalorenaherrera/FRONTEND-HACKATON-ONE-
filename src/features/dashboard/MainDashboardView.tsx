// ===========================================
// MainDashboardView.tsx - Versión alineada
// ===========================================
import type { Appointment, Sitter } from '@/types/dashboardData';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import HeroBanner from './components/sections/MainDashboard/HeroBanner/HeroBanner';
import MyPetsSection from './components/sections/MainDashboard/MyPets/MyPetsSection';
import NextAppointmentCard from './components/sections/MainDashboard/NextBooking/NextBookingCard';
import QuickActionsSection from './components/sections/MainDashboard/QuickActions/QuickActionsSection';
import RecentSittersSection from './components/sections/MainDashboard/RecentSitters/RecentSittersSection';
import RecommendationBanner from './components/sections/MainDashboard/RecommendationBanner/RecommendationBanner';
import StatsSection from './components/sections/MainDashboard/Stats/StatsSection';
import UpcomingEventsCalendar from './components/sections/MainDashboard/UpcomingEvents/UpcomingEventsCalendar';
import { useDashboardData } from './hooks/useDashboardData';

interface MainDashboardViewProps {
	onPetSelect?: (petId: string) => void;
	className?: string;
}

export default function MainDashboardView({
	onPetSelect,
	className = '',
}: MainDashboardViewProps) {
	const navigate = useNavigate();

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

	// Route mappings for optimized navigation
	const serviceRoutes: Record<string, string> = {
		'find-sitter': '/dashboard/find-sitters',
		'care-24-7': '/dashboard/care',
		'grooming': '/dashboard/grooming',
		'emergency': '/dashboard/emergency'
	};

	const statRoutes: Record<string, string> = {
		'vaccines': '/dashboard/pets?filter=vaccines',
		'reminders': '/dashboard/reminders',
		'pets': '/dashboard/pets',
		'appointments': '/dashboard/bookings'
	};

	const actionRoutes: Record<string, string> = {
		'new-pet': '/dashboard/pets/new',
		'schedule-appointment': '/dashboard/bookings/new',
		'emergency': '/dashboard/emergency',
		'reminders': '/dashboard/reminders',
		'find-sitter': '/dashboard/find-sitters'
	};

	// Optimized handlers
	const handleServiceClick = (serviceId: string) => {
		const route = serviceRoutes[serviceId];
		if (route) navigate(route);
	};

	const handleHireSitter = (sitter: Sitter) => {
		navigate(`/dashboard/hire-sitter/${sitter.id}`);
	};

	const handleViewSitterProfile = (sitter: Sitter) => {
		navigate(`/dashboard/sitter-profile/${sitter.id}`);
	};

	const handleViewAllSitters = () => {
		navigate('/dashboard/find-sitters');
	};

	const handleStatClick = (statId: string) => {
		const route = statRoutes[statId];
		if (route) navigate(route);
	};

	const handleQuickAction = (actionId: string) => {
		const route = actionRoutes[actionId];
		if (route) navigate(route);
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
		navigate(`/dashboard/chat/${appointment.sitterId}`);
	};

	const handleAppointmentDetails = (appointment: Appointment) => {
		navigate(`/dashboard/appointment/${appointment.id}`);
	};

	const handleAppointmentReschedule = (appointment: Appointment) => {
		navigate(`/dashboard/reschedule/${appointment.id}`);
	};

	const handlePetSelect = (petId: string) => {
		if (onPetSelect) onPetSelect(petId);
		navigate(`/dashboard/pet-profile/${petId}`);
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
}
