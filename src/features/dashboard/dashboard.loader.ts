// src/features/dashboard/dashboard.loader.ts

import {
  getDashboardStats,
  getMainDashboardData,
  getRecentSitters,
} from '@/services/dashboardService';

import { getPetsSummary } from '@/services/petService'; // Asumiendo que movimos getPetsSummary a petService

export const dashboardLoader = async () => {
  // 1. Hacemos todas las llamadas en paralelo
  const [stats, mainData, sitters, petsSummary] = await Promise.all([
    getDashboardStats(),
    getMainDashboardData(),
    getRecentSitters(),
    getPetsSummary(),
  ]);

  // 2. Aquí transformamos los datos si es necesario
  const userPets = petsSummary.filter(pet => pet.active);

  // 3. Retornamos un objeto con todo lo que la vista necesita
  return { stats, ...mainData, recentSitters: sitters, userPets };
};