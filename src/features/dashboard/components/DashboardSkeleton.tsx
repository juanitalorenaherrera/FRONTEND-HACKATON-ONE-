// /src/features/dashboard/components/DashboardSkeleton.tsx
// --- NUEVO COMPONENTE DE UI ---

import React from 'react';

/**
 * Componente Skeleton para la vista principal del Dashboard.
 * Muestra una representación visual de la estructura de la página mientras se cargan los datos.
 * Es un componente "tonto" y no tiene lógica.
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      {/* Columna Principal - Skeleton */}
      <main className="lg:col-span-2 flex flex-col gap-8">
        {/* HeroBanner Skeleton */}
        <div className="h-40 w-full bg-gray-200 rounded-2xl"></div>
        
        {/* NextBooking Skeleton / Stats Skeleton */}
        <div className="h-64 w-full bg-gray-200 rounded-2xl"></div>
        
        {/* RecentSitters Skeleton */}
        <div className="h-52 w-full bg-gray-200 rounded-2xl"></div>
      </main>
      
      {/* Sidebar - Skeleton */}
      <aside className="flex flex-col gap-8">
        {/* MyPets Skeleton */}
        <div className="h-48 w-full bg-gray-200 rounded-2xl"></div>
        
        {/* Stats Section Skeleton (u otro componente de sidebar) */}
        <div className="h-48 w-full bg-gray-200 rounded-2xl"></div>
        
        {/* Recommendation Banner Skeleton */}
        <div className="h-48 w-full bg-gray-200 rounded-2xl"></div>
      </aside>
    </div>
  );
};

// Optimización para evitar re-renders innecesarios
export const MemoizedDashboardSkeleton = React.memo(DashboardSkeleton);