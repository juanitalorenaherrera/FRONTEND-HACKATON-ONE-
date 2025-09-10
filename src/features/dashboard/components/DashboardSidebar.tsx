// src/components/clientDashboard/ClientSidebar.tsx

import { Bell, Calendar, CreditCard, Heart, Home, PawPrint, Settings, User, Users } from 'lucide-react'

interface ClientSidebarProps {
    activeItem: string
    onItemSelect: (item: string) => void
}

export function ClientSidebar({ activeItem, onItemSelect }: ClientSidebarProps) {
    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null },
        { id: 'pets', icon: PawPrint, label: 'Mis Mascotas', badge: null },
        { id: 'findSitters', icon: Users, label: 'Buscar Cuidadores', badge: null },
        { id: 'appointments', icon: Calendar, label: 'Reservas', badge: '2' },
        { id: 'favorites', icon: Heart, label: 'Favoritos', badge: null },
        { id: 'notifications', icon: Bell, label: 'Notificaciones', badge: '3' },
        { id: 'billing', icon: CreditCard, label: 'Facturación', badge: null },
        { id: 'profile', icon: User, label: 'Perfil', badge: null },
        { id: 'settings', icon: Settings, label: 'Configuración', badge: null },
    ]

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
            {/* Logo y título */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <PawPrint className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">PetCare</h2>
                        <p className="text-sm text-gray-500">Tu compañero de confianza</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeItem === item.id
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => onItemSelect(item.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200 shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 transition-colors ${
                                        isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'
                                    }`} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                
                                {/* Badge de notificaciones */}
                                {item.badge && (
                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px]">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-900">María García</p>
                        <p className="text-sm text-gray-500">Cliente Premium</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-orange-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-orange-600">3</p>
                        <p className="text-xs text-orange-700">Mascotas</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-green-600">12</p>
                        <p className="text-xs text-green-700">Servicios</p>
                    </div>
                </div>
            </div>
        </div>
    )
}