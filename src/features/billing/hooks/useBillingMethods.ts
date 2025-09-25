
import { useState } from "react";
import type { Invoice, PaymentMethod } from "../types/invoices";

export const useBillingMethods = () => {
	const [showPaymentForm, setShowPaymentForm] = useState(false);
	const [editingMethod, setEditingMethod] =
		useState<PaymentMethod | null>(null);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
		null
	);
	const [showInvoiceModal, setShowInvoiceModal] = useState(false);

	const handleViewInvoice = (invoice: Invoice) => {
		setSelectedInvoice(invoice);
		setShowInvoiceModal(true);
	};

	const handleEditPaymentMethod = (method: PaymentMethod) => {
		setEditingMethod(method);
		setShowPaymentForm(true);
	};

	const handleClosePaymentForm = () => {
		setShowPaymentForm(false);
		setEditingMethod(null);
	};

	const handleCloseInvoiceModal = () => {
		setShowInvoiceModal(false);
		setSelectedInvoice(null);
	};

	return {
		showInvoiceModal,
		showPaymentForm,
		setShowPaymentForm,
		editingMethod,
		selectedInvoice,
		handleViewInvoice,
		handleCloseInvoiceModal,
		handleClosePaymentForm,
		handleEditPaymentMethod
	}
}