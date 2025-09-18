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
			<form
				className="hero-card"
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr auto',
					gap: '.6rem',
					alignItems: 'center',
					maxWidth: '640px',
				}}
			>
				<label
					htmlFor="email"
					className="subtle"
					style={{ gridColumn: '1 / -1' }}
				>
					Tu correo
				</label>
				<input
					id="email"
					name="email"
					type="email"
					placeholder="tu@email.com"
					required
					style={{
						padding: '.9rem 1rem',
						borderRadius: '999px',
						border: '1px solid rgba(255,255,255,.14)',
						background: '#0f1115',
						color: 'var(--text)',
						outline: 'none',
					}}
				/>
				<button className="btn" type="submit">
					Suscribirme
				</button>
			</form>
		</section>
	);
}
