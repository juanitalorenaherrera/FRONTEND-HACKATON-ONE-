import type { CreatePetRequest, Pet } from '../types';

import { calculateUserStats } from '../utils/petUtils';
import { petService } from '../../../services/petService';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetsContext } from '../hooks/usePetsContext';

/**
 * Hook que encapsula toda la lógica de negocio y efectos secundarios
 * para la feature de mascotas. Es el único lugar que interactúa
 * con los servicios y despacha acciones complejas al contexto.
 */
export function usePetsActions() {
    const { state, dispatch } = usePetsContext();
    const navigate = useNavigate();

    /**
     * Carga la lista inicial de mascotas y calcula sus estadísticas.
     * Requiere el ID de la cuenta. No volverá a cargar si los datos ya existen.
     */
    const loadPets = useCallback(async (accountId: number) => {
        if (state.pets.length > 0 && !state.error) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            // 1. Obtenemos las mascotas para la cuenta específica.
            const pets = await petService.getAllByAccountId(accountId);
            // 2. Calculamos las estadísticas en el cliente con los datos obtenidos.
            const stats = calculateUserStats(pets);
            // 3. Guardamos ambos en el estado global.
            dispatch({ type: 'SET_PETS_DATA', payload: { pets, stats } });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            dispatch({ type: 'SET_ERROR', payload: message });
        }
    }, [dispatch, state.pets.length, state.error]);

    /**
     * Fuerza la recarga de los datos desde la API para una cuenta específica.
     */
    const refreshPets = useCallback(async (accountId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const pets = await petService.getAllByAccountId(accountId);
            const stats = calculateUserStats(pets);
            dispatch({ type: 'SET_PETS_DATA', payload: { pets, stats } });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            dispatch({ type: 'SET_ERROR', payload: message });
        }
    }, [dispatch]);
    
    /**
     * Crea una nueva mascota, actualiza el estado y navega a su perfil.
     */
    const addPet = useCallback(async (petData: CreatePetRequest) => {
    const newPet = await petService.create(petData);
        dispatch({ type: 'ADD_PET_SUCCESS', payload: newPet });
        dispatch({ type: 'HIDE_MODAL' });
        dispatch({ type: 'SET_SELECTED_PET', payload: newPet });
    }, [dispatch]);

    /**
     * Actualiza una mascota existente y actualiza el estado.
     */
    const updatePet = useCallback(async (petId: number, petData: Partial<CreatePetRequest>) => {
    try {
        const updatedPet = await petService.update(petId, petData);
            dispatch({ type: 'UPDATE_PET_SUCCESS', payload: updatedPet });
            dispatch({ type: 'HIDE_MODAL' });
        } catch (error) {
            console.error('Error updating pet:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Error updating pet' });
        }
    }, [dispatch]);

    /**
     * Elimina una mascota, actualiza el estado y navega a la vista principal.
     */
    const deletePet = useCallback(async (petId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
            try {
                await petService.delete(petId);
                dispatch({ type: 'DELETE_PET_SUCCESS', payload: petId });
                // Si eliminamos la mascota, ya no podemos estar en su perfil, volvemos a la lista.
                navigate('/pets');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Error desconocido';
                dispatch({ type: 'SET_ERROR', payload: `No se pudo eliminar: ${message}` });
            }
        }
    }, [dispatch, navigate]);

    // --- Acciones de UI (no asíncronas) ---

    const selectPet = useCallback((pet: Pet | null) => {
        dispatch({ type: 'SET_SELECTED_PET', payload: pet });
    }, [dispatch]);
    
    const showAddPetModal = useCallback(() => {
        dispatch({ type: 'SHOW_MODAL', payload: { type: 'add' } });
    }, [dispatch]);

    const showEditPetModal = useCallback((pet: Pet) => {
        dispatch({ type: 'SHOW_MODAL', payload: { type: 'edit', data: pet } });
    }, [dispatch]);

    const hideModal = useCallback(() => {
        dispatch({ type: 'HIDE_MODAL' });
    }, [dispatch]);


    return {
        loadPets,
        refreshPets,
        addPet,
        updatePet,
        deletePet,
        selectPet,
        showAddPetModal,
        showEditPetModal,
        hideModal,
    };
}