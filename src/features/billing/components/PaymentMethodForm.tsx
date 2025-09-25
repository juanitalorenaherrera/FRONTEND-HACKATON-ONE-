import { CreditCard, X } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import { Mode, type PaymentMethod } from '../types/invoices';
import {
	addPaymentMethodSchema,
	editPaymentMethodSchema,
	type AddPaymentMethodFormInputs,
	type EditPaymentMethodFormInputs,
} from '../lib/paymentMethodSchema';
// Definimos el tipo de datos del formulario basado en el esquema Zod

interface PaymentMethodFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: Omit<PaymentMethod, 'id'>) => Promise<void>;
	mode?: Mode;
	initialData?: PaymentMethod;
}

export function PaymentMethodForm({
	isOpen,
	onClose,
	onSubmit,
	mode = Mode.ADD,
	initialData,
}: PaymentMethodFormProps): React.ReactElement {
	// Seleccionamos el esquema de validación según el modo
	const schema =
		mode === Mode.ADD ? addPaymentMethodSchema : editPaymentMethodSchema;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
	} = useForm<AddPaymentMethodFormInputs | EditPaymentMethodFormInputs>({
		resolver: zodResolver(schema),
		defaultValues: {
			cardHolderName: initialData?.cardHolderName || '',
			isDefault: initialData?.isDefault || false,
			// Los campos de tarjeta no se inicializan en modo ADD
			cardNumber: '',
			expirationDate: '',
			cvv: '',
		},
	});

	// Función para manejar el envío del formulario
	const handleFormSubmit = async (
		data: AddPaymentMethodFormInputs | EditPaymentMethodFormInputs
	) => {
		try {
			if (mode === Mode.ADD) {
				const addData = data as AddPaymentMethodFormInputs;
				const last4 = addData.cardNumber.replace(/\s/g, '').slice(-4);
				const brand = getCardBrand(addData.cardNumber);

				await onSubmit({
					cardHolderName: addData.cardHolderName,
					last4,
					expirationDate: addData.expirationDate,
					isDefault: addData.isDefault || false,
					brand,
				});
			} else if (mode === Mode.EDIT) {
				const editData = data as EditPaymentMethodFormInputs;
				// En el modo de edición, solo se puede actualizar isDefault
				await onSubmit({
					cardHolderName: editData.cardHolderName,
					last4: initialData!.last4,
					expirationDate: initialData!.expirationDate,
					isDefault: editData.isDefault || false,
					brand: initialData!.brand,
				});
			}

			onClose();
			toast.success('Método de pago guardado exitosamente');
			reset(); // Limpia los campos del formulario
		} catch (error) {
			toast.error('Error al procesar el método de pago');
			console.error(error);
		}
	};

	// Funciones de formato de entrada
	const formatCardNumber = (value: string) => {
		const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
		return v.match(/.{1,4}/g)?.join(' ') || '';
	};

	const formatExpirationDate = (value: string) => {
		const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
		if (v.length >= 2) {
			return v.substring(0, 2) + '/' + v.substring(2, 4);
		}
		return v;
	};

	const getCardBrand = (cardNumber: string): string => {
		const number = cardNumber.replace(/\s/g, '');
		if (number.startsWith('4')) return 'Visa';
		if (number.startsWith('5') || number.startsWith('2'))
			return 'Mastercard';
		if (number.startsWith('3')) return 'American Express';
		return 'Desconocida';
	};

	// Usamos watch para observar los valores de los campos formateados en el UI
	watch('cardNumber');
	watch('expirationDate');

	if (!isOpen) return <div>null</div>; // Corregido: `null` es más apropiado que `<div>null</div>`

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
			>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
						<CreditCard className="w-6 h-6 text-pet-teal" />
						{mode === Mode.ADD ? 'Agregar' : 'Editar'} Método de
						Pago
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="space-y-4"
				>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Nombre del titular
						</label>
						<input
							type="text"
							{...register('cardHolderName')}
							className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pet-teal focus:border-transparent"
							placeholder="Juan Pérez"
							disabled={mode === Mode.EDIT}
						/>
						{errors.cardHolderName && (
							<p className="mt-1 text-sm text-red-600">
								{errors.cardHolderName.message}
							</p>
						)}
					</div>

					{mode === Mode.ADD && (
						<>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Número de tarjeta
								</label>
								<input
									type="text"
									{...register('cardNumber', {
										onChange: (e) => {
											e.target.value = formatCardNumber(
												e.target.value
											);
										},
									})}
									className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pet-teal focus:border-transparent font-mono"
									placeholder="1234 5678 9012 3456"
									maxLength={19}
									inputMode="numeric"
								/>
								{'cardNumber' in errors &&
									errors.cardNumber && (
										<p className="mt-1 text-sm text-red-600">
											{errors.cardNumber.message}
										</p>
									)}
							</div>

							<div className="flex gap-4">
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Fecha de expiración
									</label>
									<input
										type="text"
										{...register('expirationDate', {
											onChange: (e) => {
												e.target.value =
													formatExpirationDate(
														e.target.value
													);
											},
										})}
										className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pet-teal focus:border-transparent font-mono"
										placeholder="MM/AA"
										maxLength={5}
										inputMode="numeric"
									/>
									{'expirationDate' in errors &&
										errors.expirationDate && (
											<p className="mt-1 text-sm text-red-600">
												{errors.expirationDate.message}
											</p>
										)}
								</div>
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										CVV
									</label>
									<input
										type="text"
										{...register('cvv', {
											onChange: (e) => {
												e.target.value =
													e.target.value.replace(
														/\D/g,
														''
													);
											},
										})}
										className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pet-teal focus:border-transparent font-mono text-center"
										placeholder="123"
										maxLength={4}
										inputMode="numeric"
									/>
									{'cvv' in errors && errors.cvv && (
										<p className="mt-1 text-sm text-red-600">
											{errors.cvv.message}
										</p>
									)}
								</div>
							</div>
						</>
					)}

					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="isDefault"
							{...register('isDefault')}
							className="w-4 h-4 text-pet-teal bg-gray-100 border rounded focus:ring-pet-teal focus:ring-2"
						/>
						<label
							htmlFor="isDefault"
							className="text-sm text-gray-700"
						>
							Establecer como método predeterminado
						</label>
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="flex-1"
							disabled={isSubmitting}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							className="flex-1 bg-gradient-to-r from-pet-teal to-pet-blue text-white"
							disabled={isSubmitting}
						>
							{isSubmitting
								? 'Guardando...'
								: mode === Mode.ADD
								? 'Agregar'
								: 'Actualizar'}
						</Button>
					</div>
				</form>
			</motion.div>
		</div>
	);
}
