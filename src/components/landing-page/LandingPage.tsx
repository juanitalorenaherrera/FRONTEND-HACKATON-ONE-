import React from 'react';
import HeaderLandingPage from './components/HeaderLandingPage';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Products from './components/Products';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

export default function LandingPage(): React.ReactElement {
	return (
		<>
			<HeaderLandingPage />
			<Hero />
			<Categories />
			<Products />
			<Testimonials />
			<Footer />
		</>
	);
}
