

export default function QuickActions() {
	return (
		<div className="hidden lg:flex items-center gap-2">
			<button className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all duration-200">
				Nuevo Servicio
			</button>
			<button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
				Emergencia
			</button>
		</div>
	);
}
