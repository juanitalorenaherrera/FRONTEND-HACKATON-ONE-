import { AlertTriangle, PawPrint, Plus } from 'lucide-react';

import { Button } from '@/components/ui/Button'; // Asumiendo que tienes un componente Button genérico
import { Skeleton } from '@/components/ui/Skeleton'; // Asumiendo un componente Skeleton genérico
import { motion } from 'framer-motion';

// --- 1. Estado de Carga (Skeleton) ---
export const PetsLoadingState = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200/80 space-y-3">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
};


// --- 2. Estado de Error ---
interface PetsErrorStateProps {
  error: string;
  onRetry: () => void;
}
export const PetsErrorState: React.FC<PetsErrorStateProps> = ({ error, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center bg-white p-8 rounded-2xl shadow-sm border border-red-200"
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-neutral-800">Oops, algo salió mal</h3>
      <p className="text-neutral-500 mt-2 mb-6 max-w-md">{error}</p>
      <Button onClick={onRetry} variant="primary">
        <Plus className="w-4 h-4 mr-2" />
        Volver a intentar
      </Button>
    </motion.div>
  );
};


// --- 3. Estado Vacío (Sin Mascotas) ---
interface PetsEmptyStateProps {
    onAddPet: () => void;
}
export const PetsEmptyState: React.FC<PetsEmptyStateProps> = ({ onAddPet }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center bg-white p-10 rounded-2xl shadow-sm border-2 border-dashed border-neutral-200"
    >
      <div className="w-16 h-16 bg-pet-teal/10 rounded-full flex items-center justify-center mb-4">
        <PawPrint className="w-8 h-8 text-pet-teal" />
      </div>
      <h3 className="text-xl font-bold text-neutral-800">Aún no tienes mascotas registradas</h3>
      <p className="text-neutral-500 mt-2 mb-6 max-w-md">
        ¡Añade a tu primer compañero peludo para empezar a gestionar sus citas, vacunas y mucho más!
      </p>
      <Button onClick={onAddPet} variant="primary" size="lg">
        <Plus className="w-5 h-5 mr-2" />
        Añadir mi primera mascota
      </Button>
    </motion.div>
  );
};