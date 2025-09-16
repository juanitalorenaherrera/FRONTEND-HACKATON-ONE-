import { z } from 'zod';

// Esquema de validación para el formulario de login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El correo es obligatorio.' })
    .email({ message: 'Debe ser un correo electrónico válido.' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

// Extraemos el tipo de TypeScript directamente del esquema de Zod
export type LoginFormData = z.infer<typeof loginSchema>;