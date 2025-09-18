import type { BookingCreationData, BookingFormData, ServiceOffering } from '../types';
import { Calendar, Dog, Tag, User } from 'lucide-react';

import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Tipos para las props
export interface BookingSummaryCardProps {
  formData: BookingFormData;
  creationData: BookingCreationData | null;
  services: ServiceOffering[];
}

// Subcomponente para una línea de detalle
const DetailRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | React.ReactNode }) => (
  <div className="flex items-start justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="text-pet-teal">{icon}</div>
      <span className="text-neutral-600">{label}</span>
    </div>
    <span className="font-semibold text-neutral-800 text-right">{value}</span>
  </div>
);

export const BookingSummaryCard = ({ formData, creationData, services }: BookingSummaryCardProps) => {
  // --- Búsqueda de datos seleccionados ---
  const selectedPet = creationData?.pets.find(p => p.id === formData.petId);
  const selectedSitter = creationData?.sitters.find(s => s.id === formData.sitterId);
  const selectedService = services.find(s => s.id === formData.serviceId);

  // --- Cálculos de Costo ---
  const serviceCost = selectedService?.price || 0;


    const formatDateTime = (date: Date | null) => {
        return date ? format(date, "eeee dd 'de' MMMM, yyyy 'a las' HH:mm 'hrs.'", { locale: es }) : 'No seleccionado';
    };

  return (
    <motion.div
      key="step3"
      className="bg-white/50 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/30 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h2 className="text-2xl font-bold text-center text-pet-orange mb-6">Resumen de tu Reserva</h2>

      <div className="space-y-2 divide-y divide-neutral-200/70">
        <DetailRow 
          icon={<Dog size={20} />} 
          label="Mascota" 
          value={selectedPet?.name || 'N/A'} 
        />
        <DetailRow 
          icon={<User size={20} />} 
          label="Cuidador" 
          value={selectedSitter?.sitterName || 'N/A'} 
        />
        <DetailRow 
          icon={<Tag size={20} />} 
          label="Servicio" 
          value={selectedService?.serviceType || 'N/A'} 
        />
        <DetailRow 
            icon={<Calendar size={20} />} 
            label="Desde" 
            value={formatDateTime(formData.startDate)} // 👈 USA LA NUEVA FUNCIÓN
        />
        <DetailRow 
            icon={<Calendar size={20} />} 
            label="Hasta" 
            value={formatDateTime(formData.endDate)} // 👈 USA LA NUEVA FUNCIÓN
        />
    </div>

      {formData.additionalNotes && (
        <div className="mt-6">
          <h3 className="font-bold text-neutral-700 mb-2">Notas Adicionales</h3>
          <p className="text-sm text-neutral-600 bg-neutral-100 p-3 rounded-lg">{formData.additionalNotes}</p>
        </div>
      )}

      {/* --- Desglose de Costos --- */}
      <div className="mt-8 pt-6 border-t-2 border-dashed border-neutral-300">
        <h3 className="text-xl font-bold text-center text-neutral-800 mb-4">Costo del Servicio</h3>
        <div className="flex items-center justify-center">
          <span className="text-4xl font-extrabold text-pet-orange">
            ${serviceCost.toFixed(2)}
          </span>
        </div>
        <p className="text-center text-xs text-neutral-500 mt-2">
          La tarifa de servicio de PetCare se calculará al confirmar.
        </p>
      </div>
    </motion.div>
  );
};