import React from 'react';

export default function Products(): React.ReactElement {
	return (
		<section
			className="container section"
			id="productos"
			aria-labelledby="tit-prods"
		>
			<h2 id="tit-prods">Destacados de la semana</h2>
			<div className="grid">
				<article className="card">
					<div className="media" aria-hidden="true">
						🐶
					</div>
					<div className="content">
						<h3>Alimento Premium Puppy 2kg</h3>
						<div className="price">
							<b>$69.900</b>
							<span className="badge">-15%</span>
						</div>
						<p className="subtle">
							Con DHA y prebióticos. Cachorros felices,
							barriguitas sanas.
						</p>
					</div>
					<div className="actions">
						<a className="btn" href="#">
							Agregar
						</a>
						<a className="btn btn-outline" href="#">
							Detalles
						</a>
					</div>
				</article>
				<article className="card">
					<div className="media" aria-hidden="true">
						🐱
					</div>
					<div className="content">
						<h3>Cama nube viscoelástica</h3>
						<div className="price">
							<b>$129.900</b>
						</div>
						<p className="subtle">
							Reduce la ansiedad y protege articulaciones. Zzz
							garantizado.
						</p>
					</div>
					<div className="actions">
						<a className="btn" href="#">
							Agregar
						</a>
						<a className="btn btn-outline" href="#">
							Detalles
						</a>
					</div>
				</article>
				<article className="card">
					<div className="media" aria-hidden="true">
						🦴
					</div>
					<div className="content">
						<h3>Kit mordedores durables (x3)</h3>
						<div className="price">
							<b>$39.900</b>
						</div>
						<p className="subtle">
							Material no tóxico. Dientes felices, muebles
							intactos.
						</p>
					</div>
					<div className="actions">
						<a className="btn" href="#">
							Agregar
						</a>
						<a className="btn btn-outline" href="#">
							Detalles
						</a>
					</div>
				</article>
			</div>
		</section>
	);
}
