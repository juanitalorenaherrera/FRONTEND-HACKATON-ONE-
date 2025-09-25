import { BrandCard } from "../types/invoices";

export const getCardGradient = (brand: string) => {
		switch (brand.toLowerCase()) {
			case BrandCard.Visa:
				return 'bg-gradient-to-br from-blue-500 to-blue-700';
			case BrandCard.Mastercard:
				return 'bg-gradient-to-br from-red-500 to-orange-600';
			case BrandCard.AmericanExpress:
				return 'bg-gradient-to-br from-green-600 to-teal-700';
			default:
				return 'bg-gradient-to-br from-gray-600 to-gray-800';
		}
	};