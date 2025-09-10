// ===========================================
// sections/HeroBanner/HeroBanner.tsx
// ===========================================

import { Heart, Home, PawPrint, Scissors, Shield, Star, Users, Zap } from 'lucide-react';
import type { Pet, Sitter, UserProfile } from '../../../../../types/dashboardData';

import React from 'react';
import ServiceButton from './ServiceButton';

interface HeroBannerProps {
  userProfile: UserProfile;
  userPets: Pet[];
  recentSitters: Sitter[];
  onServiceClick?: (serviceId: string) => void;
}

interface ServiceConfig {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: React.ReactNode;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  userProfile,
  userPets = [],
  recentSitters = [],
  onServiceClick
}) => {
  const services: ServiceConfig[] = [
    {
      id: 'find-sitter',
      icon: Users,
      title: 'Buscar Cuidador',
      subtitle: (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          {recentSitters.length} disponibles
        </div>
      )
    },
    {
      id: 'care-24-7',
      icon: Home,
      title: 'Cuidado 24/7',
      subtitle: (
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Seguro incluido
        </div>
      )
    },
    {
      id: 'grooming',
      icon: Scissors,
      title: 'Grooming',
      subtitle: (
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Reserva rápida
        </div>
      )
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    console.log(`Clicked service: ${serviceId}`);
    onServiceClick?.(serviceId);
  };

  const getWelcomeMessage = (): string => {
    if (userPets.length > 0) {
      return `¿Cómo podemos cuidar de ${userPets[0].name} hoy?`;
    }
    return '¿Cómo podemos ayudarte hoy?';
  };

  return (
    <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-8 text-white overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-4 right-4 opacity-20 animate-pulse">
        <PawPrint className="w-24 h-24" />
      </div>
      <div className="absolute -bottom-4 -left-4 opacity-10">
        <Heart className="w-32 h-32" />
      </div>
      <div 
        className="absolute top-1/2 right-1/4 opacity-10 animate-bounce" 
        style={{animationDelay: '1s'}}
      >
        <Star className="w-8 h-8" />
      </div>

      <div className="relative z-10">
        {/* Sección de bienvenida */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Hola {userProfile.firstName}
              </h1>
              <p className="text-orange-100">
                {getWelcomeMessage()}
              </p>
            </div>
          </div>
        </div>

        {/* Servicios Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceButton
              key={service.id}
              icon={service.icon}
              title={service.title}
              subtitle={service.subtitle}
              onClick={() => handleServiceClick(service.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;