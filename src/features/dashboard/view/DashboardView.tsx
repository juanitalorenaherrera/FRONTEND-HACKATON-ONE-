import { DashboardStats } from '../components/DashboardStats';
import type { MainDashboardDTO } from '../../../types/api_types';
import { UpcomingAppointments } from '../components/UpcomingBookingsList';
import { useOutletContext } from 'react-router-dom';

// La nueva vista principal del Dashboard
export const DashboardView = () => {
  // Accedemos a los datos ya cargados por el DashboardLayout
  // Esto evita el "prop drilling" y asegura que los datos estén disponibles
  const { dashboardData } = useOutletContext<{ dashboardData: MainDashboardDTO }>();

  return (
    <div className="grid grid-cols-12 gap-6 xl:gap-8">
      {/* Columna principal de contenido */}
      <div className="col-span-12 lg:col-span-8 xl:col-span-9">
        <div className="space-y-6 xl:space-y-8">
          <DashboardStats stats={dashboardData?.stats} />
          <UpcomingAppointments bookings={dashboardData?.upcomingBookings} />
        </div>
      </div>

      {/* Columna lateral (si la hubiera en el futuro) */}
      <div className="col-span-12 lg:col-span-4 xl:col-span-3">
        {/* Aquí podrían ir otros componentes como "Actividad Reciente" o "Notificaciones" */}
      </div>
    </div>
  );
};