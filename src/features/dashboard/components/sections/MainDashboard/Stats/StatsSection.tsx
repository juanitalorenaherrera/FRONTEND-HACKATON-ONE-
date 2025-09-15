// ===========================================
// sections/Stats/StatsSection.tsx
// ===========================================

import { Bell, Calendar, Heart, Shield } from 'lucide-react';

import React from 'react';
import { StatCard } from './StatCard';
import type { Stats } from '../../../../../../types/dashboard';

interface StatsSectionProps {
  stats: Stats;
  onStatClick: (statId: string) => void;
  className?: string;
}

/**
 * Sección de estadísticas del dashboard.
 * Muestra las métricas principales del usuario de forma visual.
 */
const StatsSection: React.FC<StatsSectionProps> = ({ 
  stats, 
  onStatClick, 
  className = '' 
}) => {
  const handleStatClick = (statId: string) => {
    console.log('Stat clicked:', statId);
    onStatClick(statId);
  };

  // Lógica para determinar estados de urgencia
  const isVaccinesPending = stats.vaccinesChange?.toLowerCase().includes('pendiente') || 
        stats.vaccinesChange?.toLowerCase().includes('vencida') ||
        stats.vaccinesUpToDate === '0/0';
  
  const isRemindersUrgent = stats.pendingReminders > 0;
  const hasActivePets = stats.activePets > 0;
  const hasUpcomingAppointments = stats.scheduledAppointments > 0;

  // Configuración de las tarjetas de estadísticas
  const statsConfig = [
    {
      id: 'pets',
      icon: Heart,
      title: 'Mascotas Activas',
      value: stats.activePets,
      change: stats.activePetsChange,
      color: 'blue' as const,
      isUrgent: false,
      showIndicator: hasActivePets,
    },
    {
      id: 'appointments',
      icon: Calendar,
      title: 'Citas Programadas',
      value: stats.scheduledAppointments,
      change: stats.scheduledAppointmentsChange,
      color: 'purple' as const,
      isUrgent: false,
      showIndicator: hasUpcomingAppointments,
    },
    {
      id: 'vaccines',
      icon: Shield,
      title: 'Vacunas al Día',
      value: stats.vaccinesUpToDate,
      change: stats.vaccinesChange,
      color: 'green' as const,
      isUrgent: isVaccinesPending,
      showIndicator: true,
    },
    {
      id: 'reminders',
      icon: Bell,
      title: 'Recordatorios Pendientes',
      value: stats.pendingReminders,
      change: stats.pendingRemindersChange,
      color: 'orange' as const,
      isUrgent: isRemindersUrgent,
      showIndicator: isRemindersUrgent,
    },
  ];

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Header de la sección */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Resumen</h3>
          <p className="text-gray-600">Estadísticas de tu cuenta</p>
        </div>
      </div>
      
      {/* Grid de estadísticas */}
      <div className="space-y-4">
        {statsConfig.map((stat) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            color={stat.color}
            isUrgent={stat.isUrgent}
            showIndicator={stat.showIndicator}
            onClick={() => handleStatClick(stat.id)}
          />
        ))}
      </div>

      {/* Resumen de estado general */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className={`p-3 rounded-xl ${isRemindersUrgent || isVaccinesPending ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
              isRemindersUrgent || isVaccinesPending ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <Shield className={`w-4 h-4 ${
                isRemindersUrgent || isVaccinesPending ? 'text-red-600' : 'text-green-600'
              }`} />
            </div>
            <p className="text-xs font-medium text-gray-700">
              {isRemindersUrgent || isVaccinesPending ? 'Acción requerida' : 'Todo al día'}
            </p>
          </div>
          
          <div className={`p-3 rounded-xl ${hasActivePets ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
              hasActivePets ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Heart className={`w-4 h-4 ${hasActivePets ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <p className="text-xs font-medium text-gray-700">
              {hasActivePets ? 'Mascotas activas' : 'Sin mascotas'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;