import React from 'react';

export default function Contact(): React.ReactElement {
	return (
		<section
			className="container section"
			id="contacto"
			aria-labelledby="tit-news"
		>
			<h2 id="tit-news">Únete al club peludo</h2>
			<p className="subtle">
				Recibe descuentos y tips de cuidado una vez por semana.
			</p>
			<form className="hero-card grid rounded-2xl shadow-lg grid-cols-[1fr_auto] gap-3 items-center max-w-2xl mx-auto">
				<label htmlFor="email" className="subtle grid-column: 1 / -1">
					Tu correo
				</label>
				<input
					id="email"
					name="email"
					type="email"
					placeholder="tu@email.com"
					required
					className="px-3.5 py-4 rounded-full border-2 solid border-[rgba(255,255,255,.14)] bg-[#0f1115]; color-(--text) outline-0"
				/>
				<button className="btn" type="submit">
					Suscribirme
				</button>
			</form>
		</section>
	);
}
