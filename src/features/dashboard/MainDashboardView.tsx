// /features/dashboard/view/MainDashboardView.tsx

import { AlertCircle } from 'lucide-react';
import { DashboardHeader } from '../components/dashboard-header/DashboardHeader';
import { DashboardSkeleton } from '../dashboard/components/DashboardSkeleton';
import { HeroBanner } from '../components/sections/MainDashboard/HeroBanner/HeroBanner';
import { MyPetsSection } from '../components/sections/MainDashboard/MyPets/MyPetsSection';
import { NextBookingCard } from '../components/sections/MainDashboard/NextBooking/NextBookingCard';
import { RecentSittersSection } from '../components/sections/MainDashboard/RecentSitters/RecentSittersSection';
import { StatsSection } from '../components/sections/MainDashboard/Stats/StatsSection';
import { useDashboardData } from '../hooks/useDashboardData';
import { useNavigation } from 'react-router-dom';

export const MainDashboardView = () => {
  const navigation = useNavigation();
  const { 
    user, stats, nextBooking, myPets, recentSitters, 
    isLoading, error, refetchData, handleNavigate, 
    handleViewPetProfile, handleViewSitterProfile, handleBookingDetails 
  } = useDashboardData();

  // Carga inicial (manejada por el loader de React Router)
  if (navigation.state === 'loading') {
    return <DashboardSkeleton />;
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-800">Error al cargar el dashboard</h3>
        <p className="text-red-600 mt-2 mb-6">{error}</p>
        <button onClick={refetchData} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader user={user} isLoading={isLoading} onRefreshClick={refetchData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Principal */}
        <main className="lg:col-span-2 flex flex-col gap-8">
          <HeroBanner userName={user?.firstName} onNavigate={handleNavigate} />
          <StatsSection stats={stats} />
          {nextBooking && (
            <NextBookingCard 
              booking={nextBooking} 
              onViewDetails={() => handleBookingDetails(nextBooking.id)} 
            />
          )}
          <RecentSittersSection 
            sitters={recentSitters} 
            onViewProfile={handleViewSitterProfile} 
          />
        </main>
        
        {/* Sidebar */}
        <aside className="flex flex-col gap-8">
          <MyPetsSection 
            pets={myPets} 
            onViewPet={handleViewPetProfile} 
            onAddPet={() => handleNavigate('/dashboard/pets/new')}
          />
          {/* Aquí irían otros componentes de la sidebar como 'RecommendationBanner' si se decide mantener */}
        </aside>
      </div>
    </div>
  );
};