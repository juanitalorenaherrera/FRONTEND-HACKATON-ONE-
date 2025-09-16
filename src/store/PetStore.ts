import { Pet } from '../types/common.types';
import { create } from 'zustand';
import { petService } from '../services/petService';

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPets: () => Promise<void>;
  selectPet: (pet: Pet | null) => void;
  addPet: (pet: Pet) => void;
  updatePet: (updatedPet: Pet) => void;
  removePet: (petId: string) => void;
  clearError: () => void;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  selectedPet: null,
  isLoading: false,
  error: null,

  fetchPets: async () => {
    set({ isLoading: true, error: null });
    try {
      const pets = await petService.getAll();
      set({ pets, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al cargar las mascotas',
        isLoading: false 
      });
    }
  },

  selectPet: (pet: Pet | null) => {
    set({ selectedPet: pet });
  },

  addPet: (pet: Pet) => {
    set((state) => ({
      pets: [...state.pets, pet]
    }));
  },

  updatePet: (updatedPet: Pet) => {
    set((state) => ({
      pets: state.pets.map(pet => 
        pet.id === updatedPet.id ? updatedPet : pet
      ),
      selectedPet: state.selectedPet?.id === updatedPet.id ? updatedPet : state.selectedPet
    }));
  },

  removePet: (petId: string) => {
    set((state) => ({
      pets: state.pets.filter(pet => pet.id !== petId),
      selectedPet: state.selectedPet?.id === petId ? null : state.selectedPet
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));