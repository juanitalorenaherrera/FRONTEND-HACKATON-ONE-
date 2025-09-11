import { Search } from 'lucide-react';
import { useState } from 'react';

export default function MobileSearch() {

	const [searchQuery, setSearchQuery] = useState('');

	return (
		<div className="md:hidden mt-4">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
				<input
					type="text"
					placeholder="Buscar..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
				/>
			</div>
		</div>
	);
}
