import React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton'; // 1. Importamos nuestro componente genérico

export function SitterCardSkeleton() {
  return (
    // El contenedor principal ya no necesita `animate-pulse` porque cada <Skeleton /> lo tiene.
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        {/* Avatar skeleton */}
        <div className="relative flex-shrink-0">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <Skeleton className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full" />
        </div>

        {/* Content skeleton */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Bio */}
          <div className="space-y-1 pt-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>

          {/* Specialties & Pets (agrupados para mejor espaciado) */}
          <div className="space-y-2 pt-1">
            <div className="flex gap-1">
                <Skeleton className="h-6 rounded-full w-16" />
                <Skeleton className="h-6 rounded-full w-20" />
                <Skeleton className="h-6 rounded-full w-14" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-3 rounded w-24" />
                <Skeleton className="h-5 rounded-full w-12" />
            </div>
          </div>
          
          {/* Availability & Actions (agrupados) */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-3">
              <Skeleton className="flex-1 h-10 rounded-xl" />
              <Skeleton className="w-10 h-10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}