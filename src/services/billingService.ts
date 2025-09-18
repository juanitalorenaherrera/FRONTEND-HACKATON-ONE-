import type { Invoice, PaymentMethod } from '@/types';

import axios from './auth';

const API_URL_INVOICES = '/api/invoices';
const API_URL_PAYMENT_METHODS = '/api/payment-methods';

export const getInvoicesByAccount = async (accountId: number): Promise<Invoice[]> => {
    const response = await axios.get(`${API_URL_INVOICES}/account/${accountId}`);
    return response.data;
};

export const getPaymentMethodsByAccount = async (accountId: number): Promise<PaymentMethod[]> => {
    const response = await axios.get(`${API_URL_PAYMENT_METHODS}/account/${accountId}`);
    return response.data;
};

// Simulamos el pago actualizando el estado de la factura a 'PAID'
export const payInvoice = async (invoiceId: number): Promise<Invoice> => {
    const response = await axios.put(`${API_URL_INVOICES}/${invoiceId}`, {
        status: 'PAID',
    });
    return response.data;
};