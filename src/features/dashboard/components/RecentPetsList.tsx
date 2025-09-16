import { PawPrint } from 'lucide-react';
import type { PetInfo } from '../../../features/dashboard/types'; // Usaremos tipos específicos
import { motion } from 'framer-motion';

interface RecentPetsListProps {
  pets: PetInfo[];
}

export const RecentPetsList = ({ pets }: RecentPetsListProps) => {
  if (pets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-neutral-500">Aún no has registrado ninguna mascota.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pets.slice(0, 3).map((pet, index) => (
        <motion.div
          key={pet.id}
          className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-pet-orange/10 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <img 
            src={pet.imageUrl || 'https://via.placeholder.com/48'} 
            alt={pet.name} 
            className="w-12 h-12 rounded-full object-cover" 
          />
          <div>
            <p className="font-bold text-neutral-800">{pet.name}</p>
            <p className="text-sm text-neutral-600">{pet.breed}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};