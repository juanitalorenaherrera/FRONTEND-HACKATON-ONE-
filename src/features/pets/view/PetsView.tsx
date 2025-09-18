// features/pets/pages/PetsView.tsx - VERSIÓN FINAL Y CORRECTA

import { Outlet } from 'react-router';
import { useAuthStore } from '../../../store/AuthStore';
import { useEffect } from 'react';
import { usePetsActions } from '../hooks/usePetsActions';
import { usePetsStore } from '../../../store/PetStore';

function PetsViewContent() {
	const isLoading = usePetsStore((state) => state.isLoading);
	const { loadPets } = usePetsActions();
	const user = useAuthStore((state) => state.profile);

	useEffect(() => {
		if (user?.id && isLoading) {
			loadPets(user.id);
		}
	}, [user, isLoading, loadPets]);

	if (!user) {
		return (
			<div className="...">
				Por favor, inicia sesión para ver tus mascotas.
			</div>
		);
	}

	// El renderizado ahora es simple. Solo contiene el layout y el Outlet.
	return (
		<div className="container mx-auto p-4 md:p-8">
			<header className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Mis Mascotas
				</h1>
				<p className="text-gray-600">
					Gestiona la información y cuidado de tus compañeros peludos.
				</p>
			</header>
			<main>
				{/* El router se encarga de poner PetsOverview o PetProfile aquí */}
				<Outlet />
			</main>
		</div>
	);
}

export function PetsView() {
	return <PetsViewContent />;
}
