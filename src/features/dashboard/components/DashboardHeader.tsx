import { Bell, ChevronDown, LogOut, Menu, PawPrint, Search, Settings, User } from 'lucide-react';

import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';

interface DashboardHeaderProps {
    onMenuToggle: () => void;
}

const getRoleDisplayName = (role?: string): string => {
    switch (role) {
        case 'CLIENT':
            return 'Panel de Cliente';
        case 'SITTER':
            return 'Panel de Cuidador';
        case 'ADMIN':
            return 'Panel de Administrador';
        default:
            return 'Dashboard';
    }
};

const getRoleColor = (role?: string): string => {
    switch (role) {
        case 'CLIENT':
            return 'from-orange-500 to-orange-600';
        case 'SITTER':
            return 'from-blue-500 to-blue-600';
        case 'ADMIN':
            return 'from-purple-500 to-purple-600';
        default:
            return 'from-gray-500 to-gray-600';
    }
};

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
    const { user, isLoading, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
    };

    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <div className="flex items-center gap-4">
                        {/* Logo pequeño para contexto */}
                        <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-xl flex items-center justify-center shadow-lg`}>
                            <PawPrint className="w-5 h-5 text-white" />
                        </div>
                        
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {isLoading ? (
                                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    getRoleDisplayName(user?.role)
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

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Search Bar Mejorada */}
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

                    {/* Quick Actions */}
                    <div className="hidden lg:flex items-center gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all duration-200">
                            Nuevo Servicio
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
                            Emergencia
                        </button>
                    </div>

                    {/* Notifications */}
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

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                        >
                            <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                                <span className="text-white font-semibold text-sm">
                                    {isLoading ? '...' : (user?.initials || '??')}
                                </span>
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold text-gray-900">
                                    {isLoading ? '...' : user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user?.role?.toLowerCase() || 'cliente'}
                                </p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50">
                                {/* User Info Header */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <span className="text-white font-bold text-sm">
                                                {user?.initials || '??'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                                            </p>
                                            <p className="text-sm text-gray-600">{user?.email}</p>
                                            <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                                                user?.role === 'CLIENT' ? 'bg-orange-100 text-orange-700' :
                                                user?.role === 'SITTER' ? 'bg-blue-100 text-blue-700' :
                                                'bg-purple-100 text-purple-700'
                                            }`}>
                                                {user?.role?.toLowerCase() || 'cliente'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
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
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search - aparece solo en móviles */}
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

            {/* Click outside handler */}
            {showProfileMenu && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                ></div>
            )}
        </header>
    );
}