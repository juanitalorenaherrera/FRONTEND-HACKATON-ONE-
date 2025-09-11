export const getColorClasses = (color: string): Record<string, string> => {
	switch (color) {
		case 'orange':
			return {
				bg: 'bg-gradient-to-br from-orange-100 to-orange-200',
				icon: 'text-orange-600',
				border: 'border-orange-200',
				hover: 'hover:border-orange-300 hover:shadow-orange-100',
			};
		case 'teal':
			return {
				bg: 'bg-gradient-to-br from-teal-100 to-teal-200',
				icon: 'text-teal-600',
				border: 'border-teal-200',
				hover: 'hover:border-teal-300 hover:shadow-teal-100',
			};
		case 'blue':
			return {
				bg: 'bg-gradient-to-br from-blue-100 to-blue-200',
				icon: 'text-blue-600',
				border: 'border-blue-200',
				hover: 'hover:border-blue-300 hover:shadow-blue-100',
			};
		case 'green':
			return {
				bg: 'bg-gradient-to-br from-green-100 to-green-200',
				icon: 'text-green-600',
				border: 'border-green-200',
				hover: 'hover:border-green-300 hover:shadow-green-100',
			};
		default:
			return {
				bg: 'bg-gradient-to-br from-gray-100 to-gray-200',
				icon: 'text-gray-600',
				border: 'border-gray-200',
				hover: 'hover:border-gray-300 hover:shadow-gray-100',
			};
	}
};
