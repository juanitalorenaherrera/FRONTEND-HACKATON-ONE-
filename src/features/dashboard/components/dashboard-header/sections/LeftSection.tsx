import { Menu, PawPrint } from 'lucide-react';
import {
	displayName,
	getRoleColor,
} from '../../../../../utils/dashboardHeader';
import { useAuthStore } from '../../../../../store/AuthStore';

interface LeftSectionProps {
	onMenuToggle: () => void;
}

export default function LeftSection({ onMenuToggle }: LeftSectionProps) {
	const user = useAuthStore((state) => state.profile);
	const isLoading = useAuthStore(
		(state) => state.isAuth === false && state.profile === null
	);

	return (
		<div className="flex items-center gap-6">
			<button
				onClick={onMenuToggle}
				className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
			>
				<Menu className="w-5 h-5 text-gray-600" />
			</button>

			<div className="flex items-center gap-4">
				{/* Logo pequeño para contexto */}
				<div
					className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(
						user?.role
					)} rounded-xl flex items-center justify-center shadow-lg`}
				>
					<PawPrint className="w-5 h-5 text-white" />
				</div>

				<div>
					<h1 className="text-xl font-bold text-gray-900">
						{isLoading ? (
							<div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
						) : (
							displayName(user?.role)
						)}
					</h1>
					<div className="text-sm text-gray-600">
						{isLoading ? (
							<div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-1"></div>
						) : user ? (
							`Hola, ${user.firstName}! Que tengas un gran día`
						) : (
							'Bienvenido al sistema'
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
