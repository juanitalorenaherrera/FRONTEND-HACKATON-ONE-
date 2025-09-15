// src/features/booking/booking.loader.ts

import { getBookingsByUser } from '@/services/bookingService';
import { useAuthStore } from '@/store/AuthStore';

export const bookingsLoader = async ({ request }: { request: Request }) => {
  // 1. Obtenemos la información del usuario logueado desde nuestro store.
  // Es crucial para saber de quién son las reservas que vamos a pedir.
  const { profile } = useAuthStore.getState();

  if (!profile) {
    // Esto es una salvaguarda, aunque el protectedLoader ya debería haber actuado.
    throw new Response("No autorizado", { status: 401 });
  }

  // 2. Leemos los posibles filtros desde la URL (ej. /bookings?status=CONFIRMED&page=1)
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());

  // 3. Preparamos el objeto de petición para nuestro servicio.
  const requestParams = {
    userId: profile.id,
    role: profile.role,
    ...searchParams, // Añadimos los filtros de la URL
  };

  // 4. Llamamos al servicio para obtener los datos de las reservas.
  const bookingsData = await getBookingsByUser(requestParams);

  // 5. Devolvemos los datos paginados y los filtros para que la UI los utilice.
  return { bookingsData, initialFilters: searchParams };
};