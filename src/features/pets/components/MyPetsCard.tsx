// ===========================================
// sections/MyPets/MyPetsCard.tsx - Corregido
// ===========================================

import { AlertCircle, Heart, Loader2, MoreVertical, Plus, RefreshCw } from 'lucide-react';
import { generateDefaultAvatar, getPetImage } from '../../../utils/dashboardUtils';

import ImageWithFallback from '../../../components/ui/ImageWithFallback';
import type { Pet } from '../../../types/dashboardData';
import React from 'react';

interface MyPetsCardProps {
    pets: Pet[];
    isLoading?: boolean;
    error?: string | null;
    onPetSelect?: (petId: number) => void;
    onAddPet?: () => void;
    onRefresh?: () => void;
    maxPetsToShow?: number;
    showRefreshButton?: boolean;
    className?: string;
}

export function MyPetsCard({ 
    pets = [],
    isLoading = false,
    error = null,
    onPetSelect, 
    onAddPet,
    onRefresh,
    maxPetsToShow = 8,
    showRefreshButton = false,
    className = ''
}: MyPetsCardProps) {
    
    // Función para obtener la imagen de la mascota
    const getPetImageUrl = (pet: Pet): string => {
        return getPetImage(pet.species);
    };

    // Función para formatear la edad
    const formatAge = (age: number): string => {
        if (age === 1) return '1 año';
        return `${age} años`;
    };

    // Función para determinar si es favorita (primera mascota activa)
    const isPetFavorite = (pet: Pet): boolean => {
        const activePets = pets.filter(p => p.active);
        return activePets.length > 0 && activePets[0].id === pet.id;
    };

    // Obtener solo mascotas activas
    const activePets = pets.filter(pet => pet.active);
    const petsToShow = activePets.slice(0, maxPetsToShow);
    const hasMorePets = activePets.length > maxPetsToShow;
    const totalCount = activePets.length;

    // Componente Header
    const Header = () => (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">
                        Mis Mascotas
                    </h3>
                    <p className="text-gray-600">
                        {totalCount > 0 ? `${totalCount} mascota${totalCount > 1 ? 's' : ''} activa${totalCount > 1 ? 's' : ''}` : 'Sin mascotas registradas'}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                {totalCount > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            {totalCount} activa{totalCount > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
                
                {showRefreshButton && onRefresh && !isLoading && (
                    <button 
                        onClick={onRefresh}
                        className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                        title="Actualizar mascotas"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                )}
                
                {onAddPet && (
                    <button 
                        onClick={onAddPet}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">Agregar</span>
                    </button>
                )}
            </div>
        </div>
    );

    // Contenedor principal
    const MainContainer = ({ children }: { children: React.ReactNode }) => (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ${className}`}>
            {children}
        </div>
    );

    // Estado de carga
    if (isLoading) {
        return (
            <MainContainer>
                <Header />
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        <p className="text-gray-600">Cargando mascotas...</p>
                    </div>
                </div>
            </MainContainer>
        );
    }

    // Estado de error
    if (error) {
        return (
            <MainContainer>
                <Header />
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                            <div className="space-y-1">
                                <p className="font-medium text-red-800">Error al cargar mascotas</p>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                            {onRefresh && (
                                <button 
                                    onClick={onRefresh}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Intentar de nuevo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </MainContainer>
        );
    }

    // Estado vacío
    if (totalCount === 0) {
        return (
            <MainContainer>
                <Header />
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                        No tienes mascotas registradas
                    </h4>
                    <p className="text-gray-600 mb-6">
                        Agrega tu primera mascota para comenzar a cuidar mejor de ella
                    </p>
                    {onAddPet && (
                        <button 
                            onClick={onAddPet}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center gap-2 mx-auto"
                        >
                            <Plus className="w-5 h-5" />
                            Registrar mi primera mascota
                        </button>
                    )}
                </div>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <Header />

            {/* Pets Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {petsToShow.map((pet) => (
                    <div 
                        key={pet.id}
                        className="bg-gray-50 rounded-2xl p-4 hover:bg-orange-50 hover:border-orange-200 border border-transparent transition-all duration-200 cursor-pointer group"
                        onClick={() => onPetSelect?.(pet.id)}
                    >
                        {/* Pet Content */}
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <ImageWithFallback
                                    src={getPetImageUrl(pet)}
                                    alt={`${pet.name} - ${pet.species}`}
                                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-200"
                                    fallbackSrc={generateDefaultAvatar(pet.name)}
                                />
                                {isPetFavorite(pet) && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                        <Heart className="w-2 h-2 text-white fill-current" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 truncate text-sm" title={pet.name}>
                                    {pet.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-0.5 rounded-full">
                                        {pet.species}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {formatAge(pet.age)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 truncate mt-1" title={pet.breed}>
                                    {pet.breed}
                                </p>
                            </div>

                            {/* Action */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPetSelect?.(pet.id);
                                }}
                                className="flex-shrink-0 p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-100 rounded-lg transition-colors duration-200"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ver más mascotas */}
            {hasMorePets && (
                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-3">
                        Mostrando {petsToShow.length} de {totalCount} mascotas
                    </p>
                    <button 
                        onClick={() => console.log('Ver todas las mascotas')}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors duration-200"
                    >
                        Ver todas las mascotas
                    </button>
                </div>
            )}
        </MainContainer>
    );
}