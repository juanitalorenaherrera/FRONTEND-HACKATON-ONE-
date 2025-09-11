import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

// Tipos para los datos del dashboard
interface DashboardStats {
	totalUsers: number;
	totalSitters: number;
	totalBookings: number;
	pendingApprovals: number;
	monthlyRevenue: number;
}

interface RecentActivity {
	id: string;
	type: 'booking' | 'registration' | 'approval' | 'complaint';
	message: string;
	timestamp: Date;
	status: 'pending' | 'completed' | 'warning';
}

export default function AdminDashboard() {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [stats, setStats] = useState<DashboardStats>({
		totalUsers: 0,
		totalSitters: 0,
		totalBookings: 0,
		pendingApprovals: 0,
		monthlyRevenue: 0,
	});

	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeSection, setActiveSection] = useState<string>('overview');

	useEffect(() => {
		// Verificar que el usuario sea admin
		if (!user || user.role !== 'admin') {
			navigate('/login');
			return;
		}

		loadDashboardData();
	}, [user, navigate]);

	const loadDashboardData = async () => {
		try {
			setIsLoading(true);

			// Simular carga de datos (reemplazar con llamadas reales a la API)
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Datos mock - reemplazar con llamadas reales a la API
			setStats({
				totalUsers: 1247,
				totalSitters: 89,
				totalBookings: 452,
				pendingApprovals: 12,
				monthlyRevenue: 15840,
			});

			setRecentActivity([
				{
					id: '1',
					type: 'booking',
					message: 'Nueva reserva de María González',
					timestamp: new Date(Date.now() - 1000 * 60 * 30),
					status: 'completed',
				},
				{
					id: '2',
					type: 'registration',
					message: 'Nuevo cuidador registrado: Carlos Ruiz',
					timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
					status: 'pending',
				},
				{
					id: '3',
					type: 'approval',
					message: 'Solicitud de verificación pendiente',
					timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
					status: 'warning',
				},
				{
					id: '4',
					type: 'complaint',
					message: 'Reporte de problema con reserva #234',
					timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
					status: 'warning',
				},
			]);
		} catch (err) {
			setError('Error al cargar los datos del dashboard');
			console.error('Error loading dashboard data:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const getActivityIcon = (type: RecentActivity['type']) => {
		switch (type) {
			case 'booking':
				return '📅';
			case 'registration':
				return '👤';
			case 'approval':
				return '✅';
			case 'complaint':
				return '⚠️';
			default:
				return '📋';
		}
	};

	const getStatusColor = (status: RecentActivity['status']) => {
		switch (status) {
			case 'completed':
				return 'text-green-600 bg-green-100';
			case 'pending':
				return 'text-yellow-600 bg-yellow-100';
			case 'warning':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const formatTimeAgo = (timestamp: Date) => {
		const now = new Date();
		const diffInMinutes = Math.floor(
			(now.getTime() - timestamp.getTime()) / (1000 * 60)
		);

		if (diffInMinutes < 60) {
			return `hace ${diffInMinutes} min`;
		} else if (diffInMinutes < 1440) {
			return `hace ${Math.floor(diffInMinutes / 60)} h`;
		} else {
			return `hace ${Math.floor(diffInMinutes / 1440)} días`;
		}
	};

	if (isLoading) {
		return (
			<div className="p-8 bg-gray-50 min-h-screen">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded mb-6 w-64"></div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className="bg-white p-6 rounded-xl shadow h-32"
							></div>
						))}
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="bg-white p-6 rounded-xl shadow h-96"></div>
						<div className="bg-white p-6 rounded-xl shadow h-96"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8 bg-gray-50 min-h-screen">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6">
					<h2 className="text-lg font-semibold text-red-800 mb-2">
						Error
					</h2>
					<p className="text-red-600">{error}</p>
					<button
						onClick={loadDashboardData}
						className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
					>
						Reintentar
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Panel de Administrador 👩‍💻
				</h1>
				<p className="text-gray-600">
					Bienvenido, {user?.name || 'Admin'}. Gestiona tu plataforma
					desde aquí.
				</p>
			</div>

			{/* Navigation Tabs */}
			<div className="mb-8">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8">
						{[
							{
								key: 'overview',
								label: '📊 Resumen',
								count: null,
							},
							{
								key: 'users',
								label: '👥 Usuarios',
								count: stats.totalUsers,
							},
							{
								key: 'sitters',
								label: '🐕 Cuidadores',
								count: stats.totalSitters,
							},
							{
								key: 'approvals',
								label: '✅ Aprobaciones',
								count: stats.pendingApprovals,
							},
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveSection(tab.key)}
								className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
									activeSection === tab.key
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								{tab.label}
								{tab.count !== null && (
									<span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
										{tab.count}
									</span>
								)}
							</button>
						))}
					</nav>
				</div>
			</div>

			{activeSection === 'overview' && (
				<>
					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
										<span className="text-2xl">👥</span>
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">
										Total Usuarios
									</p>
									<p className="text-2xl font-bold text-gray-900">
										{stats.totalUsers.toLocaleString()}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
										<span className="text-2xl">🐕</span>
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">
										Cuidadores
									</p>
									<p className="text-2xl font-bold text-gray-900">
										{stats.totalSitters}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
										<span className="text-2xl">📅</span>
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">
										Reservas
									</p>
									<p className="text-2xl font-bold text-gray-900">
										{stats.totalBookings}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
										<span className="text-2xl">💰</span>
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">
										Ingresos Mensuales
									</p>
									<p className="text-2xl font-bold text-gray-900">
										${stats.monthlyRevenue.toLocaleString()}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Main Content Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Quick Actions */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Acciones Rápidas
							</h3>
							<div className="space-y-3">
								<button
									onClick={() => setActiveSection('users')}
									className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
								>
									<div className="flex items-center">
										<span className="text-2xl mr-3">
											👤
										</span>
										<div>
											<p className="font-medium text-blue-900">
												Gestionar Usuarios
											</p>
											<p className="text-sm text-blue-600">
												Ver y administrar todos los
												usuarios
											</p>
										</div>
									</div>
								</button>

								<button
									onClick={() => setActiveSection('sitters')}
									className="w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
								>
									<div className="flex items-center">
										<span className="text-2xl mr-3">
											🐕
										</span>
										<div>
											<p className="font-medium text-green-900">
												Gestionar Cuidadores
											</p>
											<p className="text-sm text-green-600">
												Aprobar y administrar cuidadores
											</p>
										</div>
									</div>
								</button>

								<button
									onClick={() =>
										setActiveSection('approvals')
									}
									className="w-full p-4 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors border border-yellow-200"
								>
									<div className="flex items-center">
										<span className="text-2xl mr-3">
											⚠️
										</span>
										<div className="flex justify-between items-center w-full">
											<div>
												<p className="font-medium text-yellow-900">
													Aprobaciones Pendientes
												</p>
												<p className="text-sm text-yellow-600">
													Revisar solicitudes
												</p>
											</div>
											{stats.pendingApprovals > 0 && (
												<span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full">
													{stats.pendingApprovals}
												</span>
											)}
										</div>
									</div>
								</button>

								<button className="w-full p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
									<div className="flex items-center">
										<span className="text-2xl mr-3">
											📊
										</span>
										<div>
											<p className="font-medium text-purple-900">
												Ver Reportes
											</p>
											<p className="text-sm text-purple-600">
												Estadísticas y análisis
											</p>
										</div>
									</div>
								</button>
							</div>
						</div>

						{/* Recent Activity */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									Actividad Reciente
								</h3>
								<button
									onClick={loadDashboardData}
									className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
								>
									Actualizar
								</button>
							</div>

							<div className="space-y-3">
								{recentActivity.length === 0 ? (
									<p className="text-gray-500 text-sm py-4 text-center">
										No hay actividad reciente
									</p>
								) : (
									recentActivity.map((activity) => (
										<div
											key={activity.id}
											className="flex items-start p-3 bg-gray-50 rounded-lg"
										>
											<span className="text-lg mr-3 mt-0.5">
												{getActivityIcon(activity.type)}
											</span>
											<div className="flex-grow min-w-0">
												<p className="text-sm font-medium text-gray-900 mb-1">
													{activity.message}
												</p>
												<p className="text-xs text-gray-500">
													{formatTimeAgo(
														activity.timestamp
													)}
												</p>
											</div>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													activity.status
												)}`}
											>
												{activity.status === 'completed'
													? 'Completado'
													: activity.status ===
													  'pending'
													? 'Pendiente'
													: 'Atención'}
											</span>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</>
			)}

			{/* Placeholder content for other sections */}
			{activeSection !== 'overview' && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
					<div className="text-4xl mb-4">🚧</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Sección en Desarrollo
					</h3>
					<p className="text-gray-600 mb-4">
						La sección "{activeSection}" estará disponible
						próximamente.
					</p>
					<button
						onClick={() => setActiveSection('overview')}
						className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
					>
						Volver al Resumen
					</button>
				</div>
			)}
		</div>
	);
}
