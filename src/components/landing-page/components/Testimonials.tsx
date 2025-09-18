import React from 'react';

export default function Testimonials(): React.ReactElement {
	return (
		<section className="container section" aria-labelledby="tit-test">
			<h2 id="tit-test">Humanos felices, colitas moviéndose</h2>
			<div className="slider">
				<input type="radio" name="t" id="t1" defaultChecked />
				<input type="radio" name="t" id="t2" />
				<input type="radio" name="t" id="t3" />
				<div className="slides">
					<figure className="slide">
						<blockquote>
							“Mi perro ahora corre a la puerta cuando llega el
							mensajero. Sabe que hay premios.”
						</blockquote>
						<figcaption className="subtle">— Laura P.</figcaption>
					</figure>
					<figure className="slide">
						<blockquote>
							“La cama es una nube real. Nunca lo vi dormir tan
							profundo.”
						</blockquote>
						<figcaption className="subtle">— Andrés Q.</figcaption>
					</figure>
					<figure className="slide">
						<blockquote>
							“Agendé el spa desde el cel. Llegó perfumado y con
							un pañuelito precioso.”
						</blockquote>
						<figcaption className="subtle">— Paola G.</figcaption>
					</figure>
				</div>
				<div className="dots">
					<label className="dot" htmlFor="t1"></label>
					<label className="dot" htmlFor="t2"></label>
					<label className="dot" htmlFor="t3"></label>
				</div>
			</div>
		</section>
	);
}
