import { LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '../../../../../store/AuthStore';
import { useNavigate } from 'react-router';

export default function MenuItems() {

	const logout = useAuthStore((state) => state.logout);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<div className="py-2">
			<button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors duration-200 text-left">
				<User className="w-4 h-4 text-gray-500" />
				<span className="text-sm text-gray-700">Ver Perfil</span>
			</button>
			<button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors duration-200 text-left">
				<Settings className="w-4 h-4 text-gray-500" />
				<span className="text-sm text-gray-700">Configuración</span>
			</button>
			<hr className="my-2 border-gray-100" />
			<button
				onClick={handleLogout}
				className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-left"
			>
				<LogOut className="w-4 h-4" />
				<span className="text-sm">Cerrar Sesión</span>
			</button>
		</div>
	);
}
