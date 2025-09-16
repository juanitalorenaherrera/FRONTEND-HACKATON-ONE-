import { Calendar, DollarSign, PawPrint, Star } from 'lucide-react';

import { DashboardStatsDTO } from '@/types/api_types';
import { motion } from 'framer-motion';

// Tipamos las props para que el componente sea predecible
interface DashboardStatsProps {
  stats?: DashboardStatsDTO;
}

// Un componente interno para las tarjetas, para no repetir código
const StatCard = ({ icon: Icon, title, value, color, delay }) => (
  <motion.div 
    className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200/80 flex items-center gap-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    whileHover={{ translateY: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.07)' }}
  >
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-semibold text-neutral-500">{title}</p>
      <p className="text-xl lg:text-2xl font-bold text-neutral-800">{value}</p>
    </div>
  </motion.div>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statItems = [
    { icon: PawPrint, title: "Mascotas Activas", value: stats?.totalPets ?? 0, color: "bg-pet-orange" },
    { icon: Calendar, title: "Citas Próximas", value: stats?.upcomingBookings ?? 0, color: "bg-pet-teal" },
    { icon: Star, title: "Valoración Media", value: stats?.averageRating?.toFixed(1) ?? 'N/A', color: "bg-pet-yellow" },
    { icon: DollarSign, title: "Gasto Mensual", value: `$${stats?.monthlySpending?.toFixed(2) ?? '0.00'}`, color: "bg-pet-green" }
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statItems.map((item, index) => (
          <StatCard key={item.title} {...item} delay={index} />
        ))}
      </div>
    </section>
  );
};