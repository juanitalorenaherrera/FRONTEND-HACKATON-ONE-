// src/features/dashboard/components/DashboardSidebar.tsx
// Versión optimizada usando hook específico para sidebar

import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../../../utils/NavItems';
import { useAuthStore } from '../../../store/AuthStore';
import { useSidebarData } from '../hooks/useSidebarData';

interface ClientSidebarProps {
	activeItem: string;
}

export function ClientSidebar({ activeItem }: ClientSidebarProps) {
	// Datos de autenticación
	const user = useAuthStore((state) => state.profile);
	
	// Hook optimizado para sidebar
	const { 
		pets, 
		stats, 
		isLoading,
		error 
	} = useSidebarData();

	return (
		<aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
			{/* Logo y título */}
			<div className="p-6 border-b border-gray-100">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
						<span className="text-white font-bold text-lg">🐾</span>
					</div>
					<div>
						<h2 className="text-lg font-bold text-gray-900">PetCare</h2>
						<p className="text-xs text-gray-500">Dashboard</p>
					</div>
				</div>
			</div>

			{/* Menú de Navegación */}
			<nav className="flex-1 p-4">
				<div className="space-y-1">
					{NAV_ITEMS.map((item) => {
						const Icon = item.icon;
						const isActive = activeItem === item.id;

						// Determinar si mostrar badge/contador
						let badgeCount: number | null = null;
						if (item.id === 'pets' && !isLoading && !error) {
							badgeCount = stats.totalPets;
						}

						return (
							<Link
								key={item.id}
								to={item.path}
								className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors group ${
									isActive
										? 'bg-orange-50 text-orange-700 font-bold'
										: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
								}`}
							>
								<div className="flex items-center gap-3">
									<Icon
										className={`w-5 h-5 ${
											isActive
												? 'text-orange-600'
												: 'text-gray-400 group-hover:text-gray-600'
										}`}
									/>
									<span>{item.label}</span>
								</div>

								{/* Badge con contador */}
								{badgeCount !== null && badgeCount > 0 && (
									<span className={`text-xs font-semibold px-2 py-1 rounded-full ${
										isActive 
											? 'bg-orange-200 text-orange-800'
											: 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
									}`}>
										{badgeCount}
									</span>
								)}
							</Link>
						);
					})}
				</div>
			</nav>

			{/* Pie de Página con Perfil de Usuario */}
			<div className="p-4 border-t border-gray-100 mt-auto">
				{user ? (
					<div className="p-3 rounded-lg bg-gray-50">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
								<span className="text-white font-bold text-xs">
									{user.firstName?.charAt(0)}
									{user.lastName?.charAt(0)}
								</span>
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-semibold text-gray-900 text-sm truncate">
									{`${user.firstName} ${user.lastName}`}
								</p>
								<p className="text-xs text-gray-500 capitalize">
									{user.role?.toLowerCase()}
								</p>
							</div>
							<div
								className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"
								title="Online"
							></div>
						</div>

						{/* Estadísticas rápidas */}
						<div className="mt-3 grid grid-cols-2 gap-2 text-center">
							{/* Total de mascotas */}
							<div className="bg-orange-100 rounded-lg p-2">
								{isLoading ? (
									<div className="animate-pulse">
										<div className="h-5 bg-orange-200 rounded mb-1"></div>
										<div className="h-3 bg-orange-200 rounded"></div>
									</div>
								) : error ? (
									<>
										<p className="text-lg font-bold text-red-600">!</p>
										<p className="text-xs text-red-700">Error</p>
									</>
								) : (
									<>
										<p className="text-lg font-bold text-orange-600">
											{stats.totalPets}
										</p>
										<p className="text-xs text-orange-700">
											{stats.totalPets === 1 ? 'Mascota' : 'Mascotas'}
										</p>
									</>
								)}
							</div>

							{/* Mascotas activas */}
							<div className="bg-green-100 rounded-lg p-2">
								{isLoading ? (
									<div className="animate-pulse">
										<div className="h-5 bg-green-200 rounded mb-1"></div>
										<div className="h-3 bg-green-200 rounded"></div>
									</div>
								) : error ? (
									<>
										<p className="text-lg font-bold text-red-600">!</p>
										<p className="text-xs text-red-700">Error</p>
									</>
								) : (
									<>
										<p className="text-lg font-bold text-green-600">
											{stats.activePets}
										</p>
										<p className="text-xs text-green-700">Activas</p>
									</>
								)}
							</div>
						</div>

						{/* Indicador de mascotas recientes */}
						{!isLoading && !error && stats.recentPets > 0 && (
							<div className="mt-2 text-center">
								<p className="text-xs text-blue-600">
									+{stats.recentPets} este mes
								</p>
							</div>
						)}

						{/* Mensaje de error discreto */}
						{error && (
							<div className="mt-2 text-center">
								<p className="text-xs text-red-600">
									Error al cargar datos
								</p>
							</div>
						)}
					</div>
				) : (
					// Skeleton cuando no hay usuario
					<div className="p-3 rounded-lg bg-gray-50">
						<div className="animate-pulse">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
								<div className="flex-1">
									<div className="h-4 bg-gray-200 rounded mb-1"></div>
									<div className="h-3 bg-gray-200 rounded w-2/3"></div>
								</div>
							</div>
							<div className="mt-3 grid grid-cols-2 gap-2">
								<div className="bg-gray-200 rounded-lg h-12"></div>
								<div className="bg-gray-200 rounded-lg h-12"></div>
							</div>
						</div>
					</div>
				)}
			</div>
		</aside>
	);
}