// ===========================================
// hooks/useDashboardData.ts - CORREGIDO Y ALINEADO
// ===========================================

import type {
	DashboardData,
	Stats,
	UserProfile,
} from '../../../types/dashboardData';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getDashboardData } from '../../../services/dashboardService';

// --- Valores por Defecto usando los tipos correctos ---
const defaultStats: Stats = {
	activePets: 0,
	activePetsChange: 'Sin mascotas',
	scheduledAppointments: 0,
	scheduledAppointmentsChange: 'Sin citas',
	vaccinesUpToDate: '0/0',
	vaccinesChange: 'Sin datos',
	pendingReminders: 0,
	pendingRemindersChange: 'Sin recordatorios',
};

const defaultUserProfile: UserProfile = {
	id: 0,
	firstName: 'Usuario',
	lastName: '',
	email: '',
	role: 'user',
	initials: 'U',
};

/**
 * Hook personalizado para manejar los datos del dashboard.
 * Centraliza la lógica de estado, carga, errores y actualización automática.
 */
export const useDashboardData = () => {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastFetch, setLastFetch] = useState<Date | null>(null);

	const fetchDashboardData = useCallback(async (showLoading = true) => {
		if (showLoading) setIsLoading(true);
		setError(null);

		try {
			const data = await getDashboardData();
			setDashboardData(data);
			setLastFetch(new Date());
		} catch (err: unknown) {
			console.error('Failed to fetch dashboard data:', err);
			setError(
				err instanceof Error
					? err.message
					: 'No se pudieron cargar los datos.'
			);
		} finally {
			if (showLoading) setIsLoading(false);
		}
	}, []);

	const refetch = useCallback(
		() => fetchDashboardData(false),
		[fetchDashboardData]
	);

	/**
	 * Efecto para cargar los datos iniciales
	 */
	useEffect(() => {
		fetchDashboardData();
	}, [fetchDashboardData]);

	/**
	 * Auto-refresh cada 5 minutos si la página está activa
	 */
	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;

		const shouldAutoRefresh = () => {
			return !document.hidden && dashboardData && !isLoading && !error;
		};

		if (shouldAutoRefresh()) {
			intervalId = setInterval(() => {
				if (shouldAutoRefresh()) {
					refetch();
				}
			}, 5 * 60 * 1000); // 5 minutos
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [dashboardData, isLoading, error, refetch]);

	/**
	 * Manejo de visibilidad de la página para pausar/reanudar auto-refresh
	 */
	useEffect(() => {
		const handleVisibilityChange = () => {
			// Refrescar cuando la página vuelve a estar visible
			if (!document.hidden && dashboardData && !isLoading) {
				const timeSinceLastFetch = lastFetch
					? Date.now() - lastFetch.getTime()
					: Infinity;

				// Si han pasado más de 2 minutos desde la última carga, refrescar
				if (timeSinceLastFetch > 2 * 60 * 1000) {
					refetch();
				}
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener(
				'visibilitychange',
				handleVisibilityChange
			);
		};
	}, [dashboardData, isLoading, lastFetch, refetch]);

	/**
	 * Estado derivado usando los tipos correctos de DashboardData.ts
	 */
	const userProfile = useMemo(
		() => dashboardData?.userProfile ?? defaultUserProfile,
		[dashboardData]
	);
	const userPets = useMemo(
		() => dashboardData?.userPets ?? [],
		[dashboardData]
	);
	const recentSitters = useMemo(
		() => dashboardData?.recentSitters ?? [],
		[dashboardData]
	);
	const stats = useMemo(
		() => dashboardData?.stats ?? defaultStats,
		[dashboardData]
	);
	const nextAppointment = useMemo(
		() => dashboardData?.nextAppointment ?? null,
		[dashboardData]
	);

	return {
		isLoading,
		error,
		refetch,
		dashboardData,
		userProfile,
		userPets,
		recentSitters,
		stats,
		nextAppointment,
	};
};
