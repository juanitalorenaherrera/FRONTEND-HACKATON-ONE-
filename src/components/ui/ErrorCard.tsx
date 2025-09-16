import { AlertTriangle } from 'lucide-react';
import { Button } from './Button'; // Asumiendo que tienes un componente Button

interface ErrorCardProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorCard = ({ error, onRetry }: ErrorCardProps) => {
  return (
    <div className="bg-red-50 border border-red-200 text-center p-8 rounded-2xl flex flex-col items-center">
      <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
      <h3 className="text-xl font-bold text-red-800 mb-2">¡Oh no! Algo salió mal</h3>
      <p className="text-red-600 mb-6">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="destructive">
          Intentar de Nuevo
        </Button>
      )}
    </div>
  );
};