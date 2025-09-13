import {
	Bell,
	Calendar,
	CreditCard,
	Heart,
	Home,
	PawPrint,
	Settings,
	User,
	Users,
} from 'lucide-react';

export const NAV_ITEMS = [
	{ id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
	{
		id: 'pets',
		icon: PawPrint,
		label: 'Mis Mascotas',
		path: '/dashboard/pets',
	},
	{
		id: 'findSitters',
		icon: Users,
		label: 'Buscar Cuidadores',
		path: '/dashboard/find-sitters',
	},
	{
		id: 'appointments',
		icon: Calendar,
		label: 'Mis Citas',
		path: '/dashboard/bookings',
	}, // Ruta corregida
	{
		id: 'favorites',
		icon: Heart,
		label: 'Favoritos',
		path: '/dashboard/favorites',
	},
	{
		id: 'notifications',
		icon: Bell,
		label: 'Notificaciones',
		path: '/dashboard/notifications',
	},
	{
		id: 'billing',
		icon: CreditCard,
		label: 'Facturación',
		path: '/dashboard/billing',
	},
	{ id: 'profile', icon: User, label: 'Perfil', path: '/dashboard/profile' },
	{
		id: 'settings',
		icon: Settings,
		label: 'Configuración',
		path: '/dashboard/settings',
	},
];
