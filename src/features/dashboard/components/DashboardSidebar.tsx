// src/features/dashboard/components/DashboardSidebar.tsx
import { Link } from 'react-router';
import { usePetsStore } from '@/store/PetStore';
import { useAuthStore } from '@/store/AuthStore';
import { NAV_ITEMS } from '@/utils/NavItems';

interface ClientSidebarProps {
	activeItem: string;
}

export function ClientSidebar({ activeItem }: ClientSidebarProps) {
	// 1. Consumimos los contextos para obtener datos dinámicos.
	const user = useAuthStore((state) => state.profile);
	const pets = usePetsStore((state) => state.pets);

	return (
		<aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
			{/* Logo y título (sin cambios) */}
			<div className="p-6 border-b border-gray-100">{/* ... */}</div>

			{/* Menú de Navegación (ahora usa <Link>) */}
			<nav className="flex-1 p-4">
				<div className="space-y-1">
					{NAV_ITEMS.map((item) => {
						const Icon = item.icon;
						const isActive = activeItem === item.id;

						return (
							// 2. Reemplazamos <button> por <Link> para la navegación.
							<Link
								key={item.id}
								to={item.path}
								className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors group ${
									isActive
										? 'bg-orange-50 text-orange-700 font-bold'
										: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
								}`}
							>
								<div className="flex items-center gap-3">
									<Icon
										className={`w-5 h-5 ${
											isActive
												? 'text-orange-600'
												: 'text-gray-400 group-hover:text-gray-600'
										}`}
									/>
									<span>{item.label}</span>
								</div>

								{/* Aquí podrías poner lógica de notificaciones real */}
							</Link>
						);
					})}
				</div>
			</nav>

			{/* Pie de Página con Perfil de Usuario (ahora dinámico) */}
			<div className="p-4 border-t border-gray-100 mt-auto">
				{user && (
					<div className="p-3 rounded-lg bg-gray-50">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
								<span className="text-white font-bold">
									{user.firstName?.charAt(0)}
								</span>
							</div>
							<div className="flex-1">
								<p className="font-semibold text-gray-900 text-sm">{`${user.firstName} ${user.lastName}`}</p>
								<p className="text-xs text-gray-500 capitalize">
									{user.role?.toLowerCase()}
								</p>
							</div>
							<div
								className="w-2 h-2 bg-green-500 rounded-full"
								title="Online"
							></div>
						</div>

						<div className="mt-3 grid grid-cols-2 gap-2 text-center">
							<div className="bg-orange-100 rounded-lg p-2">
								<p className="text-lg font-bold text-orange-600">
									{pets.length}
								</p>
								<p className="text-xs text-orange-700">
									Mascotas
								</p>
							</div>
							<div className="bg-green-100 rounded-lg p-2">
								{/* Aquí podrías obtener el número de citas de un futuro BookingContext */}
								<p className="text-lg font-bold text-green-600">
									0
								</p>
								<p className="text-xs text-green-700">Citas</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</aside>
	);
}
