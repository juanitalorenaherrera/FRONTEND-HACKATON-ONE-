import type { Invoice } from "../types/invoices";

export const isPending = (invoice: Invoice) => invoice.status === 'PENDING';
export const isPaid = (invoice: Invoice) => invoice.status === 'PAID';
export const isCancelled = (invoice: Invoice) => invoice.status === 'CANCELLED';