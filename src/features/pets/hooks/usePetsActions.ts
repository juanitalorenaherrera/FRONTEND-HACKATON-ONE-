import { CreatePetRequest, Pet } from '@/types/pets.types';
import { useCallback, useState } from 'react';

import { petService } from '@/services/petService';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/AuthStore';
import { usePetStore } from '@/store/PetStore'; // Usaremos un store de Zustand para los datos

export const usePetsActions = () => {
  // Conectamos con los stores de Zustand
  const { user } = useAuthStore();
  const { pets, stats, setPets, setStats, addPet, updatePet, removePet } = usePetStore();

  // Estados locales para la UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'add' as 'add' | 'edit', pet: null as Pet | null });

  // --- ACCIONES DE DATOS ---

  const loadPets = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      // Hacemos las dos llamadas a la API en paralelo para más eficiencia
      const [petsData, statsData] = await Promise.all([
        petService.getPetsByUserId(user.id),
        petService.getPetStatsByUserId(user.id)
      ]);
      setPets(petsData);
      setStats(statsData);
    } catch (err) {
      const errorMessage = "No se pudieron cargar los datos de las mascotas.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, setPets, setStats]);

  const handleCreatePet = async (petData: CreatePetRequest) => {
    const promise = petService.createPet(petData).then((newPet) => {
      addPet(newPet); // Actualización optimista en el store
      hideModal();
      return `¡${newPet.name} ha sido añadido exitosamente!`;
    });
    toast.promise(promise, {
      loading: 'Añadiendo mascota...',
      success: (message) => message,
      error: 'Error al añadir la mascota.',
    });
  };
  
  const handleUpdatePet = async (petId: number, petData: Pet) => {
    const promise = petService.updatePet(petId, petData).then((updatedPet) => {
      updatePet(updatedPet); // Actualización optimista
      hideModal();
      return `¡Los datos de ${updatedPet.name} se actualizaron!`;
    });
     toast.promise(promise, {
      loading: 'Actualizando datos...',
      success: (message) => message,
      error: 'Error al actualizar la mascota.',
    });
  };
  
  const handleDeletePet = async (petId: number) => {
    const promise = petService.deletePet(petId).then(() => {
        removePet(petId); // Actualización optimista
        return 'Mascota eliminada correctamente.';
    });
    toast.promise(promise, {
        loading: 'Eliminando mascota...',
        success: (message) => message,
        error: 'Error al eliminar la mascota.',
    });
  };

  // --- MANEJO DE MODALES ---
  const showAddModal = () => setModalState({ isOpen: true, type: 'add', pet: null });
  const showEditModal = (pet: Pet) => setModalState({ isOpen: true, type: 'edit', pet });
  const hideModal = () => setModalState({ isOpen: false, type: 'add', pet: null });

  return {
    // Estado
    pets,
    stats,
    isLoading,
    error,
    modalState,
    // Acciones
    loadPets,
    handleCreatePet,
    handleUpdatePet,
    handleDeletePet,
    showAddModal,
    showEditModal,
    hideModal,
  };
};