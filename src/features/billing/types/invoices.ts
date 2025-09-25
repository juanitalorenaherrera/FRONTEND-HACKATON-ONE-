export interface InvoiceCardProps {
	invoice: Invoice;
	onView: (invoice: Invoice) => void;
	onDownload: (invoiceId: number) => void;
	onPay?: (invoiceId: number) => void;
}

export enum BrandCard {
	Visa = 'visa',
	Mastercard = 'mastercard',
	AmericanExpress = 'american express',
	Maestro = 'maestro',
	Unknown = 'unknown'
}

// Basado en el enum InvoiceStatus.java del backend
export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED'
};

export enum Mode {
	ADD = 'add',
	EDIT = 'edit',
}

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

export interface InvoiceDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	invoice: Invoice | null;
	onDownload: (invoiceId: number) => void;
	onPay?: (invoiceId: number) => void;
}

export interface PaymentMethodCardProps {
	method: PaymentMethod;
	onDelete: (id: number) => void;
	onSetDefault: (id: number) => void;
	onEdit?: (method: PaymentMethod) => void;
}