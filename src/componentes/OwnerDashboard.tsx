import { useState, useEffect, useContext } from 'react';
import type { FormEvent } from 'react';
import { AuthContext } from './AuthContext';
import { addPet, getPets } from './petService';

interface Pet {
	id: string;
	name: string;
	type: string;
}

export default function OwnerDashboard() {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error('OwnerDashboard must be used within AuthProvider');
	const { user } = context;
	const [pets, setPets] = useState<Pet[]>([]);
	const [petName, setPetName] = useState('');
	const [petType, setPetType] = useState('');

	useEffect(() => {
		if (user) {
			getPets(user.token).then(setPets).catch(console.error);
		}
	}, [user]);

	const handleAddPet = async (e: FormEvent) => {
		e.preventDefault();
		if (!user) return;
		try {
			const newPet = await addPet(user.token, {
				name: petName,
				type: petType,
			});
			setPets([...pets, newPet]);
			setPetName('');
			setPetType('');
		} catch {
			alert('Error al registrar mascota');
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Panel de Dueño</h1>
			<form onSubmit={handleAddPet} className="flex gap-2 my-4">
				<input
					type="text"
					placeholder="Nombre de la mascota"
					value={petName}
					onChange={(e) => setPetName(e.target.value)}
					className="p-2 border rounded"
				/>
				<input
					type="text"
					placeholder="Tipo (perro, gato...)"
					value={petType}
					onChange={(e) => setPetType(e.target.value)}
					className="p-2 border rounded"
				/>
				<button className="bg-green-500 text-white p-2 rounded">
					Añadir
				</button>
			</form>

			<h2 className="text-xl mt-4">Tus Mascotas</h2>
			<ul className="list-disc ml-6">
				{pets.map((p) => (
					<li key={p.id}>
						{p.name} ({p.type})
					</li>
				))}
			</ul>
		</div>
	);
}
