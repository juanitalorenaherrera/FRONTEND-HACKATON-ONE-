// src/components/dashboard/DashboardStats.tsx

import {
	AlertCircle,
	Minus,
	TrendingDown,
	TrendingUp,
} from 'lucide-react';
import { useFetchStats } from '../hooks/useFetchStats';
import { getDisplayStats } from '../../../utils/stats';
import { getColorClasses } from '../../../utils/colorClasses';

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * DashboardStats: Componente que muestra estadísticas relevantes en el dashboard de la aplicación.
 *
 * Muestra cuatro estadísticas:
 * - Mascotas Activas: Número de mascotas que tienen al menos una cita programada.
 * - Citas Programadas: Número de citas programadas.
 * - Vacunas al Día: Número de mascotas con vacunas al día.
 * - Recordatorios: Número de recordatorios pendientes.
 *
 * Se utiliza el hook `useEffect` para cargar las estadísticas al montar el componente.
 * Si ocurre un error al cargar las estadísticas, se muestra un mensaje de error.
 * Si las estadísticas se cargan correctamente, se renderiza una lista de componentes
 * que muestan las estadísticas con un diseño personalizado.
 *
 * Propiedades:
 * - Ninguna
 *
 * @returns {JSX.Element} El componente DashboardStats.
 */
/*******  a3c895e5-3eab-488c-926b-959b863b7e9b  *******/

export function DashboardStats() {

	const { stats, isLoading, error } = useFetchStats();

	const getTrendIcon = (change: string) => {
		if (change.includes('+')) return TrendingUp;
		if (change.includes('-')) return TrendingDown;
		return Minus;
	};

	const getTrendColor = (change: string) => {
		if (change.includes('+')) return 'text-green-600 bg-green-100';
		if (change.includes('-')) return 'text-red-600 bg-red-100';
		return 'text-gray-600 bg-gray-100';
	};

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
					>
						<div className="flex items-center justify-between mb-4">
							<div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
							<div className="w-6 h-6 bg-gray-200 rounded"></div>
						</div>
						<div className="space-y-3">
							<div className="h-8 bg-gray-200 rounded w-16"></div>
							<div className="h-4 bg-gray-200 rounded w-24"></div>
							<div className="h-3 bg-gray-200 rounded w-20"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (error || !stats) {
		return (
			<div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
				<AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
				<div>
					<p className="font-semibold text-red-900">
						Error al cargar estadísticas
					</p>
					<p className="text-red-700 text-sm">
						{error || 'Ocurrió un error inesperado.'}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			{getDisplayStats(stats).map((stat, index) => {
				const Icon = stat.icon;
				const TrendIcon = getTrendIcon(stat.change);
				const trendColor = getTrendColor(stat.change);
				const colorClasses = getColorClasses(stat.color);

				return (
					<div
						key={stat.id}
						className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 ${colorClasses.border} ${colorClasses.hover} transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-2xl`}
						style={{
							animationDelay: `${index * 100}ms`,
							animation: 'slideInUp 0.6s ease-out forwards',
						}}
					>
						<div className="flex items-center justify-between mb-4">
							<div
								className={`w-14 h-14 ${colorClasses.bg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 border ${colorClasses.border}`}
							>
								<Icon
									className={`w-7 h-7 ${colorClasses.icon}`}
								/>
							</div>
							<div
								className={`flex items-center gap-1 px-2 py-1 rounded-full ${trendColor} text-xs font-semibold`}
							>
								<TrendIcon className="w-3 h-3" />
								<span>{stat.change.replace(/[+-]/, '')}</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-baseline gap-2">
								<h3 className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
									{stat.value}
								</h3>
								{stat.change.includes('+') && (
									<span className="text-lg text-green-600 font-semibold">
										↗
									</span>
								)}
								{stat.change.includes('-') && (
									<span className="text-lg text-red-600 font-semibold">
										↘
									</span>
								)}
							</div>
							<p className="font-semibold text-gray-700 text-lg group-hover:text-gray-800 transition-colors">
								{stat.title}
							</p>
							<p className="text-sm text-gray-500 leading-relaxed">
								{stat.description}
							</p>
						</div>

						{/* Progress indicator */}
						<div className="mt-4 pt-4 border-t border-gray-100">
							<div className="flex items-center justify-between text-xs">
								<span className="text-gray-600">Estado</span>
								<span
									className={`font-medium ${
										stat.change.includes('+')
											? 'text-green-600'
											: stat.change.includes('-')
											? 'text-red-600'
											: 'text-gray-600'
									}`}
								>
									{stat.change}
								</span>
							</div>
							<div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
								<div
									className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
										stat.color === 'orange'
											? 'bg-gradient-to-r from-orange-500 to-orange-600'
											: stat.color === 'teal'
											? 'bg-gradient-to-r from-teal-500 to-teal-600'
											: stat.color === 'blue'
											? 'bg-gradient-to-r from-blue-500 to-blue-600'
											: 'bg-gradient-to-r from-green-500 to-green-600'
									}`}
									style={{
										width: `${Math.min(
											100,
											Math.max(
												10,
												(parseInt(
													stat.value.toString()
												) /
													10) *
													100
											)
										)}%`,
									}}
								></div>
							</div>
						</div>

						{/* Hover effect overlay */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
					</div>
				);
			})}

			<style type="text/css">
				{`
                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
			</style>
		</div>
	);
}
