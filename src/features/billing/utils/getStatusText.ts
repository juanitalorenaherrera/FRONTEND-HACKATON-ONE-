import { InvoiceStatus, type Invoice } from "../types/invoices";


export const getStatusText = (invoice: Invoice) => {
	switch (invoice.status) {
		case InvoiceStatus.PAID:
			return 'Pagada';
		case InvoiceStatus.PENDING:
			return 'Pendiente';
		case InvoiceStatus.CANCELLED:
			return 'Cancelada';
	}
};
