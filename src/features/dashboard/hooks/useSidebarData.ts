// src/features/dashboard/hooks/useSidebarData.ts

import { useCallback, useEffect, useState } from 'react';

import type { Pet } from '../../../types/pets';
import { getPetsByAccountId } from '../../../services/petService';
import { useAuthStore } from '../../../store/AuthStore';

interface SidebarStats {
  totalPets: number;
  activePets: number;
  inactivePets: number;
  recentPets: number;
}

interface UseSidebarDataReturn {
  pets: Pet[];
  stats: SidebarStats;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook optimizado para obtener solo los datos necesarios para el sidebar
 * No carga datos innecesarios como estadísticas completas
 */
export function useSidebarData(): UseSidebarDataReturn {
  const user = useAuthStore((state) => state.profile);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = useCallback((petsData: Pet[]): SidebarStats => {
    const totalPets = petsData.length;
    const activePets = petsData.filter(pet => pet.active).length;
    const inactivePets = totalPets - activePets;
    
    // Mascotas registradas en los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPets = petsData.filter(pet => {
      const createdAt = new Date(pet.createdAt);
      return createdAt >= thirtyDaysAgo;
    }).length;

    return {
      totalPets,
      activePets,
      inactivePets,
      recentPets,
    };
  }, []);

  const loadSidebarData = useCallback(async () => {
    if (!user?.accountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const petsData = await getPetsByAccountId(user.accountId);
      setPets(petsData);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Error al cargar datos del sidebar';
      setError(errorMessage);
      console.error('Error loading sidebar data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.accountId]);

  // Cargar datos automáticamente cuando el usuario esté disponible
  useEffect(() => {
    if (user?.accountId && pets.length === 0 && !error) {
      loadSidebarData();
    }
  }, [user?.accountId, pets.length, error, loadSidebarData]);

  const stats = calculateStats(pets);

  return {
    pets,
    stats,
    isLoading,
    error,
    refetch: loadSidebarData,
  };
}