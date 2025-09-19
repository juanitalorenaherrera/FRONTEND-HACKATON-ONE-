// features/billing/BillingView.tsx

import { CreditCard, FileText, Loader2, Plus } from 'lucide-react';
import type { Invoice, PaymentMethod } from '@/types';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { InvoiceCard } from '@/features/billing/components/InvoiceCard';
import { InvoiceDetailModal } from '@/features/billing/components/InvoideDetailModal';
import { PaymentMethodCard } from '@/features/billing/components/PaymentMethodCard';
import { PaymentMethodForm } from '@/features/billing/components/PaymentMethodForm';
import { useBilling } from '@/features/billing/hooks/useBilling';
import { useBillingStore } from '@/store/billingStore';

export const BillingView = () => {
    const { paymentMethods, invoices, loading, error } = useBillingStore();
    const {
        handlePayInvoice,
        handleDeletePaymentMethod,
        handleAddPaymentMethod,
        handleSetDefaultPaymentMethod,
        handleDownloadInvoice,
    } = useBilling();

    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setShowInvoiceModal(true);
    };

    const handleEditPaymentMethod = (method: PaymentMethod) => {
        setEditingMethod(method);
        setShowPaymentForm(true);
    };

    const handleClosePaymentForm = () => {
        setShowPaymentForm(false);
        setEditingMethod(null);
    };

    const handleCloseInvoiceModal = () => {
        setShowInvoiceModal(false);
        setSelectedInvoice(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-pet-teal mx-auto mb-4" />
                    <p className="text-gray-600">Cargando información de facturación...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-600">{error}</p>
                    <Button 
                        className="mt-4" 
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Mi Facturación
                </h1>
                <p className="text-gray-600">
                    Gestiona tus métodos de pago y consulta tu historial de facturas
                </p>
            </div>

            {/* Payment Methods Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-pet-teal" />
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Métodos de Pago
                        </h2>
                    </div>
                    <Button
                        onClick={() => setShowPaymentForm(true)}
                        className="bg-gradient-to-r from-pet-teal to-pet-blue text-white hover:from-pet-teal/90 hover:to-pet-blue/90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Método
                    </Button>
                </div>

                {paymentMethods.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No tienes métodos de pago registrados</p>
                        <Button
                            onClick={() => setShowPaymentForm(true)}
                            className="bg-gradient-to-r from-pet-teal to-pet-blue text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar tu primer método de pago
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paymentMethods.map((method) => (
                            <PaymentMethodCard
                                key={method.id}
                                method={method}
                                onDelete={handleDeletePaymentMethod}
                                onSetDefault={handleSetDefaultPaymentMethod}
                                onEdit={handleEditPaymentMethod}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Invoices Section */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-6 h-6 text-pet-teal" />
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Historial de Facturas
                    </h2>
                </div>

                {!Array.isArray(invoices) || invoices.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No hay facturas disponibles</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {invoices.map((invoice) => (
                            <InvoiceCard
                                key={invoice.id}
                                invoice={invoice}
                                onView={handleViewInvoice}
                                onDownload={handleDownloadInvoice}
                                onPay={handlePayInvoice}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Modals */}
            <PaymentMethodForm
                isOpen={showPaymentForm}
                onClose={handleClosePaymentForm}
                onSubmit={handleAddPaymentMethod}
                mode={editingMethod ? 'edit' : 'add'}
                initialData={editingMethod || undefined}
            />

            <InvoiceDetailModal
                isOpen={showInvoiceModal}
                onClose={handleCloseInvoiceModal}
                invoice={selectedInvoice}
                onDownload={handleDownloadInvoice}
                onPay={handlePayInvoice}
            />
        </div>
    );
};