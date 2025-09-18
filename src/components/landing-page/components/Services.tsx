import React from 'react';

export default function Services(): React.ReactElement {
	return (
		<section
			className="container section"
			id="servicios"
			aria-labelledby="tit-serv"
		>
			<h2 id="tit-serv">Servicios para consentir</h2>
			<div className="services">
				<div className="service">
					<h3>Grooming & Spa</h3>
					<p>
						Baño, masaje y corte de uñas. Turnos de 30–60 min.{' '}
						<span className="badge">Desde $35.000</span>
					</p>
				</div>
				<div className="service">
					<h3>Vet Express</h3>
					<p>
						Chequeo general y vacunación con veterinarios aliados.
						Agéndalo online.
					</p>
				</div>
				<div className="service">
					<h3>Pet Taxi</h3>
					<p>
						Recogemos y llevamos a tu peludo con seguridad y cariño.
						Cobertura urbana.
					</p>
				</div>
			</div>
		</section>
	);
}
