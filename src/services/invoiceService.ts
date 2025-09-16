import { Invoice, InvoiceStatus } from '../types/common.types';

import { ApiResponse } from '../types/api.types';
import { apiClient } from './api';

export class InvoiceService {
  // GET /invoices - Historial completo de facturas
  async getAll(): Promise<Invoice[]> {
    const response = await apiClient.get<ApiResponse<Invoice[]>>('/invoices');
    return response.data.data;
  }

  // GET /invoices/{id} - Detalle específico de factura
  async getById(id: string): Promise<Invoice> {
    const response = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${id}`);
    return response.data.data;
  }

  // GET /invoices/{id}/download - Descargar PDF
  async download(id: string): Promise<Blob> {
    const response = await apiClient.get(`/invoices/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // PUT /invoices/{id}/status - Actualizar estado (PENDIENTE -> PAGADA)
  async updateStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const response = await apiClient.put<ApiResponse<Invoice>>(`/invoices/${id}/status`, { status });
    return response.data.data;
  }

  // POST /invoices/{id}/pay - Procesar pago de factura
  async processPayment(
    id: string, 
    paymentMethodId: string, 
    paymentData?: any
  ): Promise<{ success: boolean; transactionId?: string }> {
    const response = await apiClient.post<ApiResponse<any>>(`/invoices/${id}/pay`, {
      paymentMethodId,
      paymentData
    });
    return response.data.data;
  }

  // GET /invoices/pending - Facturas pendientes de pago
  async getPending(): Promise<Invoice[]> {
    const response = await apiClient.get<ApiResponse<Invoice[]>>('/invoices/pending');
    return response.data.data;
  }

  // GET /invoices/paid - Facturas pagadas
  async getPaid(): Promise<Invoice[]> {
    const response = await apiClient.get<ApiResponse<Invoice[]>>('/invoices/paid');
    return response.data.data;
  }

  // GET /invoices/overdue - Facturas vencidas
  async getOverdue(): Promise<Invoice[]> {
    const response = await apiClient.get<ApiResponse<Invoice[]>>('/invoices/overdue');
    return response.data.data;
  }

  // POST /invoices/{id}/send-reminder - Enviar recordatorio de pago
  async sendPaymentReminder(id: string): Promise<void> {
    await apiClient.post(`/invoices/${id}/send-reminder`);
  }

  // GET /invoices/summary - Resumen de facturas
  async getSummary(): Promise<{
    totalPending: number;
    totalPaid: number;
    totalOverdue: number;
    pendingCount: number;
    paidCount: number;
    overdueCount: number;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/invoices/summary');
    return response.data.data;
  }
}

export const invoiceService = new InvoiceService();