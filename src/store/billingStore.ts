import type { Invoice, PaymentMethod } from '@/types';

import { create } from 'zustand';

interface BillingState {
    invoices: Invoice[];
    paymentMethods: PaymentMethod[];
    isLoading: boolean;
    error: string | null;
    
    // Actions
    setData: (data: { invoices: Invoice[]; paymentMethods: PaymentMethod[] }) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updateInvoice: (updatedInvoice: Invoice) => void;

    // Derived state (selectors)
    getPendingInvoices: () => Invoice[];
    getPaidInvoices: () => Invoice[];
}

export const useBillingStore = create<BillingState>((set, get) => ({
    // Initial State
    invoices: [],
    paymentMethods: [],
    isLoading: true,
    error: null,

    // Actions
    setData: (data) => set({ ...data, isLoading: false, error: null }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error, isLoading: false }),
    updateInvoice: (updatedInvoice) => set((state) => ({
        invoices: state.invoices.map((inv) => 
            inv.id === updatedInvoice.id ? updatedInvoice : inv
        ),
    })),

    // ✅ Derived state con salvaguarda
    getPendingInvoices: () => {
        const { invoices } = get();
        // Si `invoices` no es un array, devuelve uno vacío para evitar el crash.
        if (!Array.isArray(invoices)) {
            return [];
        }
        return invoices.filter(inv => inv.status === 'PENDING');
    },
    getPaidInvoices: () => {
        const { invoices } = get();
        // Si `invoices` no es un array, devuelve uno vacío para evitar el crash.
        if (!Array.isArray(invoices)) {
            return [];
        }
        return invoices.filter(inv => inv.status === 'PAID');
    },
}));