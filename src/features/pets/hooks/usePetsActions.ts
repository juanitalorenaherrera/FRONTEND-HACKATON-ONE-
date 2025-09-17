import type { CreatePetRequest, Pet } from '@/features/pets/types';

import { calculateUserStats } from '@/features/pets/utils/petUtils';
import {
	getPetsByAccountId,
	createPet,
	updatePet,
	deletePet as deletePetService,
} from '@/services/petService';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { usePetsStore } from '@/store/PetStore';
import { Type } from '@/types/petStore';
/**
 * Hook que encapsula toda la lógica de negocio y efectos secundarios
 * para la feature de mascotas. Es el único lugar que interactúa
 * con los servicios y despacha acciones complejas al contexto.
 */
export function usePetsActions() {
	const pets = usePetsStore((state) => state.pets);
	const error = usePetsStore((state) => state.error);
	const setPetsData = usePetsStore((state) => state.setPetsData);
	const setLoading = usePetsStore((state) => state.setLoading);
	const setError = usePetsStore((state) => state.setError);
	const addPetSuccess = usePetsStore((state) => state.addPet);
	const updatePetSuccess = usePetsStore((state) => state.updatePet);
	const deletePetSuccess = usePetsStore((state) => state.deletePet);
	const setSelectedPet = usePetsStore((state) => state.setSelectedPet);
	const showModal = usePetsStore((state) => state.showModal);
	const hideModal = usePetsStore((state) => state.hideModal);
	const navigate = useNavigate();
	/**
	 * Carga la lista inicial de mascotas y calcula sus estadísticas.
	 * Requiere el ID de la cuenta. No volverá a cargar si los datos ya existen.
	 */
	const loadPets = useCallback(
		async (accountId: number) => {
			if (pets.length > 0 && !error) return;

			setLoading(true);
			try {
				// 1. Obtenemos las mascotas para la cuenta específica.
				const petsData = await getPetsByAccountId(accountId);
				// 2. Calculamos las estadísticas en el cliente con los datos obtenidos.
				const stats = calculateUserStats(petsData);
				// 3. Guardamos ambos en el estado global.
				setPetsData({ pets: petsData, stats });
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: 'Error desconocido';
				setError(message);
			}
		},
		[pets.length, error, setLoading, setPetsData, setError]
	);
	/**
	 * Fuerza la recarga de los datos desde la API para una cuenta específica.
	 */
	const refreshPets = useCallback(
		async (accountId: number) => {
			setLoading(true);
			try {
				const petsData = await getPetsByAccountId(accountId);
				const stats = calculateUserStats(petsData);
				setPetsData({ pets: petsData, stats });
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: 'Error desconocido';
				setError(message);
			}
		},
		[setLoading, setPetsData, setError]
	);

	/**
	 * Crea una nueva mascota, actualiza el estado y navega a su perfil.
	 */
	const addPet = useCallback(
		async (petData: CreatePetRequest) => {
			const newPet = await createPet(
				petData.accountId,
				petData.name,
				petData.species,
				petData.breed,
				petData.age,
				petData.weight,
				petData.color,
				petData.medications,
				petData.allergies,
				petData.specialNotes
			);
			addPetSuccess(newPet as Pet);
			hideModal();
			setSelectedPet(newPet as Pet);
		},
		[addPetSuccess, hideModal, setSelectedPet]
	);
	/**
	 * Actualiza una mascota existente y actualiza el estado.
	 */
	const updatePetAction = useCallback(
		async (petId: number, petData: Partial<CreatePetRequest>) => {
			try {
				const updatedPet = await updatePet(
					petId,
					petData as CreatePetRequest
				);
				updatePetSuccess(updatedPet);
				hideModal();
			} catch (error) {
				console.error('Error updating pet:', error);
				setError('Error updating pet');
			}
		},
		[updatePetSuccess, hideModal, setError]
	);
	/**
	 * Elimina una mascota, actualiza el estado y navega a la vista principal.
	 */
	const deletePet = useCallback(
		async (petId: number) => {
			if (
				window.confirm(
					'¿Estás seguro de que quieres eliminar esta mascota?'
				)
			) {
				try {
					await deletePetService(petId);
					deletePetSuccess(petId);
					// Si eliminamos la mascota, ya no podemos estar en su perfil, volvemos a la lista.
					navigate('/pets');
				} catch (error) {
					const message =
						error instanceof Error
							? error.message
							: 'Error desconocido';
					setError(`createPetNo se pudo eliminar: ${message}`);
				}
			}
		},
		[deletePetSuccess, setError, navigate]
	);
	// --- Acciones de UI (no asíncronas) ---
	const selectPet = useCallback(
		(pet: Pet | null) => {
			setSelectedPet(pet);
		},
		[setSelectedPet]
	);

	const showAddPetModal = useCallback(() => {
		showModal(Type.ADD);
	}, [showModal]);

	const showEditPetModal = useCallback(
		(pet: Pet) => {
			showModal(Type.EDIT, pet);
		},
		[showModal]
	);

	const hideModalAction = useCallback(() => {
		hideModal();
	}, [hideModal]);

	return {
		loadPets,
		refreshPets,
		addPet,
		updatePet: updatePetAction,
		deletePet,
		selectPet,
		showAddPetModal,
		showEditPetModal,
		hideModal: hideModalAction,
	};
}
