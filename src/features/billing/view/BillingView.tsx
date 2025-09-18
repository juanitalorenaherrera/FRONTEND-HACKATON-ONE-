import { ErrorCard } from '@/components/ui/ErrorCard';
import { InvoiceCard } from '../components/InvoiceCard';
import { LoadingPaws } from '@/components/ui/LoadingPaws';
import { PaymentMethodCard } from '../components/PaymentMethodCard';
import { motion } from 'framer-motion';
import { useBilling } from '../hooks/useBilling';
import { useBillingStore } from '@/store/billingStore';

export const BillingView = () => {
    useBilling(); // Inicializa la lógica y la carga de datos

    const { isLoading, error, getPendingInvoices, getPaidInvoices, paymentMethods } = useBillingStore();
    const pendingInvoices = getPendingInvoices();
    const paidInvoices = getPaidInvoices();

    if (isLoading) return <LoadingPaws message="Cargando facturación..." />;
    if (error) return <ErrorCard error={error} />;

    return (
        <motion.div 
            className="space-y-12 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Sección de Facturas Pendientes */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Facturas Pendientes</h2>
                {pendingInvoices.length > 0 ? (
                    <div className="space-y-4">
                        {pendingInvoices.map((invoice, index) => (
                            <motion.div
                                key={invoice.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <InvoiceCard invoice={invoice} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">¡Estás al día! No tienes facturas pendientes.</p>
                )}
            </section>

            {/* Sección de Métodos de Pago */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Métodos de Pago</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map(pm => <PaymentMethodCard key={pm.id} method={pm} />)}
                </div>
            </section>
            
            {/* Sección de Historial */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Historial de Facturación</h2>
                <div className="space-y-4">
                    {paidInvoices.map(invoice => <InvoiceCard key={invoice.id} invoice={invoice} />)}
                </div>
            </section>
        </motion.div>
    );
};