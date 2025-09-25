import { isCancelled, isPaid, isPending } from "../constants/invoicesConstants";
import type { Invoice } from "../types/invoices";

export const getStatusColor = (invoice: Invoice) => {
	if (isPaid(invoice)) return 'success';
	if (isPending(invoice)) return 'warning';
	if (isCancelled(invoice)) return 'destructive';
	return 'default';
};
