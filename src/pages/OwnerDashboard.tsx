import { useAuthStore } from '@/store/AuthStore';
import { createPet } from '@/services/petService';
import { useForm } from 'react-hook-form';
import type { CreatePetRequest } from '@/types/pets';
import { useGetPets } from '@/features/pets/hooks/useGetPets';



export default function OwnerDashboard() {
	const user = useAuthStore((state) => state.profile);
	const { register, handleSubmit } = useForm<CreatePetRequest>();
	const { pets, isLoading } = useGetPets();

	const handleAddPet = async (data: CreatePetRequest) => {
		// Añadimos una comprobación aquí también por si el usuario cierra sesión
		// mientras está en la página.
		if (!user) {
			alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
			return;
		}
		try {
			const newPet = await createPet(
				user.id,
				data.name,
				data.species,
				data.breed,
				data.age,
				data.weight,
				data.gender,
				data.color,
				data.physicalDescription,
				data.medications,
				data.allergies,
				data.specialNotes
			);
			return newPet;
		} catch (err) {
			console.error(err);
			alert('Error al registrar la mascota.');
		}
	};

	// Si la página se carga y el usuario se está autenticando,
	// el 'ProtectedRoute' y este estado de carga lo manejan.
	if (isLoading) {
		return <p>Cargando datos del dueño...</p>;
	}

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<h1 className="text-3xl font-bold mb-6">Panel de Dueño 🐾</h1>

			{/* Sección para añadir mascotas */}
			<div className="p-6 bg-white rounded-xl shadow mb-8">
				<h2 className="text-xl font-semibold mb-4">
					Registrar una nueva mascota
				</h2>
				<form
					onSubmit={handleSubmit(handleAddPet)}
					className="flex flex-col sm:flex-row gap-4"
				>
					<input
						type="text"
						placeholder="Nombre de la mascota"
						className="p-2 border rounded-md flex-grow"
						{...register('name', { required: true })}
					/>
					<input
						type="text"
						placeholder="Especie (ej: Perro, Gato)"
						className="p-2 border rounded-md flex-grow"
						{...register('species', { required: true })}
					/>
					<input
						type="text"
						placeholder="Raza (dejar en blanco si no aplica)"
						className="p-2 border rounded-md flex-grow"
						{...register('breed', { required: false })}
					/>
					<input
						type="number"
						placeholder="Edad (en años)"
						className="p-2 border rounded-md flex-grow"
						{...register('age', { required: true })}
					/>
					<input
						type="number"
						step="0.1"
						placeholder="Peso (ej: 12.5 kg)"
						className="p-2 border rounded-md flex-grow"
						{...register('weight', { required: true })}
					/>
					<input
						type="text"
						placeholder="Género (ej: Macho, Hembra)"
						className="p-2 border rounded-md flex-grow"
						{...register('gender', { required: true })}
					/>
					<input
						type="text"
						placeholder="Color (Descripción del color)"
						className="p-2 border rounded-md flex-grow"
						{...register('color', { required: true })}
					/>
					<textarea
						placeholder="Descripción física (escalofríos, marcas, etc.)"
						className="p-2 border rounded-md flex-grow"
						{...register('physicalDescription', {
							required: false,
						})}
					/>
					<input
						type="text"
						placeholder="Medicaciones (dejar en blanco si no aplica)"
						className="p-2 border rounded-md flex-grow"
						{...register('medications', { required: false })}
					/>
					<input
						type="text"
						placeholder="Alergias (dejar en blanco si no aplica)"
						className="p-2 border rounded-md flex-grow"
						{...register('allergies', { required: false })}
					/>
					<textarea
						placeholder="Notas especiales (dejar en blanco si no aplica)"
						className="p-2 border rounded-md flex-grow"
						{...register('specialNotes', { required: false })}
					/>
					<button
						type="submit"
						className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
					>
						Añadir
					</button>
				</form>
			</div>

			{/* Sección para listar mascotas */}
			<div className="p-6 bg-white rounded-xl shadow">
				<h2 className="text-xl font-semibold mb-4">Tus Mascotas</h2>
				{pets.length > 0 ? (
					<ul className="space-y-2">
						{pets.map((pet) => (
							<li
								key={pet.id}
								className="p-3 bg-gray-100 rounded-md"
							>
								<strong>{pet.name}</strong> ({pet.species})
							</li>
						))}
					</ul>
				) : (
					<p>Aún no has registrado ninguna mascota.</p>
				)}
			</div>
		</div>
	);
}
