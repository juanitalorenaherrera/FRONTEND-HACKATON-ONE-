import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Invoice } from '@/types';
import { motion } from 'framer-motion';
import { useBilling } from '../hooks/useBilling';

interface InvoiceCardProps {
    invoice: Invoice;
}

export const InvoiceCard = ({ invoice }: InvoiceCardProps) => {
    const { handlePayInvoice } = useBilling();
    const isPending = invoice.status === 'PENDING';

    return (
        <motion.div 
            layout
            className={`flex items-center justify-between p-4 rounded-xl border ${isPending ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}
        >
            <div>
                <p className="font-bold text-gray-700">Factura #{invoice.id}</p>
                <p className="text-sm text-gray-500">Fecha: {new Date(invoice.date).toLocaleDateString()}</p>
                <p className="text-lg font-semibold mt-1">${invoice.amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
                <Badge variant={isPending ? 'warning' : 'success'}>{invoice.status}</Badge>
                {isPending && (
                    <Button onClick={() => handlePayInvoice(invoice.id)} className="mt-2">
                        Pagar Ahora
                    </Button>
                )}
            </div>
        </motion.div>
    );
};