import type { BookingCreationData, BookingFormData } from '../types';
import { CheckCircle2, Dog, User } from 'lucide-react';

import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ✨ CORRECCIÓN: Usar BookingFormData importado de types
interface CreateBookingStep1Props {
  form: UseFormReturn<BookingFormData>;
  creationData: BookingCreationData | null;
  onSitterChange: (sitterId: number) => void;
}

// Subcomponente reutilizable para las tarjetas de selección
interface SelectionCardProps {
  label: string;
  image?: string;
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const SelectionCard = ({ label, image, isSelected, onClick, icon }: SelectionCardProps) => (
  <motion.div
    onClick={onClick}
    className={cn(
      "relative group cursor-pointer rounded-2xl p-4 transition-all duration-300 border-2",
      "bg-white/40 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1",
      isSelected 
        ? "border-pet-orange shadow-xl" 
        : "border-transparent"
    )}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-4">
      {image ? (
        <img src={image} alt={label} className="w-16 h-16 rounded-full object-cover border-2 border-white" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gradient-secondary flex items-center justify-center text-white">
          {icon}
        </div>
      )}
      <p className="text-lg font-semibold text-neutral-700">{label}</p>
    </div>
    {isSelected && (
      <div className="absolute top-3 right-3 text-pet-orange">
        <CheckCircle2 className="w-6 h-6" />
      </div>
    )}
  </motion.div>
);

// Componente principal del Paso 1
export const CreateBookingStep1 = ({ form, creationData, onSitterChange }: CreateBookingStep1Props) => {
  const { control } = form;

  return (
    <motion.div
      key="step1"
      className="space-y-8"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* --- Sección de Selección de Mascota --- */}
      <div>
        <h2 className="text-xl font-bold text-neutral-800 mb-4">¿Para qué mascota es la reserva?</h2>
        <Controller
          name="petId"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creationData?.pets?.map(pet => (
                <SelectionCard
                  key={pet.id}
                  label={pet.name}
                  isSelected={field.value === pet.id}
                  onClick={() => field.onChange(pet.id)}
                  icon={<Dog size={32} />}
                />
              ))}
            </div>
          )}
        />
        {form.formState.errors.petId && <p className="text-red-500 mt-2">{form.formState.errors.petId.message}</p>}
      </div>

      {/* --- Sección de Selección de Cuidador --- */}
      <div>
        <h2 className="text-xl font-bold text-neutral-800 mb-4">¿Quién será su cuidador?</h2>
        <Controller
          name="sitterId"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creationData?.sitters?.map(sitter => (
                <SelectionCard
                  key={sitter.id}
                  label={sitter.sitterName}
                  image={sitter.profileImageUrl}
                  isSelected={field.value === sitter.id}
                  onClick={() => {
                    field.onChange(sitter.id);
                    onSitterChange(sitter.id); // Llama al callback para cargar servicios
                  }}
                  icon={<User size={32} />}
                />
              ))}
            </div>
          )}
        />
        {form.formState.errors.sitterId && <p className="text-red-500 mt-2">{form.formState.errors.sitterId.message}</p>}
      </div>
    </motion.div>
  );
};