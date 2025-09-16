import { Bell, ChevronDown, Menu } from 'lucide-react';

import { UserProfileDTO } from '@/types/user.types';
import { motion } from 'framer-motion';

interface HeaderProps {
  user?: UserProfileDTO;
  onMenuClick: () => void; // Para abrir el sidebar en móvil
}

export const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Usuario';

  return (
    <motion.header 
      className="flex-shrink-0 bg-white/80 backdrop-blur-lg border-b border-neutral-200/80 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-4">
        {/* Botón de Menú: visible solo hasta el breakpoint 'lg' (1024px) */}
        <button onClick={onMenuClick} className="lg:hidden text-neutral-600 hover:text-pet-orange transition-colors">
          <Menu className="w-6 h-6" />
        </button>

        {/* Saludo: Oculto en pantallas extra pequeñas para dar espacio */}
        <div className="hidden sm:block">
          <h1 className="text-lg md:text-xl font-bold text-neutral-900">
            ¡Hola de nuevo, {user?.firstName ?? ''}! 🐾
          </h1>
          <p className="text-xs md:text-sm text-neutral-500">Qué bueno verte por aquí.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-5">
        <button className="relative text-neutral-500 hover:text-pet-orange transition-colors">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-pet-orange rounded-full border-2 border-white" />
        </button>
        
        <div className="h-8 w-px bg-neutral-200 hidden md:block" />

        <div className="flex items-center gap-3">
          <img 
            src={user?.profileImageUrl ?? `https://ui-avatars.com/api/?name=${userName}&background=random`} 
            alt="User Avatar" 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
          {/* Nombre y flecha: ocultos en móvil para un look más limpio */}
          <div className="hidden md:flex items-center gap-1 cursor-pointer">
            <span className="text-sm font-semibold text-neutral-700">{userName}</span>
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          </div>
        </div>
      </div>
    </motion.header>
  );
};