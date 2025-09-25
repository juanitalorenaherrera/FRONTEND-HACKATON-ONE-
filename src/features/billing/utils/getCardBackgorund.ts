import { isCancelled, isPaid, isPending } from '../constants/invoicesConstants';
import type { Invoice } from '../types/invoices';

export const getCardBackground = (invoice: Invoice) => {
	if (isPaid(invoice))
		return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
	if (isPending(invoice))
		return 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200';
	if (isCancelled(invoice))
		return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200';
	return 'bg-white border-gray-200';
};
