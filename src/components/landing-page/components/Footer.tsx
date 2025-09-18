import React, { useEffect } from 'react';

export default function Footer(): React.ReactElement {

	useEffect(() => {
		const yearElement = document.getElementById('year');
		if (yearElement) {
			yearElement.textContent = new Date().getFullYear().toString();
		}
	}, []);

	return (
		<footer>
			<div className="container footer-grid">
				<div>
					<div className="brand mb-16">
						<div className="logo" aria-hidden="true">
							<span>🐾</span>
						</div>
						<span>Petcare</span>
					</div>
					<p className="subtle">
						Amor por las mascotas y obsesión por el buen servicio.
						Envíos en 24h en tu ciudad.
					</p>
					<p className="copy">
						© <span id="year"></span> PetStore. Todos los derechos
						reservados.
					</p>
				</div>
				<div>
					<h4>Enlaces</h4>
					<nav className="subtle">
						<a href="#productos">Productos</a>
						<br />
						<a href="#servicios">Servicios</a>
						<br />
						<a href="#adopcion">Adopción</a>
						<br />
						<a href="#contacto">Contacto</a>
					</nav>
				</div>
				<div>
					<h4>Soporte</h4>
					<div className="subtle">
						<div>WhatsApp: +57 300 000 0000</div>
						<div>Correo: hola@petstore.test</div>
						<div>Cra 123 #45–67, Bogotá</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
