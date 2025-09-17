import { z } from 'zod';

export const registerSchema = z.object({
	firstName: z
		.string({ error: 'El campo Nombre es obligatorio' })
		.min(2, 'El nombre debe tener al menos 2 caracteres'),
	lastName: z
		.string({ error: 'El campo Apellido es obligatorio' })
		.min(2, 'El apellido debe tener al menos 2 caracteres'),
	email: z.email('Ingresa un email válido'),
	password: z
		.string({error: 'La contraseña es obligatoria'})
		.min(8, 'La contraseña debe tener al menos 6 caracteres'),
	address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
	phoneNumber: z
		.string()
		.regex(/^\+?[\d\s-()]+$/, 'Ingresa un número de teléfono válido'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
