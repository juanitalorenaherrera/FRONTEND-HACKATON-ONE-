import { useState, useEffect, useContext, type FormEvent } from 'react';
import { AuthContext } from './AuthContext';
import { addService, getServices } from './sitterService';

interface Service {
	id: string;
	type: string;
	price: string;
}

export default function SitterDashboard() {
	const context = useContext(AuthContext);
	if (!context) throw new Error('SitterDashboard must be used within AuthProvider');
	const { user } = context;
	const [services, setServices] = useState<Service[]>([]);
	const [serviceType, setServiceType] = useState('');
	const [price, setPrice] = useState('');

	useEffect(() => {
		if (user) {
			getServices(user.token).then(setServices).catch(console.error);
		}
	}, [user]);

	const handleAddService = async (e: FormEvent) => {
		e.preventDefault();
		if (!user) return;
		try {
			const newService = await addService(user.token, {
				type: serviceType,
				price,
			});
			setServices([...services, newService]);
			setServiceType('');
			setPrice('');
		} catch {
			alert('Error al registrar servicio');
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Panel de Cuidador</h1>
			<form onSubmit={handleAddService} className="flex gap-2 my-4">
				<input
					type="text"
					placeholder="Tipo de servicio (paseo, guardería...)"
					value={serviceType}
					onChange={(e) => setServiceType(e.target.value)}
					className="p-2 border rounded"
				/>
				<input
					type="number"
					placeholder="Precio"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
					className="p-2 border rounded"
				/>
				<button className="bg-blue-500 text-white p-2 rounded">
					Añadir
				</button>
			</form>

			<h2 className="text-xl mt-4">Tus Servicios</h2>
			<ul className="list-disc ml-6">
				{services.map((s) => (
					<li key={s.id}>
						{s.type} – ${s.price}
					</li>
				))}
			</ul>
		</div>
	);
}
