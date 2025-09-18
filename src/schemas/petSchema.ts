import { z } from 'zod';

export const petSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
    species: z.string().min(3, 'La especie es requerida (ej. Perro, Gato).'),
    breed: z.string().min(3, 'La raza es requerida.'),
    age: z.coerce.number().min(0, 'La edad no puede ser negativa.').max(50, 'Edad inválida.'),
    weight: z.coerce.number().min(0.1, 'El peso debe ser mayor a 0.').max(200, 'Peso inválido.'),
    color: z.string().min(3, 'El color es requerido.'),
    medications: z.string().optional(),
    allergies: z.string().optional(),
    specialNotes: z.string().optional(),
});

export type PetFormData = z.infer<typeof petSchema>;