import { MainDashboardData } from '@/features/dashboard/types';
import { create } from 'zustand';
import { dashboardService } from '@/services/dashboardService';
import { toast } from 'sonner';

interface DashboardState {
  data: MainDashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboardData: (userId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchDashboardData: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await dashboardService.getDashboardData(userId);
      set({ data: response, loading: false });
    } catch (err) {
      const errorMessage = 'No se pudo cargar la información del dashboard';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage, {
        description: 'Por favor, intenta de nuevo más tarde.'
      });
    }
  },
}));