import { FileText, Home, LogOut, PawPrint, Settings } from 'lucide-react';

import { NavLink } from 'react-router-dom';
import type { PetSummaryResponse } from '../types/api_types'; // Asegúrate que tus tipos de API estén centralizados
import type { UserProfileDTO } from '../types/user.types';
import { cn } from '../lib/utils';

interface SidebarProps {
  user?: UserProfileDTO;
  pets?: PetSummaryResponse[];
}

// --- Reemplazo de NavItems y useSidebarData ---
// Definimos los enlaces de navegación como un array constante aquí mismo.
// Es más simple y directo, ya que no cambian dinámicamente.
const navLinks = [
  { to: '/dashboard', icon: Home, text: 'Dashboard' },
  { to: '/pets', icon: PawPrint, text: 'Mis Mascotas' },
  { to: '/billing', icon: FileText, text: 'Facturación' },
  { to: '/settings', icon: Settings, text: 'Ajustes' },
];

export const Sidebar: React.FC<SidebarProps> = ({ pets = [] }) => {
  // Lógica para cerrar sesión (puedes moverla a tu hook de auth si prefieres)
  const handleLogout = () => {
    // Aquí iría la lógica para limpiar el token del store y redirigir
    console.log("Cerrando sesión...");
    window.location.href = '/login'; // O usar navigate
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-neutral-200/80 p-6">
      {/* Logo */}
      <div className="text-2xl font-bold text-pet-orange mb-12">
        <NavLink to="/dashboard">PetCare <span className="text-pet-teal">Pro</span></NavLink>
      </div>

      {/* Navegación Principal */}
      <nav className="flex flex-col gap-2">
        <span className="px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Menú</span>
        {navLinks.map(({ to, icon: Icon, text }) => (
          <NavLink
            key={to}
            to={to}
            end // La prop 'end' asegura que solo la ruta exacta esté activa
            className={({ isActive }) => cn(
              "flex items-center gap-3.5 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 text-base",
              isActive 
                ? "bg-pet-teal/10 text-pet-teal shadow-sm" 
                : "text-neutral-500 hover:bg-neutral-100/80 hover:text-neutral-900"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{text}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="my-8 h-px w-full bg-neutral-200" />

      {/* Lista de Mascotas */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1">
         <span className="px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Mascotas</span>
         {pets.length > 0 ? (
            pets.map(pet => (
              <div key={pet.id} className="flex items-center gap-3 cursor-pointer group px-4 py-2 rounded-lg hover:bg-neutral-100/80">
                <img 
                  src={pet.imageUrl ?? `https://ui-avatars.com/api/?name=${pet.name}&background=random`} 
                  alt={pet.name} 
                  className="w-8 h-8 rounded-full object-cover transition-transform group-hover:scale-110"
                />
                <span className="text-sm font-medium text-neutral-600 group-hover:text-pet-orange transition-colors">{pet.name}</span>
              </div>
            ))
         ) : (
            <p className="px-4 text-sm text-neutral-400">No hay mascotas.</p>
         )}
      </div>

      {/* Footer del Sidebar (Logout) */}
      <div className="mt-8">
         <button 
            onClick={handleLogout}
            className="flex items-center w-full gap-3.5 px-4 py-2.5 rounded-lg font-semibold text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
         >
            <LogOut className="w-5 h-5"/>
            <span>Cerrar Sesión</span>
         </button>
      </div>
    </aside>
  );
};