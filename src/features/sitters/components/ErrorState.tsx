import { AlertTriangle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/Button';

// ✨ CORRECCIÓN 1: Definimos las props que el componente recibirá.
interface SittersErrorStateProps {
  error: string;
  onRetry: () => void;
}

// ✨ CORRECCIÓN 2: Usamos las props en la firma del componente.
export function SittersErrorState({ error, onRetry }: SittersErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-200 bg-red-50 p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-red-800">
        ¡Oh no! Algo salió mal
      </h3>
      <p className="mb-6 max-w-md text-red-600">
        {/* ✨ CORRECCIÓN 3: Mostramos el mensaje de error real que viene de la API. */}
        {error}
      </p>
      <Button
        variant="destructive"
        className="group"
        // ✨ CORRECCIÓN 4: Conectamos la función onRetry al evento onClick del botón.
        onClick={onRetry} 
      >
        <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
        Intentar de nuevo
      </Button>
    </div>
  );
}