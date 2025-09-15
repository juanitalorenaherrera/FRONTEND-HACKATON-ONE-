// hooks/useDashboardData.ts - REFACTORIZADO PARA USAR NUEVOS TIPOS Y SERVICIOS

import type { DashboardStats, MainDashboardData } from '../../../types/dashboard';
import {
  getDashboardStats,
  getMainDashboardData,
  getPetsSummary,
  getRecentSitters
} from '../../../services/dashboardService';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { BookingSummary } from '../../../types/bookings';
import type { PetSummary } from '../../../types/pets';
import type { SitterProfileSummary } from '../../../types/sitter';

// Interfaz para el estado completo del dashboard
interface DashboardData {
  stats: DashboardStats;
  nextAppointment: BookingSummary | null;
  recentSitters: SitterProfileSummary[];
  userPets: PetSummary[];
}

// Valores por defecto usando los tipos correctos
const defaultStats: DashboardStats = {
  activePets: 0,
  activePetsChange: 'Sin mascotas',
  scheduledAppointments: 0,
  scheduledAppointmentsChange: 'Sin citas',
  vaccinesUpToDate: '0/0',
  vaccinesChange: 'Sin datos',
  pendingReminders: 0,
  pendingRemindersChange: 'Sin recordatorios',
};

/**
 * Hook personalizado para manejar los datos del dashboard.
 * Refactorizado para usar servicios específicos y nuevos tipos.
 */
export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  /**
   * Carga todos los datos del dashboard usando servicios específicos
   */
  const fetchDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      // Usar Promise.all para cargar datos en paralelo y mejorar performance
      const [statsData, mainData, petsData] = await Promise.all([
        getDashboardStats(),
        getMainDashboardData(), 
        getPetsSummary()
      ]);

      const combinedData: DashboardData = {
        stats: statsData,
        nextAppointment: mainData.nextAppointment,
        recentSitters: mainData.recentSitters,
        userPets: petsData
      };

      setDashboardData(combinedData);
      setLastFetch(new Date());
    } catch (err: unknown) {
      console.error('Failed to fetch dashboard data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los datos del dashboard.'
      );
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  /**
   * Carga solo las estadísticas (para actualizaciones frecuentes)
   */
  const fetchStatsOnly = useCallback(async () => {
    try {
      const statsData = await getDashboardStats();
      setDashboardData(prev => prev ? { ...prev, stats: statsData } : null);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  /**
   * Refrescar datos sin mostrar loading
   */
  const refetch = useCallback(
    () => fetchDashboardData(false),
    [fetchDashboardData]
  );

  /**
   * Refrescar solo estadísticas (más ligero)
   */
  const refetchStats = useCallback(
    () => fetchStatsOnly(),
    [fetchStatsOnly]
  );

  /**
   * Carga inicial de datos
   */
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /**
   * Auto-refresh inteligente:
   * - Stats cada 2 minutos
   * - Datos completos cada 10 minutos
   */
  useEffect(() => {
    let statsInterval: NodeJS.Timeout | null = null;
    let fullRefreshInterval: NodeJS.Timeout | null = null;

    const shouldAutoRefresh = () => {
      return !document.hidden && dashboardData && !isLoading && !error;
    };

    if (shouldAutoRefresh()) {
      // Actualizar solo stats cada 2 minutos (más frecuente, más ligero)
      statsInterval = setInterval(() => {
        if (shouldAutoRefresh()) {
          refetchStats();
        }
      }, 2 * 60 * 1000);

      // Actualizar datos completos cada 10 minutos
      fullRefreshInterval = setInterval(() => {
        if (shouldAutoRefresh()) {
          refetch();
        }
      }, 10 * 60 * 1000);
    }

    return () => {
      if (statsInterval) clearInterval(statsInterval);
      if (fullRefreshInterval) clearInterval(fullRefreshInterval);
    };
  }, [dashboardData, isLoading, error, refetch, refetchStats]);

  /**
   * Manejo de visibilidad para refrescar cuando la página vuelve a estar activa
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && dashboardData && !isLoading && lastFetch) {
        const timeSinceLastFetch = Date.now() - lastFetch.getTime();

        // Si han pasado más de 5 minutos, refrescar datos completos
        if (timeSinceLastFetch > 5 * 60 * 1000) {
          refetch();
        }
        // Si han pasado más de 1 minuto, refrescar solo stats
        else if (timeSinceLastFetch > 60 * 1000) {
          refetchStats();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dashboardData, isLoading, lastFetch, refetch, refetchStats]);

  /**
   * Estados derivados memoizados
   */
  const stats = useMemo(
    () => dashboardData?.stats ?? defaultStats,
    [dashboardData?.stats]
  );

  const userPets = useMemo(
    () => dashboardData?.userPets ?? [],
    [dashboardData?.userPets]
  );

  const recentSitters = useMemo(
    () => dashboardData?.recentSitters ?? [],
    [dashboardData?.recentSitters]
  );

  const nextAppointment = useMemo(
    () => dashboardData?.nextAppointment ?? null,
    [dashboardData?.nextAppointment]
  );

  /**
   * Indicadores de estado útiles
   */
  const hasData = useMemo(() => Boolean(dashboardData), [dashboardData]);
  
  const isEmpty = useMemo(() => {
    return hasData && (
      userPets.length === 0 && 
      recentSitters.length === 0 && 
      !nextAppointment
    );
  }, [hasData, userPets.length, recentSitters.length, nextAppointment]);

  /**
   * Información de última actualización
   */
  const lastUpdateInfo = useMemo(() => {
    if (!lastFetch) return null;
    
    const now = Date.now();
    const diff = now - lastFetch.getTime();
    const minutes = Math.floor(diff / (60 * 1000));
    
    if (minutes < 1) return 'Actualizado hace menos de 1 minuto';
    if (minutes === 1) return 'Actualizado hace 1 minuto';
    return `Actualizado hace ${minutes} minutos`;
  }, [lastFetch]);

  return {
    // Estados principales
    isLoading,
    error,
    hasData,
    isEmpty,
    
    // Datos
    dashboardData,
    stats,
    userPets,
    recentSitters,
    nextAppointment,
    
    // Acciones
    refetch,
    refetchStats,
    
    // Información adicional
    lastFetch,
    lastUpdateInfo,
  };
};