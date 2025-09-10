// ===========================================
// PetsView.tsx - Corregido con acceso a datos del dashboard
// ===========================================

import React from 'react';
import { MyPetsCard } from './components/MyPetsCard';
import { UpcomingBookingCard } from './components/UpcomingBookingCard';
import { useDashboardData } from '../../features/dashboard/hooks/useDashboardData';

interface PetsViewProps {
    onPetSelect?: (petId: string) => void;
    className?: string;
}

export function PetsView({ onPetSelect, className = '' }: PetsViewProps) {
    // Acceder a los datos del dashboard desde aquí
    const {
        isLoading,
        error,
        refetch,
        userPets,
        userProfile
    } = useDashboardData();

    const handlePetSelect = (petId: number) => {
        console.log('Pet selected from PetsView:', petId);
        if (onPetSelect) {
            onPetSelect(petId.toString());
        }
    };

    const handleAddPet = () => {
        console.log('Add pet clicked from PetsView');
        // Aquí podrías implementar la lógica para agregar mascota
        // o navegar a un formulario de nueva mascota
    };

    const handleRefresh = () => {
        console.log('Refresh pets clicked from PetsView');
        refetch();
    };

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Header de la vista */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Mascotas</h1>
                <p className="text-gray-600">
                    Gestiona la información y cuidado de tus compañeros peludos
                </p>
            </div>

            {/* Main Layout - Side by Side */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* My Pets Section - Takes 2/3 of space */}
                <div className="xl:col-span-2 space-y-6">
                    <MyPetsCard
                        pets={userPets}
                        isLoading={isLoading}
                        error={error}
                        onPetSelect={handlePetSelect}
                        onAddPet={handleAddPet}
                        onRefresh={handleRefresh}
                        maxPetsToShow={12} // Mostrar más mascotas en la vista completa
                        showRefreshButton={true}
                    />
                </div>

                {/* Sidebar - Takes 1/3 of space */}
                <div className="space-y-6">
                    {/* Upcoming Appointments */}
                    <UpcomingBookingCard />
                    
                    {/* Quick Stats Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Estadísticas</h3>
                                <p className="text-sm text-gray-600">Resumen de tus mascotas</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total de mascotas:</span>
                                <span className="font-semibold text-gray-900">{userPets.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Mascotas activas:</span>
                                <span className="font-semibold text-green-600">
                                    {userPets.filter(pet => pet.active).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Especies:</span>
                                <span className="font-semibold text-gray-900">
                                    {new Set(userPets.map(pet => pet.species)).size}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={handleAddPet}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-orange-50 rounded-lg transition-colors duration-200 group"
                            >
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200">
                                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Agregar Mascota</p>
                                    <p className="text-xs text-gray-600">Registra un nuevo compañero</p>
                                </div>
                            </button>
                            
                            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Agendar Cita</p>
                                    <p className="text-xs text-gray-600">Programa un servicio</p>
                                </div>
                            </button>
                            
                            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-green-50 rounded-lg transition-colors duration-200 group">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Chequeo de Salud</p>
                                    <p className="text-xs text-gray-600">Revisar estado general</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}