import { useEffect } from 'react';
import { useSittersStore } from '@/store/SitterStore';

export function useSittersActions() {
	// 1. Acceso a las acciones del store
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { fetchSitters, setFilters } = useSittersStore();
	const filters = useSittersStore((state) => state.filters);

	// 2. Uso de useEffect para la carga inicial y el cambio de filtros
	useEffect(() => {
		fetchSitters();
	}, [filters, fetchSitters]); // La dependencia de 'filters' dispara la recarga

	const refetch = () => {
		setFilters({}); // Usa setFilters para resetear y recargar
	};

	return {
		refetch,
	};
}
