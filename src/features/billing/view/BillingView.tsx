import { CreditCard, FileWarning, History } from 'lucide-react';

import { ErrorCard } from '@/components/ui/ErrorCard';
import { InvoiceCard } from '../components/InvoiceCard';
import { LoadingPaws } from '@/components/ui/LoadingPaws';
import { PaymentMethodCard } from '../components/PaymentMethodCard';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { useBilling } from '../hooks/useBilling';
import { useBillingStore } from '@/store/billingStore';

// Variantes de animación para las listas
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};


export const BillingView = () => {
    useBilling(); 

    const { isLoading, error, getPendingInvoices, getPaidInvoices, paymentMethods } = useBillingStore();
    const pendingInvoices = getPendingInvoices();
    const paidInvoices = getPaidInvoices();

    if (isLoading) return <LoadingPaws message="Cargando tu facturación..." />;
    if (error) return <ErrorCard error={error} />;

    return (
        <motion.div 
            className="min-h-screen bg-gradient-to-br from-neutral-50 to-pet-orange/10 p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Header Principal */}
            <motion.header
                className="bg-gradient-primary rounded-3xl p-8 mb-10 text-white shadow-xl"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold">🐾 Mi Facturación</h1>
                <p className="text-white/80 mt-1">Gestiona tus pagos y facturas de forma sencilla.</p>
            </motion.header>

            <div className="space-y-12">
                {/* Sección de Facturas Pendientes */}
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-2xl font-bold text-pet-orange mb-4 flex items-center gap-2">
                        <FileWarning className="w-6 h-6" /> Facturas Pendientes
                    </h2>
                    {pendingInvoices.length > 0 ? (
                        <motion.div 
                            className="space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {pendingInvoices.map((invoice) => (
                                <motion.div key={invoice.id} variants={itemVariants}>
                                    <InvoiceCard invoice={invoice} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-10 px-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border">
                            <h3 className="text-lg font-semibold text-pet-green">¡Todo en orden!</h3>
                            <p className="text-neutral-500 mt-1">No tienes ninguna factura pendiente de pago.</p>
                        </div>
                    )}
                </motion.section>

                {/* Sección de Métodos de Pago */}
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-pet-blue" /> Métodos de Pago
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paymentMethods.map(pm => <PaymentMethodCard key={pm.id} method={pm} />)}
                        {/* Puedes añadir una tarjeta estática para agregar un nuevo método */}
                    </div>
                </motion.section>
                
                {/* Sección de Historial */}
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                        <History className="w-6 h-6 text-neutral-500" /> Historial de Facturación
                    </h2>
                     {paidInvoices.length > 0 ? (
                        <motion.div 
                            className="space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {paidInvoices.map(invoice => (
                                <motion.div key={invoice.id} variants={itemVariants} initial="hidden" animate="show">
                                    <InvoiceCard invoice={invoice} />
                                </motion.div>
                            ))}
                        </motion.div>
                     ) : (
                         <div className="text-center py-10 px-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border">
                            <p className="text-neutral-500">Aún no tienes facturas pagadas.</p>
                        </div>
                     )}
                </motion.section>
            </div>
        </motion.div>
    );
};