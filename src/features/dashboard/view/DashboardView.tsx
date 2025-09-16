// src/features/dashboard/view/DashboardView.tsx

import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { DashboardStats } from '../components/DashboardStats';
import { ErrorCard } from '../../../components/ui/ErrorCard';
import { RecentPetsList } from '../components/RecentPetsList';
import { UpcomingBookingsList } from '../components/UpcomingBookingsList';
import { motion } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';

export const DashboardView = () => {
  const { 
    userName, 
    stats, 
    upcomingBookings, 
    recentPets, 
    isLoading, 
    error, 
    retry 
  } = useDashboard();

  // Muestra el skeleton solo en la carga inicial
  if (isLoading && !stats) {
    return <DashboardSkeleton />;
  }

  // Muestra la tarjeta de error si algo falla
  if (error) {
    return <ErrorCard error={error} onRetry={retry} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-800">
          ¡Hola de nuevo, {userName}! 👋
        </h1>
        <p className="text-lg text-neutral-500">Aquí tienes un resumen de la actividad de tus mascotas.</p>
      </header>
      
      {/* Componentes modulares y reutilizables */}
      {stats && <DashboardStats stats={stats} />}
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl mb-4">Próximas Reservas</h3>
          {upcomingBookings && <UpcomingBookingsList bookings={upcomingBookings} />}
        </div>
        
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl mb-4">Mascotas Recientes</h3>
          {recentPets && <RecentPetsList pets={recentPets} />}
        </div>
      </div>
    </motion.div>
  );
};