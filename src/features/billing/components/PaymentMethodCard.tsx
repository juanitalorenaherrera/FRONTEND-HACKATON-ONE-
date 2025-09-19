// components/billing/PaymentMethodCard.tsx

import { CreditCard, Edit, MoreVertical, Star, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import type { PaymentMethod } from '@/types';
import React from 'react';
import { motion } from 'framer-motion';

interface PaymentMethodCardProps {
    method: PaymentMethod;
    onDelete: (id: number) => void;
    onSetDefault: (id: number) => void;
    onEdit?: (method: PaymentMethod) => void;
}

export const PaymentMethodCard = ({ 
    method, 
    onDelete, 
    onSetDefault, 
    onEdit 
}: PaymentMethodCardProps) => {
    const getCardBrandIcon = (brand: string) => {
        // Aquí podrías usar iconos específicos de marcas de tarjetas
        return <CreditCard className="w-8 h-8" />;
    };

    const getCardGradient = (brand: string) => {
        switch (brand.toLowerCase()) {
            case 'visa':
                return 'bg-gradient-to-br from-blue-500 to-blue-700';
            case 'mastercard':
                return 'bg-gradient-to-br from-red-500 to-orange-600';
            case 'american express':
                return 'bg-gradient-to-br from-green-600 to-teal-700';
            default:
                return 'bg-gradient-to-br from-gray-600 to-gray-800';
        }
    };

    return (
        <motion.div
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            whileHover={{ scale: 1.02 }}
            layout
        >
            {/* Card Design */}
            <div className={`${getCardGradient(method.brand)} text-white p-6 relative min-h-[160px]`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 bg-white rounded-full" />
                </div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-white/80">
                            {getCardBrandIcon(method.brand)}
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-medium opacity-90">{method.brand}</span>
                            {method.isDefault && (
                                <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                                    <span className="text-xs">Principal</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card Number */}
                    <div className="font-mono text-lg tracking-widest mb-4">
                        •••• •••• •••• {method.last4}
                    </div>

                    {/* Card Info */}
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs opacity-70 uppercase tracking-wide">Titular</p>
                            <p className="font-semibold truncate max-w-[200px]">
                                {method.cardHolderName}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs opacity-70 uppercase tracking-wide">Expira</p>
                            <p className="font-semibold">{method.expirationDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {!method.isDefault && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onSetDefault(method.id)}
                                className="flex items-center gap-1 text-xs"
                            >
                                <Star className="w-3 h-3" />
                                Principal
                            </Button>
                        )}
                        
                        {onEdit && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(method)}
                                className="flex items-center gap-1 text-xs"
                            >
                                <Edit className="w-3 h-3" />
                                Editar
                            </Button>
                        )}
                    </div>
                    
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(method.id)}
                        className="text-red-500 hover:bg-red-50 hover:border-red-200 flex items-center gap-1"
                    >
                        <Trash2 className="w-3 h-3" />
                        Eliminar
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};