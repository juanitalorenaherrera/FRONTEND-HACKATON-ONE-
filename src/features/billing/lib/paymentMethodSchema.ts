import { z } from 'zod';

// Esquema para el modo de adición
export const addPaymentMethodSchema = z.object({
	cardHolderName: z.string().min(1, 'El nombre del titular es requerido'),
	cardNumber: z
		.string()
		.min(19, 'El número de tarjeta debe tener 16 dígitos')
		.max(19, 'El número de tarjeta debe tener 16 dígitos'),
	expirationDate: z
		.string()
		.min(5, 'La fecha de expiración es requerida')
		.max(5, 'La fecha de expiración es requerida'),
	cvv: z
		.string()
		.min(3, 'El CVV debe tener 3 o 4 dígitos')
		.max(4, 'El CVV debe tener 3 o 4 dígitos'),
	isDefault: z.boolean().optional(),
});
export type AddPaymentMethodFormInputs = z.infer<typeof addPaymentMethodSchema>;
// Esquema para el modo de edición
export const editPaymentMethodSchema = z.object({
	cardHolderName: z.string().min(1, 'El nombre del titular es requerido'),
	isDefault: z.boolean().optional(),
});

export type EditPaymentMethodFormInputs = z.infer<
	typeof editPaymentMethodSchema
>;
