// components/billing/InvoiceCard.tsx

import { Calendar, DollarSign, Download, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import React from 'react';
import { motion } from 'framer-motion';
import type { InvoiceCardProps } from '../types/invoices';
import { getStatusColor } from '../utils/getStatusColor';
import { isPending } from '../constants/invoicesConstants';
import { getStatusText } from '../utils/getStatusText';
import { getCardBackground } from '../utils/getCardBackgorund';
import { formatDate } from '../utils/formDate';

export function InvoiceCard({
	invoice,
	onView,
	onDownload,
	onPay,
}: InvoiceCardProps): React.ReactElement {
	const getColor = getStatusColor(invoice);
	const getText = getStatusText(invoice);
	const getBackground = getCardBackground(invoice);
	formatDate(invoice.date);

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ scale: 1.02 }}
			className={`${getBackground} rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg`}
		>
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						<h3 className="font-bold text-lg text-gray-800">
							Factura #{invoice.id}
						</h3>
						<Badge variant={getColor}>{getText}</Badge>
					</div>

					<div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
						<Calendar className="w-4 h-4" />
						<span>{formatDate(invoice.date)}</span>
					</div>

					<div className="flex items-center gap-2">
						<DollarSign className="w-5 h-5 text-gray-700" />
						<span className="text-2xl font-bold text-gray-800">
							$
							{invoice.amount.toLocaleString('es-ES', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</span>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-2 mt-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onView(invoice)}
					className="flex-1 flex items-center justify-center gap-1"
				>
					<Eye className="w-4 h-4" />
					Ver
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={() => onDownload(invoice.id)}
					className="flex-1 flex items-center justify-center gap-1"
				>
					<Download className="w-4 h-4" />
					PDF
				</Button>

				{isPending(invoice) && onPay && (
					<Button
						size="sm"
						onClick={() => onPay(invoice.id)}
						className="flex-1 bg-gradient-to-r from-pet-teal to-pet-blue text-white hover:from-pet-teal/90 hover:to-pet-blue/90"
					>
						Pagar
					</Button>
				)}
			</div>
		</motion.div>
	);
}
