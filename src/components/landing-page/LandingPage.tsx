import React from 'react';
import HeaderLandingPage from './components/HeaderLandingPage';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Products from './components/Products';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Services from './components/Services';
import Contact from './components/Contact';

export default function LandingPage(): React.ReactElement {
	return (
		<main className='max-w-[1080px] m-auto'>
			<HeaderLandingPage />
			<Hero />
			<Categories />
			<Products />
			<Services />
			<Testimonials />
			<Contact />
			<Footer />
		</main>
	);
}
