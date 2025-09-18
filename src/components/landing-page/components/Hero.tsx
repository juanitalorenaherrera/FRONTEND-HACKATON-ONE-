import React from 'react';

export default function Hero(): React.ReactElement {
	return (
		<section className="container hero" id="home">
			<div>
				<h1>
					Todo para tu mejor amigo — con estilo, cariño y envíos
					veloces
				</h1>
				<p>
					Alimento premium, juguetes irresistibles, camitas suaves y
					servicios de spa 🛁. Mimarlos nunca fue tan fácil.
				</p>
				<div className="cta">
					<a className="btn" href="#productos">
						Ver productos
					</a>
					<a className="btn btn-outline" href="#servicios">
						Reservar servicio
					</a>
				</div>
				<div className="hero-grid mt-5">
					<div className="stat">
						<b>+4.9★</b>
						<div>Opiniones felices</div>
					</div>
					<div className="stat">
						<b>24h</b>
						<div>Entrega urbana</div>
					</div>
					<div className="stat">
						<b>+1.2k</b>
						<div>Productos</div>
					</div>
					<div className="stat">
						<b>Garantía</b>
						<div>Cambio fácil</div>
					</div>
				</div>
			</div>
			<div className="hero-card">
				<img
					src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop"
					alt="Perro feliz con correa"
					className="rounded-2xl aspect-[4/3] object-cover"
				/>
			</div>
		</section>
	);
}
