import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {

	const [searchQuery, setSearchQuery] = useState('');

	return (
		<div className="relative hidden md:block">
			<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
			<input
				type="text"
				placeholder="Buscar mascotas, citas, cuidadores..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 w-80 text-sm placeholder-gray-500"
			/>
			{searchQuery && (
				<button
					onClick={() => setSearchQuery('')}
					className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
				>
					×
				</button>
			)}
		</div>
	);
}
