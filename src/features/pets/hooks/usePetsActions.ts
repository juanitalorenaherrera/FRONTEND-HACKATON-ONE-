// src/features/pets/hooks/usePetsActions.ts
// Refactorización del hook original para eliminar dependencias de PetStore

import type { CreatePetRequest, Pet, PetStats } from '../../../types/pets';
import {
	createPet,
	deletePet as deletePetService,
	getPetsByAccountId,
	updatePet,
} from '../../../services/petService';
import { useCallback, useState } from 'react';

import { calculateUserStats } from '../utils/petUtils';
import { useNavigate } from 'react-router-dom';

/**
 * Hook que encapsula toda la lógica de negocio y efectos secundarios
 * para la feature de mascotas. Refactorizado para NO usar PetStore.
 */
export function usePetsActions() {
	// Estado local en lugar de store
	const [pets, setPets] = useState<Pet[]>([]);
	const [stats, setStats] = useState<PetStats | null>(null);
	const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setLoading] = useState(false);
	const [modalState, setModalState] = useState<{
		isOpen: boolean;
		type: 'ADD' | 'EDIT' | null;
		pet: Pet | null;
	}>({
		isOpen: false,
		type: null,
		pet: null
	});

	const navigate = useNavigate();

	/**
	 * Carga la lista inicial de mascotas y calcula sus estadísticas.
	 * Requiere el ID de la cuenta. No volverá a cargar si los datos ya existen.
	 */
	const loadPets = useCallback(
		async (accountId: number) => {
			if (pets.length > 0 && !error) return;

			setLoading(true);
			setError(null);
			
			try {
				// 1. Obtenemos las mascotas para la cuenta específica.
				const petsData = await getPetsByAccountId(accountId);
				// 2. Calculamos las estadísticas en el cliente con los datos obtenidos.
				const calculatedStats = calculateUserStats(petsData);
				// 3. Guardamos ambos en el estado local.
				setPets(petsData);
				setStats(calculatedStats);
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: 'Error desconocido';
				setError(message);
			} finally {
				setLoading(false);
			}
		},
		[pets.length, error]
	);

	/**
	 * Fuerza la recarga de los datos desde la API para una cuenta específica.
	 */
	const refreshPets = useCallback(
		async (accountId: number) => {
			setLoading(true);
			setError(null);
			
			try {
				const petsData = await getPetsByAccountId(accountId);
				const calculatedStats = calculateUserStats(petsData);
				setPets(petsData);
				setStats(calculatedStats);
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: 'Error desconocido';
				setError(message);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	/**
	 * Crea una nueva mascota, actualiza el estado y navega a su perfil.
	 */
	const addPet = useCallback(
		async (petData: CreatePetRequest) => {
			setLoading(true);
			setError(null);

			try {
				// Mantener compatibilidad con la función original que usa parámetros individuales
				const newPet = await createPet(petData);
				
				// Actualizar estado local
				setPets(prev => [...prev, newPet]);
				setSelectedPet(newPet);
				
				// Recalcular stats
				const updatedPets = [...pets, newPet];
				setStats(calculateUserStats(updatedPets));
				
				// Cerrar modal
				setModalState({ isOpen: false, type: null, pet: null });
				
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: 'Error al crear la mascota';
				setError(message);
			} finally {
				setLoading(false);
			}
		},
		[pets]
	);

	/**
	 * Actualiza una mascota existente y actualiza el estado.
	 */
	const updatePetAction = useCallback(
		async (petId: number, petData: Partial<CreatePetRequest>) => {
			setLoading(true);
			setError(null);

			try {
				const updatedPet = await updatePet(
					petId,
					petData as any // Se mantiene el cast para compatibilidad
				);
				
				// Actualizar en el estado local
				setPets(prev => prev.map(pet => 
					pet.id === petId ? updatedPet : pet
				));
				
				// Actualizar mascota seleccionada si corresponde
				if (selectedPet?.id === petId) {
					setSelectedPet(updatedPet);
				}
				
				// Recalcular stats
				const updatedPets = pets.map(pet => 
					pet.id === petId ? updatedPet : pet
				);
				setStats(calculateUserStats(updatedPets));
				
				// Cerrar modal
				setModalState({ isOpen: false, type: null, pet: null });
				
			} catch (error) {
				console.error('Error updating pet:', error);
				setError('Error updating pet');
			} finally {
				setLoading(false);
			}
		},
		[pets, selectedPet]
	);

	/**
	 * Elimina una mascota, actualiza el estado y navega a la vista principal.
	 */
	const deletePet = useCallback(
		async (petId: number) => {
			if (
				!window.confirm(
					'¿Estás seguro de que quieres eliminar esta mascota?'
				)
			) {
				return;
			}
			
			setLoading(true);
			setError(null);

			try {
				await deletePetService(petId);
				
				// Actualizar estado local
				const updatedPets = pets.filter(pet => pet.id !== petId);
				setPets(updatedPets);
				
				// Limpiar selección si eliminamos la mascota seleccionada
				if (selectedPet?.id === petId) {
					setSelectedPet(null);
				}
				
				// Recalcular stats
				setStats(calculateUserStats(updatedPets));
				
				// Si eliminamos la mascota, ya no podemos estar en su perfil, volvemos a la lista.
				navigate('/pets');
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: 'Error desconocido';
				setError(`No se pudo eliminar: ${message}`);
			} finally {
				setLoading(false);
			}
		},
		[pets, selectedPet, navigate]
	);

	// --- Acciones de UI (no asíncronas) ---
	const selectPet = useCallback(
		(pet: Pet | null) => {
			setSelectedPet(pet);
		},
		[]
	);

	const showAddPetModal = useCallback(() => {
		setModalState({ 
			isOpen: true, 
			type: 'ADD', 
			pet: null 
		});
	}, []);

	const showEditPetModal = useCallback(
		(pet: Pet) => {
			setModalState({ 
				isOpen: true, 
				type: 'EDIT', 
				pet 
			});
		},
		[]
	);

	const hideModal = useCallback(() => {
		setModalState({ 
			isOpen: false, 
			type: null, 
			pet: null 
		});
	}, []);

	return {
		// Estado
		pets,
		stats,
		selectedPet,
		error,
		isLoading,
		modalState,
		
		// Acciones de datos
		loadPets,
		refreshPets,
		addPet,
		updatePet: updatePetAction,
		deletePet,
		
		// Acciones de UI
		selectPet,
		showAddPetModal,
		showEditPetModal,
		hideModal,
	};
}