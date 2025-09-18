import { AlertTriangle, RotateCw } from 'lucide-react';

import { Button } from './Button'; // Importa el componente de Botón que creamos
import { motion } from 'framer-motion';

interface ErrorCardProps {
  error?: string | null;
  onRetry?: () => void; // Función opcional para el botón de reintentar
  className?: string;
}

export const ErrorCard = ({
  error = 'Ha ocurrido un error inesperado.',
  onRetry,
  className = '',
}: ErrorCardProps) => {
  return (
    <motion.div
      className={`bg-red-50 border-2 border-dashed border-red-200 rounded-2xl p-8 flex flex-col items-center text-center ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-red-800">¡Oh no! Algo salió mal</h3>
      <p className="mt-2 text-red-600 max-w-md">{error}</p>
      {onRetry && (
        <Button
          variant="destructive"
          onClick={onRetry}
          className="mt-6"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      )}
    </motion.div>
  );
};