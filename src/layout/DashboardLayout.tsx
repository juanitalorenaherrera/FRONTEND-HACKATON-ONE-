import { Navigate, Outlet } from 'react-router-dom';

import { DashboardSkeleton } from '../features/dashboard/components/DashboardSkeleton';
import { Header } from './Header';
import { Sidebar } from '../layout/Sidebar';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/AuthStore';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useState } from 'react';

export const DashboardLayout = () => {
  // Estado para manejar la visibilidad del sidebar en móvil/tablet
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Obtiene el token o estado de autenticación de tu store de Zustand
  const { token } = useAuthStore();
  const { data, loading, error } = useDashboard();

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Muestra un esqueleto de carga mientras se obtienen los datos iniciales
  if (loading) return <DashboardSkeleton />;

  // Muestra un error si la carga inicial de datos falla
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Oops! Algo salió mal</h2>
          <p className="text-neutral-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-pet-orange text-white rounded-lg font-semibold"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-100/50 text-neutral-800 font-primary">
      {/* Sidebar para Tablets y Desktops */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar user={data?.userProfile} pets={data?.pets} />
      </div>

      {/* Contenedor principal que se adapta */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={data?.userProfile} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Outlet renderiza el componente de la ruta actual (ej. DashboardView) */}
          <motion.div
            key={location.pathname} // Anima en cada cambio de ruta
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Outlet context={{ dashboardData: data }} /> 
          </motion.div>
        </main>
      </div>

      {/* Sidebar para Móvil (aparece como un overlay) */}
      {/* Implementación futura con el estado isSidebarOpen */}
    </div>
  );
};