// ===========================================
// sections/MyPets/MyPetsSection.tsx
// ===========================================

import { PawPrint } from 'lucide-react';
import type { Pet } from '../../../../../../types/dashboardData';
import { useNavigate } from 'react-router';
import PetCard from './PetCard';
import React from 'react';

interface MyPetsSectionProps {
	userPets: Pet[];
	onPetSelect?: (petId: string) => void;
	maxVisible?: number;
	className?: string;
}

const MyPetsSection: React.FC<MyPetsSectionProps> = ({
	userPets = [],
	onPetSelect,
	maxVisible = 3,
	className = '',
}) => {
	const hasPets = userPets.length > 0;
	const visiblePets = userPets.slice(0, maxVisible);
	const hasMorePets = userPets.length > maxVisible;
	const navigate = useNavigate();

	const handleAddPet = () => {
		console.log('Navegando a agregar mascota...');
		// Implementar navegación
		navigate('/add-pet')
	};

	const handleViewAllPets = () => {
		console.log('Navegando a ver todas las mascotas...');
		// Implementar navegación
	};

	// Estado vacío - sin mascotas
	if (!hasPets) {
		return (
			<div
				className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
			>
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-bold text-gray-900">
						Mis Mascotas
					</h3>
					<span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
						0
					</span>
				</div>

				<div className="text-center py-8">
					<PawPrint className="w-12 h-12 text-gray-300 mx-auto mb-3" />
					<p className="text-gray-500 mb-4">
						No tienes mascotas registradas
					</p>
					<button
						className="text-orange-600 font-semibold hover:text-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg px-3 py-1"
						onClick={handleAddPet}
					>
						Agregar mascota
					</button>
				</div>
			</div>
		);
	}

	// Estado con mascotas
	return (
		<div
			className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
		>
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-xl font-bold text-gray-900">
					Mis Mascotas
				</h3>
				<span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
					{userPets.length}
				</span>
			</div>

			<div className="space-y-4">
				{visiblePets.map((pet) => (
					<PetCard key={pet.id} pet={pet} onClick={onPetSelect} />
				))}

				{/* Botón para ver todas las mascotas */}
				{hasMorePets && (
					<button
						className="w-full p-4 text-center text-orange-600 hover:bg-orange-50 rounded-xl transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
						onClick={handleViewAllPets}
					>
						Ver todas las mascotas ({userPets.length})
					</button>
				)}

				{/* Botón para agregar nueva mascota */}
				<button
					className="w-full p-4 text-center text-gray-600 hover:bg-gray-50 rounded-xl transition-colors duration-200 font-medium border-2 border-dashed border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
					onClick={handleAddPet}
				>
					<div className="flex items-center justify-center gap-2">
						<PawPrint className="w-4 h-4" />
						<span>Agregar nueva mascota</span>
					</div>
				</button>
			</div>
		</div>
	);
};

export default MyPetsSection;
