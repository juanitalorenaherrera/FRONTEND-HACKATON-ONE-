import { CreditCard, Star, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button'; // Asegúrate de tener un componente de botón reutilizable
import type { PaymentMethod } from '@/types';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Helper para obtener el logo de la tarjeta (puedes expandir esto)

interface PaymentMethodCardProps {
    method: PaymentMethod;
    onDelete?: (id: number) => void; // Acción para eliminar
}

export const PaymentMethodCard = ({ method, onDelete }: PaymentMethodCardProps) => {
    // Función de placeholder si no se proporciona onDelete
    const handleDelete = () => {
        if (onDelete) {
            onDelete(method.id);
        } else {
            // Este toast es un ejemplo. La lógica de borrado real estaría en el hook `useBilling`
            toast.info(`Funcionalidad para eliminar tarjeta #${method.id} no implementada.`);
        }
    };

    return (
        <motion.div
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 bg-white shadow-md border border-neutral-200 hover:shadow-xl hover:-translate-y-1"
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-gray-800">{method.cardHolderName}</p>
                    <p className="font-mono text-gray-600 tracking-wider mt-2">
                        •••• •••• •••• {method.last4}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Expira: {method.expirationDate}
                    </p>
                </div>
                <div className="text-gray-400">
                    {/* Aquí iría el componente de ícono real */}
                    <CreditCard className="w-10 h-10" /> 
                </div>
            </div>

            <div className="flex justify-between items-center mt-4">
                {method.isDefault && (
                    <div className="flex items-center gap-1 text-sm text-pet-teal">
                        <Star className="w-4 h-4" fill="currentColor" />
                        <span>Predeterminado</span>
                    </div>
                )}
                
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:bg-red-100 ml-auto"
                    onClick={handleDelete}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                </Button>
            </div>
        </motion.div>
    );
};