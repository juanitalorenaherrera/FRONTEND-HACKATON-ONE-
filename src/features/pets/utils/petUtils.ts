// src/features/pets/utils/petUtils.ts

import type { Pet, PetStats } from '../../../types/pets';

/**
 * Calcula estadísticas para un array de mascotas
 */
export function calculateUserStats(pets: Pet[]): PetStats {
  if (!pets || pets.length === 0) {
    return {
      totalPets: 0,
      activePets: 0,
      inactivePets: 0,
      petsBySpecies: {},
      petsByGender: {},
      petsByAgeRange: {},
      accountsWithPets: 0,
      averagePetsPerAccount: 0,
      petsRegisteredLast30Days: 0,
      petsRegisteredLast7Days: 0,
    };
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Contadores básicos
  const totalPets = pets.length;
  const activePets = pets.filter(pet => pet.active).length;
  const inactivePets = totalPets - activePets;

  // Agrupación por especie
  const petsBySpecies: Record<string, number> = {};
  pets.forEach(pet => {
    const species = pet.species || 'Sin especificar';
    petsBySpecies[species] = (petsBySpecies[species] || 0) + 1;
  });

  // Agrupación por género
  const petsByGender: Record<string, number> = {};
  pets.forEach(pet => {
    const gender = pet.gender || 'Sin especificar';
    petsByGender[gender] = (petsByGender[gender] || 0) + 1;
  });

  // Agrupación por rangos de edad
  const petsByAgeRange: Record<string, number> = {};
  pets.forEach(pet => {
    let ageRange: string;
    const age = pet.age || 0;
    
    if (age === 0) {
      ageRange = 'Cachorro (< 1 año)';
    } else if (age <= 2) {
      ageRange = 'Joven (1-2 años)';
    } else if (age <= 7) {
      ageRange = 'Adulto (3-7 años)';
    } else {
      ageRange = 'Senior (8+ años)';
    }
    
    petsByAgeRange[ageRange] = (petsByAgeRange[ageRange] || 0) + 1;
  });

  // Cuentas únicas (basado en accountId)
  const uniqueAccounts = new Set(pets.map(pet => pet.accountId));
  const accountsWithPets = uniqueAccounts.size;
  const averagePetsPerAccount = accountsWithPets > 0 ? totalPets / accountsWithPets : 0;

  // Mascotas registradas en los últimos días
  const petsRegisteredLast30Days = pets.filter(pet => {
    const createdAt = new Date(pet.createdAt);
    return createdAt >= thirtyDaysAgo;
  }).length;

  const petsRegisteredLast7Days = pets.filter(pet => {
    const createdAt = new Date(pet.createdAt);
    return createdAt >= sevenDaysAgo;
  }).length;

  return {
    totalPets,
    activePets,
    inactivePets,
    petsBySpecies,
    petsByGender,
    petsByAgeRange,
    accountsWithPets,
    averagePetsPerAccount,
    petsRegisteredLast30Days,
    petsRegisteredLast7Days,
  };
}

/**
 * Obtiene el color para mostrar el estado de una mascota
 */
export function getPetStatusColor(active: boolean): string {
  return active ? 'text-green-600' : 'text-red-600';
}

/**
 * Obtiene el texto del estado de una mascota
 */
export function getPetStatusText(active: boolean): string {
  return active ? 'Activa' : 'Inactiva';
}

/**
 * Formatea la edad de una mascota
 */
export function formatPetAge(age: number): string {
  if (age === 0) return 'Cachorro';
  if (age === 1) return '1 año';
  return `${age} años`;
}

/**
 * Formatea el peso de una mascota
 */
export function formatPetWeight(weight?: number): string {
  if (!weight) return 'No especificado';
  return `${weight} kg`;
}

/**
 * Obtiene el ícono apropiado para una especie
 */
export function getSpeciesIcon(species: string): string {
  const speciesLower = species.toLowerCase();
  
  if (speciesLower.includes('perro') || speciesLower.includes('dog')) {
    return '🐕';
  }
  if (speciesLower.includes('gato') || speciesLower.includes('cat')) {
    return '🐱';
  }
  if (speciesLower.includes('ave') || speciesLower.includes('bird') || speciesLower.includes('pájaro')) {
    return '🐦';
  }
  if (speciesLower.includes('pez') || speciesLower.includes('fish')) {
    return '🐠';
  }
  if (speciesLower.includes('hamster') || speciesLower.includes('hámster')) {
    return '🐹';
  }
  if (speciesLower.includes('conejo') || speciesLower.includes('rabbit')) {
    return '🐰';
  }
  
  return '🐾'; // Ícono genérico para mascotas
}

/**
 * Genera una URL de avatar genérico para una mascota basado en su nombre
 */
export function generatePetAvatar(petName: string): string {
  // Usando DiceBear API para generar avatares consistentes
  const encodedName = encodeURIComponent(petName);
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodedName}&backgroundColor=fff2e6,fef3c7,fde68a&radius=50`;
}

/**
 * Obtiene la URL de imagen para una mascota basada en especie y raza
 */
export function getPetImageUrl(species: string, breed?: string): string {
  // URLs placeholder para diferentes especies
  const speciesLower = species.toLowerCase();
  
  if (speciesLower.includes('perro') || speciesLower.includes('dog')) {
    return `https://dog.ceo/api/breeds/image/random`;
  }
  if (speciesLower.includes('gato') || speciesLower.includes('cat')) {
    return `https://api.thecatapi.com/v1/images/search`;
  }
  
  // Fallback a una imagen genérica
  return `https://via.placeholder.com/150x150/f3f4f6/6b7280?text=${getSpeciesIcon(species)}`;
}

/**
 * Obtiene información del estado de una mascota para mostrar indicadores visuales
 */
export function getPetStatusInfo(pet: Pet): {
  isNew: boolean;
  needsAttention: boolean;
  hasSpecialNeeds: boolean;
  ageCategory: 'puppy' | 'young' | 'adult' | 'senior';
} {
  const now = new Date();
  const createdAt = new Date(pet.createdAt);
  const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determinar si es nueva (menos de 7 días)
  const isNew = daysSinceCreated <= 7;
  
  // Determinar categoría de edad
  let ageCategory: 'puppy' | 'young' | 'adult' | 'senior';
  const age = pet.age || 0;
  
  if (age === 0) {
    ageCategory = 'puppy';
  } else if (age <= 2) {
    ageCategory = 'young';
  } else if (age <= 7) {
    ageCategory = 'adult';
  } else {
    ageCategory = 'senior';
  }
  
  // Determinar si necesita atención (mascota inactiva, senior, o con necesidades especiales)
  const needsAttention = !pet.active || ageCategory === 'senior';
  
  // Determinar si tiene necesidades especiales (basado en notas o condiciones médicas)
  // Esto es un ejemplo - ajusta según tu modelo de datos

  
  return {
    isNew,
    needsAttention,
    hasSpecialNeeds,
    ageCategory
  };
}