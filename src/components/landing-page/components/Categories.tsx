import React from 'react';

export default function Categories(): React.ReactElement {
	return (
		<section className="container section" aria-labelledby="tit-cats">
			<h2 id="tit-cats">Compra por categoría</h2>
			<div className="categories">
				<a className="cat" href="#alimento">
					<div className="icon">🍗</div>
					<div>
						<div className="meta">Alimento</div>
						<small>Seco, húmedo, premios</small>
					</div>
				</a>
				<a className="cat" href="#juguetes">
					<div className="icon">🦴</div>
					<div>
						<div className="meta">Juguetes</div>
						<small>Mordedores, pelotas</small>
					</div>
				</a>
				<a className="cat" href="#cuidado">
					<div className="icon">🧴</div>
					<div>
						<div className="meta">Cuidado</div>
						<small>Higiene y salud</small>
					</div>
				</a>
				<a className="cat" href="#accesorios">
					<div className="icon">🎒</div>
					<div>
						<div className="meta">Accesorios</div>
						<small>Correas, camas</small>
					</div>
				</a>
			</div>
		</section>
	);
}
