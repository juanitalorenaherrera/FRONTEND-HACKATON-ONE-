import { useCallback, useEffect, useState } from 'react';

import { MainDashboardDTO } from '@/types/api_types';
import { dashboardService } from '@/services/dashboardService';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/AuthStore';

// Hook para gestionar los datos del Dashboard
export const useDashboard = () => {
  // Usaremos un store de Zustand para cachear los datos y evitar llamadas repetidas
  // Por ahora, lo manejaremos con un estado local para simplicidad.
  const [data, setData] = useState<MainDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuthStore();

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) {
      setError("No se ha podido verificar la identidad del usuario.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await dashboardService.getDashboardData(user.id);
      setData(response);
      setError(null);
    } catch (err) {
      const errorMessage = "No se pudieron cargar los datos del dashboard.";
      setError(errorMessage);
      toast.error(errorMessage, { description: "Por favor, intenta refrescar la página." });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // Solo carga los datos si aún no se han cargado
    if (!data) {
      fetchDashboardData();
    }
  }, [data, fetchDashboardData]);

  return { data, loading, error, refresh: fetchDashboardData };
};