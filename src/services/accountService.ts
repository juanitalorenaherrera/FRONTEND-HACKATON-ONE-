import { Account, PaymentMethod, PaymentMethodDTO, UpdateAccountDTO } from '../types/common.types';

import { ApiResponse } from '../types/api.types';
import { apiClient } from './api';

export class AccountService {
  // GET /accounts/{id} - Datos de cuenta
  async getAccount(id: string): Promise<Account> {
    const response = await apiClient.get<ApiResponse<Account>>(`/accounts/${id}`);
    return response.data.data;
  }

  // PUT /accounts/{id} - Actualizar cuenta
  async updateAccount(id: string, accountData: UpdateAccountDTO): Promise<Account> {
    const response = await apiClient.put<ApiResponse<Account>>(`/accounts/${id}`, accountData);
    return response.data.data;
  }

  // POST /accounts/{id}/upload-avatar - Subir foto de perfil
  async uploadAvatar(id: string, avatarFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await apiClient.post<ApiResponse<{ avatarUrl: string }>>(
      `/accounts/${id}/upload-avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.avatarUrl;
  }

  // GET /payment-methods - Métodos de pago guardados
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get<ApiResponse<PaymentMethod[]>>('/payment-methods');
    return response.data.data;
  }

  // POST /payment-methods - Añadir nuevo método
  async addPaymentMethod(paymentData: PaymentMethodDTO): Promise<PaymentMethod> {
    const response = await apiClient.post<ApiResponse<PaymentMethod>>('/payment-methods', paymentData);
    return response.data.data;
  }

  // PUT /payment-methods/{id}/set-default - Establecer como predeterminado
  async setDefaultPaymentMethod(id: string): Promise<void> {
    await apiClient.put(`/payment-methods/${id}/set-default`);
  }

  // DELETE /payment-methods/{id} - Eliminar método
  async deletePaymentMethod(id: string): Promise<void> {
    await apiClient.delete(`/payment-methods/${id}`);
  }

  // POST /accounts/change-password - Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/accounts/change-password', {
      currentPassword,
      newPassword
    });
  }

  // POST /accounts/enable-2fa - Activar autenticación de dos factores
  async enable2FA(): Promise<{ qrCode: string; backupCodes: string[] }> {
    const response = await apiClient.post<ApiResponse<any>>('/accounts/enable-2fa');
    return response.data.data;
  }

  // POST /accounts/disable-2fa - Desactivar autenticación de dos factores
  async disable2FA(code: string): Promise<void> {
    await apiClient.post('/accounts/disable-2fa', { code });
  }

  // GET /accounts/activity-log - Log de actividades de la cuenta
  async getActivityLog(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/accounts/activity-log');
    return response.data.data;
  }

  // POST /accounts/deactivate - Desactivar cuenta
  async deactivateAccount(reason?: string): Promise<void> {
    await apiClient.post('/accounts/deactivate', { reason });
  }

  // POST /accounts/export-data - Solicitar exportación de datos
  async requestDataExport(): Promise<void> {
    await apiClient.post('/accounts/export-data');
  }
}

export const accountService = new AccountService();