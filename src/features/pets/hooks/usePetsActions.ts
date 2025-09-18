import type { CreatePetRequest, Pet } from '../types';
import {
	createPet,
	deletePet as deletePetService,
	getPetsByAccountId,
	updatePet as updatePetService,
} from '../../../services/petService';

import { Type } from '../../../types/petStore';
import { calculateUserStats } from '../utils/petUtils';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { usePetsStore } from '../../../store/PetStore';

export function usePetsActions() {
	const pets = usePetsStore((state) => state.pets);
	const error = usePetsStore((state) => state.error);
	const navigate = useNavigate();

	const loadPets = useCallback(
		async (accountId: number) => {
			if (pets.length > 0 && !error) return;

			// Usamos getState() para no crear dependencias inestables
			const { setLoading, setPetsData, setError } =
				usePetsStore.getState();
			setLoading(true);
			try {
				const petsData = await getPetsByAccountId(accountId);
				const stats = calculateUserStats(petsData);
				setPetsData({ pets: petsData, stats });
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'Error desconocido al cargar mascotas';
				setError(message);
			}
		},
		[pets.length, error] // Dependencias mínimas y estables
	);

    // ... (resto de las funciones refactorizadas como en el mensaje anterior)
    const refreshPets = useCallback(async (accountId: number) => {
		const { setLoading, setPetsData, setError } = usePetsStore.getState();
		setLoading(true);
		try {
			const petsData = await getPetsByAccountId(accountId);
			const stats = calculateUserStats(petsData);
			setPetsData({ pets: petsData, stats });
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Error desconocido al refrescar';
			setError(message);
		}
	}, []);

	const addPet = useCallback(
        async (petData: CreatePetRequest) => {
            const { addPet, hideModal, setSelectedPet, setError } =
                usePetsStore.getState();
            try {
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
                addPet(newPet as Pet);
                hideModal();
                setSelectedPet(newPet as Pet);
                
                // ✅ AÑADE ESTA LÍNEA
                return newPet; 

            } catch (err) {
                console.error('Error al crear la mascota:', err);
                setError('No se pudo crear la mascota.');
                // Relanza el error para que el 'catch' en la vista pueda manejarlo
                throw err;
            }
        }, []);

	const updatePetAction = useCallback(
		async (petId: number, petData: Partial<CreatePetRequest>) => {
			const { updatePet, hideModal, setError } = usePetsStore.getState();
			try {
				const updatedPet = await updatePetService(
					petId,
					petData as CreatePetRequest
				);
				updatePet(updatedPet);
				hideModal();
			} catch (err) {
				console.error('Error al actualizar la mascota:', err);
				setError('No se pudo actualizar la mascota.');
			}
		},
		[]
	);

	const deletePet = useCallback(
		async (petId: number) => {
			if (
				window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')
			) {
				const { deletePet, setError } = usePetsStore.getState();
				try {
					await deletePetService(petId);
					deletePet(petId);
					navigate('/pets');
				} catch (err) {
					const message =
						err instanceof Error ? err.message : 'Error desconocido';
					setError(`No se pudo eliminar: ${message}`);
				}
			}
		},
		[navigate]
	);

	const selectPet = useCallback((pet: Pet | null) => {
		usePetsStore.getState().setSelectedPet(pet);
	}, []);

	const showAddPetModal = useCallback(() => {
		usePetsStore.getState().showModal(Type.ADD);
	}, []);

	const showEditPetModal = useCallback((pet: Pet) => {
		usePetsStore.getState().showModal(Type.EDIT, pet);
	}, []);

	const hideModalAction = useCallback(() => {
		usePetsStore.getState().hideModal();
	}, []);

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