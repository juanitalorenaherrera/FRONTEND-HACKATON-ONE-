import { Bell, ChevronDown, LogOut, Menu, PawPrint, Search, Settings, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { useAuth } from '../../../context/AuthContext';

// Para una búsqueda global, crearíamos un contexto similar a este:
// import { useSearch } from '../../../context/SearchContext';

// Las funciones helper para obtener display name y color pueden vivir aquí o en un archivo de utils.
const getRoleDisplayName = (role?: string): string => { /* ... */ };
const getRoleColor = (role?: string): string => { /* ... */ };

// Ya no necesita la prop `onMenuToggle` si el estado del sidebar se maneja globalmente
export function DashboardHeader() {
    const { user, isLoading, logout } = useAuth();
    const navigate = useNavigate();

    // El estado del menú desplegable es local y está bien aquí.
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Para una búsqueda global, esto vendría de un contexto.
    // const { searchQuery, setSearchQuery } = useSearch(); 
    const [searchQuery, setSearchQuery] = useState(''); // Mantenemos local por simplicidad

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        // Navegamos a una página de resultados de búsqueda
        navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    };

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
    };

    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-xl flex items-center justify-center shadow-lg`}>
                        <PawPrint className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {isLoading ? <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" /> : getRoleDisplayName(user?.role)}
                        </h1>
                        <p className="text-sm text-gray-600">
                            {isLoading ? <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-1" /> : `Hola, ${user?.firstName || 'Usuario'}!`}
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar en Petcare..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 w-80 text-sm"
                        />
                    </form>

                    {/* Notifications */}
                    <div className="relative">
                        <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <div className="absolute -top-0 -right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg text-white text-xs font-bold">3</div>
                        </button>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                            {/* ... Contenido del botón del perfil (avatar, nombre) ... */}
                        </button>

                        {/* Dropdown Menu (usando Links para navegación) */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50">
                                {/* ... Cabecera del dropdown ... */}
                                <div className="py-2">
                                    <Link to="/dashboard/profile" onClick={() => setShowProfileMenu(false)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100">
                                        <UserIcon className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">Ver Perfil</span>
                                    </Link>
                                    <Link to="/dashboard/settings" onClick={() => setShowProfileMenu(false)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100">
                                        <Settings className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">Configuración</span>
                                    </Link>
                                    <hr className="my-2 border-gray-100" />
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600">
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm">Cerrar Sesión</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Click outside handler para cerrar el menú */}
            {showProfileMenu && <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>}
        </header>
    );
}