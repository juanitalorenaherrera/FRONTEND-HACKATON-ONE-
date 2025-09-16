import { useState } from 'react';
import { MapPin, DollarSign, Star } from 'lucide-react';
import { useSittersContext } from '../context/SittersContext';
import { SITTER_CONFIG } from '../../../features/sitters/config/sitters.config';
import type { SitterFilters } from '../../../features/sitters/types';

interface AdvancedFiltersProps {
	onClose: () => void;
}

export function AdvancedFilters({ onClose }: AdvancedFiltersProps) {
	// 1. Lee el estado global y las acciones directamente del contexto.
	const { state, actions } = useSittersContext();

	// 2. El estado local se inicializa con los filtros del contexto global.
	const [localFilters, setLocalFilters] = useState<SitterFilters>(
		state.filters
	);

	// Función para manejar cambios en filtros locales
	const handleLocalFilterChange = (key: keyof SitterFilters, value: string | number | boolean | undefined) => {
		setLocalFilters(prev => ({ ...prev, [key]: value }));
	};

	// 3. La función de "Aplicar" ahora despacha una única acción al contexto.
	const handleApply = () => {
		actions.setFilters(localFilters);
		onClose();
	};

	// 4. La función de "Limpiar" ahora usa valores por defecto del config.
	const handleReset = () => {
		// Resetea el estado local a los valores por defecto del ordenamiento
		const defaultFilters = {
			sortBy: SITTER_CONFIG.SORT_OPTIONS[0].sortBy,
			sortDirection: SITTER_CONFIG.SORT_OPTIONS[0].sortDirection,
		};
		setLocalFilters(defaultFilters);

		// Llama a la acción global que hace lo mismo
		actions.clearFilters();
		onClose(); // Cierra el modal después de limpiar
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
				{/* Header (sin cambios) */}
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-bold text-gray-900">
						Filtros Avanzados
					</h3>
					<button
						onClick={onClose}
						className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
					>
						✕
					</button>
				</div>

				{/* Formulario de Filtros */}
				<div className="space-y-6">
					{/* Distancia máxima */}
					<div>
						<label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
							<MapPin className="w-4 h-4" /> Distancia máxima
						</label>
						<div className="flex items-center gap-4">
							<input
								type="range"
								min="1"
								max={SITTER_CONFIG.FILTERS.MAX_DISTANCE}
								value={
									localFilters.maxDistance ||
									SITTER_CONFIG.FILTERS.DEFAULT_RADIUS
								}
								onChange={(e) =>
									handleLocalFilterChange(
										'maxDistance',
										parseInt(e.target.value)
									)
								}
								className="flex-1"
							/>
							<span className="text-sm font-medium w-16 text-gray-600">
								{localFilters.maxDistance ||
									SITTER_CONFIG.FILTERS.DEFAULT_RADIUS}{' '}
								km
							</span>
						</div>
					</div>

					{/* Tarifa máxima por hora */}
					<div>
						<label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
							<DollarSign className="w-4 h-4" /> Tarifa máxima por
							hora
						</label>
						<input
							type="number"
							placeholder="Ej: 15000"
							value={localFilters.maxHourlyRate || ''}
							onChange={(e) =>
								handleLocalFilterChange(
									'maxHourlyRate',
									e.target.value
										? parseInt(e.target.value)
										: undefined
								)
							}
							className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
						/>
					</div>

					{/* Calificación mínima */}
					<div>
						<label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
							<Star className="w-4 h-4" /> Calificación mínima
						</label>
						<div className="flex gap-2">
							{[1, 2, 3, 4, 5].map((rating) => (
								<button
									key={rating}
									onClick={() =>
										handleLocalFilterChange(
											'minRating',
											rating
										)
									}
									className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
										(localFilters.minRating || 0) >= rating
											? 'bg-yellow-500 text-white'
											: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
									}`}
								>
									{rating} ★
								</button>
							))}
						</div>
					</div>

					{/* Especialidades */}
					<div>
						<label className="text-sm font-medium text-gray-700 mb-2 block">
							Especialidades
						</label>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
							{SITTER_CONFIG.SPECIALTIES.map((specialty) => (
								<button
									key={specialty}
									onClick={() =>
										handleLocalFilterChange(
											'specialty',
											localFilters.specialty === specialty
												? undefined
												: specialty
										)
									}
									className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
										localFilters.specialty === specialty
											? 'bg-orange-500 text-white font-semibold'
											: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
									}`}
								>
									{specialty}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Acciones (la lógica ahora apunta a las acciones del contexto) */}
				<div className="flex gap-3 mt-8 pt-6 border-t">
					<button
						onClick={handleReset}
						className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
					>
						Limpiar Todo
					</button>
					<button
						onClick={handleApply}
						className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium"
					>
						Aplicar Filtros
					</button>
				</div>
			</div>
		</div>
	);
}
