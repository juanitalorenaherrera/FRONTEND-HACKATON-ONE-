import React from 'react';
import { Link } from 'react-router';

export default function HeaderLandingPage(): React.ReactElement {
	return (
		<header>
			<div className="container nav">
				<div className="brand">
					<div className="logo" aria-hidden="true">
						<span>🐾</span>
					</div>
					<a href="#" aria-label="Inicio">
						<span>Petcare</span>
					</a>
				</div>

				<input
					type="checkbox"
					id="nav-toggle"
					aria-label="Abrir menú"
				/>
				<label htmlFor="nav-toggle" className="burger" aria-hidden="true">
					☰
				</label>

				<nav className="nav-links" aria-label="Principal">
					<a href="#productos">Productos</a>
					<a href="#servicios">Servicios</a>
					<a href="#adopcion">Adopción</a>
					<a href="#contacto">Contacto</a>
					<Link className="btn" to="/login">
						Iniciar Sesión
					</Link>
				</nav>
			</div>
		</header>
	);
}
