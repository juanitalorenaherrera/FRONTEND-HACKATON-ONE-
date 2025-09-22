// services/billingService.ts

import type { Invoice, PaymentMethod } from '@/types';

import axios from './auth';

const API_URL_INVOICES = '/api/invoices';
const API_URL_PAYMENT_METHODS = '/api/payment-methods';
// Mantenemos API_URL_ACCOUNTS por si se usa en otros endpoints que sí son correctos.
//const API_URL_ACCOUNTS = '/api/accounts';

// Invoices
export const getInvoicesByAccount = async (accountId: number): Promise<Invoice[]> => {
    // CAMBIO: Se ajusta la URL para que coincida con el @GetMapping("/account/{accountId}") del InvoiceController
    const response = await axios.get(`${API_URL_INVOICES}/account/${accountId}`);
    return response.data;
};

export const payInvoice = async (invoiceId: number): Promise<Invoice> => {
    // Esta ruta parece ser hipotética, la mantenemos estándar por ahora.
    const response = await axios.post(`${API_URL_INVOICES}/${invoiceId}/pay`);
    return response.data;
};

export const downloadInvoice = async (invoiceId: number): Promise<Blob> => {
    // Esta ruta ya es correcta según tu InvoiceController.
    const response = await axios.get(`${API_URL_INVOICES}/${invoiceId}/download`, {
        responseType: 'blob',
    });
    return response.data;
};

export const getInvoiceDetails = async (invoiceId: number): Promise<Invoice> => {
    // Esta ruta ya es correcta.
    const response = await axios.get(`${API_URL_INVOICES}/${invoiceId}`);
    return response.data;
};

// Payment Methods
export const getPaymentMethodsByAccount = async (accountId: number): Promise<PaymentMethod[]> => {
    // CAMBIO: Se ajusta la URL para que coincida con el @GetMapping("/account/{accountId}") del PaymentMethodController
    const response = await axios.get(`${API_URL_PAYMENT_METHODS}/account/${accountId}`);
    return response.data;
};

export const addPaymentMethod = async (
    accountId: number,
    methodData: Omit<PaymentMethod, 'id'>
): Promise<PaymentMethod> => {
    // Se ajusta la URL para que coincida con el @PostMapping("/{accountId}") del PaymentMethodController
    const response = await axios.post(`${API_URL_PAYMENT_METHODS}/${accountId}`, methodData);
    return response.data;
};

export const updatePaymentMethod = async (
    methodId: number,
    updateData: Partial<PaymentMethod>
): Promise<PaymentMethod> => {
    // Esta ruta es correcta, ya que opera sobre el ID del método de pago.
    const response = await axios.put(`${API_URL_PAYMENT_METHODS}/${methodId}`, updateData);
    return response.data;
};

export const deletePaymentMethod = async (methodId: number): Promise<void> => {
    // Esta ruta es correcta.
    await axios.delete(`${API_URL_PAYMENT_METHODS}/${methodId}`);
};

export const setDefaultPaymentMethod = async (methodId: number): Promise<PaymentMethod> => {
    // Esta ruta es correcta.
    const response = await axios.put(`${API_URL_PAYMENT_METHODS}/${methodId}/default`);
    return response.data;
};