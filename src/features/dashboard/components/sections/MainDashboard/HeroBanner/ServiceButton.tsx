// ===========================================
// sections/HeroBanner/ServiceButton.tsx
// ===========================================

import { ArrowRight } from 'lucide-react';
import React from 'react';

interface ServiceButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onClick,
  className = '' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`
        group flex items-center gap-4 p-5 bg-white/10 backdrop-blur-lg rounded-2xl 
        hover:bg-white/20 transition-all duration-300 border border-white/20 
        hover:border-white/30 hover:scale-105 focus:outline-none focus:ring-2 
        focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
        ${className}
      `}
    >
      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-white" />
      </div>
      
      <div className="text-left flex-1">
        <p className="font-bold text-white text-lg">{title}</p>
        <div className="text-sm text-orange-100">
          {subtitle}
        </div>
      </div>
      
      <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
    </button>
  );
};

export default ServiceButton;
