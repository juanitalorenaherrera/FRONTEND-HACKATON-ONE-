// components/billing/InvoiceCard.tsx

import { Calendar, DollarSign, Download, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Invoice } from '@/types';
import React from 'react';
import { motion } from 'framer-motion';

interface InvoiceCardProps {
    invoice: Invoice;
    onView: (invoice: Invoice) => void;
    onDownload: (invoiceId: number) => void;
    onPay?: (invoiceId: number) => void;
}

export const InvoiceCard = ({ invoice, onView, onDownload, onPay }: InvoiceCardProps) => {
    const isPending = invoice.status === 'PENDING';
    const isPaid = invoice.status === 'PAID';
    const isCancelled = invoice.status === 'CANCELLED';

    const getStatusColor = () => {
        if (isPaid) return 'success';
        if (isPending) return 'warning';
        if (isCancelled) return 'destructive';
        return 'secondary';
    };

    const getStatusText = () => {
        switch (invoice.status) {
            case 'PAID': return 'Pagada';
            case 'PENDING': return 'Pendiente';
            case 'CANCELLED': return 'Cancelada';
            default: return invoice.status;
        }
    };

    const getCardBackground = () => {
        if (isPaid) return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
        if (isPending) return 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200';
        if (isCancelled) return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200';
        return 'bg-white border-gray-200';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`${getCardBackground()} rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-800">
                            Factura #{invoice.id}
                        </h3>
                        <Badge variant={getStatusColor()}>
                            {getStatusText()}
                        </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(invoice.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-700" />
                        <span className="text-2xl font-bold text-gray-800">
                            ${invoice.amount.toLocaleString('es-ES', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(invoice)}
                    className="flex-1 flex items-center justify-center gap-1"
                >
                    <Eye className="w-4 h-4" />
                    Ver
                </Button>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(invoice.id)}
                    className="flex-1 flex items-center justify-center gap-1"
                >
                    <Download className="w-4 h-4" />
                    PDF
                </Button>
                
                {isPending && onPay && (
                    <Button
                        size="sm"
                        onClick={() => onPay(invoice.id)}
                        className="flex-1 bg-gradient-to-r from-pet-teal to-pet-blue text-white hover:from-pet-teal/90 hover:to-pet-blue/90"
                    >
                        Pagar
                    </Button>
                )}
            </div>
        </motion.div>
    );
};