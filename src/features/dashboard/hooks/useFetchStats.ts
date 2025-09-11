import { useEffect, useState } from "react";
import type { DashboardStatsData } from "../../../types/DashboardStatsData";
import { getDashboardStats } from "../../../services/dashboardService";

export const useFetchStats = () => {
	const [stats, setStats] = useState<DashboardStatsData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const data = await getDashboardStats();
				setStats(data);
			} catch (err) {
				console.error('Failed to fetch dashboard stats:', err);
				setError('No se pudieron cargar las estadísticas.');
			} finally {
				setIsLoading(false);
			}
		};
		fetchStats();
	}, []);

	return { stats, isLoading, error };
};
