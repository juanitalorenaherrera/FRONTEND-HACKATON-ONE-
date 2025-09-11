import { Bell } from 'lucide-react';

export default function Notifications() {
	return (
		<div className="relative">
			<button className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 relative group">
				<Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
				<div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
					<span className="text-white text-xs font-bold">3</span>
				</div>
				{/* Pulse animation para notificaciones */}
				<div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping opacity-20"></div>
			</button>
		</div>
	);
}
