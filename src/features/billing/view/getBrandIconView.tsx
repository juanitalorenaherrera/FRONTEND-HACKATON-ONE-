import { CreditCard } from "lucide-react";

export const getCardBrandIconView = (brand: string) => {
	// Aquí podrías usar iconos específicos de marcas de tarjetas
	return (
		<>
			<span>{brand}</span>
			<CreditCard className="w-8 h-8" />)
		</>
	);
};
