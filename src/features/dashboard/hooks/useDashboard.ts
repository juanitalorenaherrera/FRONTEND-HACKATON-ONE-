import { toast } from 'sonner';
import { useAuthStore } from '../../../store/AuthStore';
import { useDashboardStore } from '../../../store/dashboardStore';
import { useEffect } from 'react';

export const useDashboard = () => {
  const { data, loading, error, fetchDashboardData } = useDashboardStore();
  const { user } = useAuthStore(); // Obtener usuario autenticado

  useEffect(() => {
    // Cargar datos solo si no existen y no hay un error
    if (user?.id && !data && !error) {
      fetchDashboardData(user.id);
    }
  }, [user, data, error, fetchDashboardData]);

  const retry = () => {
    if (user?.id) {
        toast.promise(fetchDashboardData(user.id), {
            loading: 'Reintentando cargar dashboard...',
            success: '¡Información cargada! 🐾',
            error: 'No se pudo recuperar la información.'
        });
    }
  };

  return {
    data,
    loading,
    error,
    retry,
    user,
  };
};