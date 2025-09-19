// src/types/index.ts


// Basado en el enum InvoiceStatus.java del backend
export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED';
export type Role = 'CLIENT' | 'SITTER' | 'ADMIN';

/**
 * Representa la información resumida de una factura.
 * Coincide con el DTO `InvoiceSummaryResponse` del backend.
 *
 */
export interface Invoice {
    id: number;
    amount: number;
    date: string; // Las fechas se reciben como strings en formato ISO (e.g., "2025-09-16")
    status: InvoiceStatus;
}

/**
 * Representa un método de pago guardado.
 * Coincide con el DTO `PaymentMethodResponse` del backend.
 *
 */
export interface PaymentMethod {
    id: number;
    cardHolderName: string;
    last4: string;
    expirationDate: string; // e.g., "12/28"
    isDefault: boolean;
    brand: string; // e.g., "Visa", "Mastercard"
}

// Puedes añadir también otros tipos que ya uses en la aplicación aquí
// para tener un único punto de verdad para los tipos de datos.