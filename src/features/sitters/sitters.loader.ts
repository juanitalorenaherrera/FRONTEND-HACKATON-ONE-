// src/features/sitters/sitters.loader.ts

import { mapProfileToExtendedSitter } from './utils/sitterUtils'; // Importamos el mapper
import { searchSitters } from '@/services/sitterService';

export const findSittersLoader = async ({ request }: { request: Request }) => {
  // 1. Leemos los parámetros de búsqueda desde la URL
  // ej: /find-sitters?location=Santiago&minRating=4
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());

  // 2. Llamamos a nuestro servicio SIMPLIFICADO, pasando los filtros.
  // El servicio se encargará de enviarlos al backend.
  const sitterProfilesFromApi = await searchSitters(searchParams);

  // 3. Aquí, en el loader, transformamos los datos crudos de la API
  // a la forma que nuestros componentes de UI necesitan.
  const sittersForUI = sitterProfilesFromApi.map(mapProfileToExtendedSitter);

  // 4. Devolvemos los datos listos para ser usados, y también los filtros
  // iniciales para que la UI de búsqueda pueda reflejarlos.
  return { sitters: sittersForUI, initialFilters: searchParams };
};