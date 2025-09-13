import { useState } from 'react';

interface Service {
	id: number;
	name: string;
	price: number;
}

interface Caregiver {
	id: number;
	name: string;
	services: Service[];
}

export default function OwnerBooking() {
	const [caregivers] = useState<Caregiver[]>([
		{
			id: 1,
			name: 'Ana López',
			services: [
				{ id: 1, name: 'Paseo de perro', price: 10 },
				{ id: 2, name: 'Cuidado en casa (1h)', price: 15 },
			],
		},
		{
			id: 2,
			name: 'Carlos Pérez',
			services: [
				{ id: 3, name: 'Guardería por día', price: 40 },
				{ id: 4, name: 'Visita a domicilio', price: 20 },
			],
		},
	]);

	const [selectedCaregiver, setSelectedCaregiver] =
		useState<Caregiver | null>(null);
	const [selectedService, setSelectedService] = useState<Service | null>(
		null
	);
	const [date, setDate] = useState('');
	const [message, setMessage] = useState('');

	const handleReservation = () => {
		if (!selectedCaregiver || !selectedService || !date) {
			alert('Por favor completa todos los campos.');
			return;
		}

		setMessage(
			`✅ Reserva confirmada con ${selectedCaregiver.name} para ${selectedService.name} el día ${date}.`
		);
	};

	return (
		<div className='p-5 max-w-[600px] m-auto' >
			<h2>🐶 Reservar un Servicio</h2>

			{/* Selección de cuidador */}
			<section>
				<h3>👩‍⚕️ Selecciona un cuidador</h3>
				<select
					value={selectedCaregiver?.id || ''}
					onChange={(e) => {
						const caregiver = caregivers.find(
							(c) => c.id === Number(e.target.value)
						);
						setSelectedCaregiver(caregiver || null);
						setSelectedService(null);
					}}
				>
					<option value="">-- Selecciona --</option>
					{caregivers.map((c) => (
						<option key={c.id} value={c.id}>
							{c.name}
						</option>
					))}
				</select>
			</section>

			{/* Selección de servicio */}
			{selectedCaregiver && (
				<section>
					<h3>🛠️ Servicios de {selectedCaregiver.name}</h3>
					<select
						value={selectedService?.id || ''}
						onChange={(e) => {
							const service = selectedCaregiver.services.find(
								(s) => s.id === Number(e.target.value)
							);
							setSelectedService(service || null);
						}}
					>
						<option value="">-- Selecciona un servicio --</option>
						{selectedCaregiver.services.map((s) => (
							<option key={s.id} value={s.id}>
								{s.name} - ${s.price}
							</option>
						))}
					</select>
				</section>
			)}

			{/* Fecha */}
			{selectedService && (
				<section>
					<h3>📅 Fecha</h3>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</section>
			)}

			{/* Botón */}
			<div className='mt-5'>
				<button onClick={handleReservation}>Reservar</button>
			</div>

			{/* Confirmación */}
			{message && (
				<div className='mt-5 text-green-500 font-bold'
				>
					{message}
				</div>
			)}
		</div>
	);
}
