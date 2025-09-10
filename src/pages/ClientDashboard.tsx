// ===========================================
// ClientDashboard.tsx - Versión Final Refactorizada
// ===========================================

import React, { useCallback, useState } from 'react';

import { ClientSidebar } from '../features/dashboard/components/DashboardSidebar';
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';
import { DashboardStats } from '../features/dashboard/components/DashboardStats';
import { FindSittersView } from '../features/sitters/components/FindSittersView';
import MainDashboardView from '../features/dashboard/MainDashboardView';
import { PetProfile } from '../features/pets/components/PetProfile';
import { BookingsView } from '../features/booking/views/BookingView';
import { PetsView } from '../features/pets/PetsView';

// Tipos para las vistas disponibles
type DashboardView = 
  | 'dashboard'
  | 'pets'
  | 'petProfile'
  | 'findSitters'
  | 'appointments'
  | 'favorites'
  | 'notifications'
  | 'billing'
  | 'profile'
  | 'settings';

interface ClientDashboardProps {
  className?: string;
}

/**
 * Componente principal del dashboard del cliente.
 * Maneja la navegación entre diferentes vistas y coordina el estado global.
 */
export function ClientDashboard({ className = '' }: ClientDashboardProps) {
  // Estados de navegación
  const [activeView, setActiveView] = useState<DashboardView>('dashboard');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // ========================================
  // HANDLERS DE NAVEGACIÓN GENERAL
  // ========================================

  /**
   * Maneja la selección de elementos del sidebar
   */
  const handleNavItemSelect = useCallback((item: string) => {
    console.log('Navigation item selected:', item);
    setActiveView(item as DashboardView);
    setSelectedPetId(null); // Reset pet selection on navigation
  }, []);

  /**
   * Maneja la selección de una mascota para ver su perfil
   */
  const handlePetSelect = useCallback((petId: string) => {
    console.log('Pet selected for profile view:', petId);
    setSelectedPetId(petId);
    setActiveView('petProfile');
  }, []);

  /**
   * Maneja el retorno desde el perfil de mascota
   */
  const handleBackFromProfile = useCallback(() => {
    console.log('Back from pet profile');
    setSelectedPetId(null);
    setActiveView('pets');
  }, []);

  // ========================================
  // HANDLERS DE ACCIONES ESPECÍFICAS
  // ========================================

  /**
   * Maneja acciones que requieren navegación a vistas específicas
   */
  const handleNavigationAction = useCallback((action: string, data?: any) => {
    console.log('Navigation action:', action, data);
    
    switch (action) {
      case 'find-sitters':
      case 'hire-sitter':
      case 'view-all-sitters':
      case 'view-sitter-profile':
        setActiveView('findSitters');
        break;
        
      case 'view-appointments':
      case 'schedule-appointment':
        setActiveView('appointments');
        break;
        
      case 'view-pets':
      case 'add-pet':
        setActiveView('pets');
        break;
        
      case 'view-notifications':
        setActiveView('notifications');
        break;
        
      case 'view-favorites':
        setActiveView('favorites');
        break;
        
      case 'view-profile':
        setActiveView('profile');
        break;
        
      case 'view-settings':
        setActiveView('settings');
        break;
        
      case 'emergency':
        // Para emergencias, podría abrir un modal o ir a una vista especial
        console.log('Emergency action triggered');
        break;
        
      case 'recommendation-action':
        // Manejar acciones de recomendaciones
        if (data?.action) {
          console.log('Recommendation action:', data.action);
          // Podrías mapear acciones específicas de recomendaciones aquí
        }
        break;
        
      default:
        console.log('Unknown navigation action:', action);
        break;
    }
  }, []);

  // ========================================
  // RENDERIZADO DE VISTAS
  // ========================================

  /**
   * Renderiza el contenido principal según la vista activa
   */
  const renderMainContent = useCallback(() => {
    // Vista especial: perfil de mascota
    if (activeView === 'petProfile' && selectedPetId) {
      return (
        <PetProfile 
          petId={selectedPetId} 
          onBack={handleBackFromProfile} 
        />
      );
    }
    
    // Vistas principales
    switch (activeView) {
      case 'dashboard':
        return (
          <MainDashboardView 
            onPetSelect={handlePetSelect}
            onNavigationAction={handleNavigationAction}
          />
        );
        
      case 'pets':
        return (
          <PetsView 
            onPetSelect={handlePetSelect} 
          />
        );
        
      case 'findSitters':
        return <FindSittersView />;
        
      case 'appointments':
        return <BookingsView />;
        
      case 'favorites':
        return (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Favoritos</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Tus cuidadores favoritos aparecerán aquí para acceso rápido
              </p>
              <button 
                onClick={() => handleNavigationAction('find-sitters')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 font-medium"
              >
                Explorar cuidadores
              </button>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19l1-1h5.586L15 13.586l1-1H21V4a1 1 0 00-1-1H4a1 1 0 00-1 1v14z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Notificaciones</h2>
              <p className="text-gray-600 leading-relaxed">
                Aquí verás todas tus notificaciones importantes sobre citas, recordatorios y actualizaciones
              </p>
            </div>
          </div>
        );
        
      case 'billing':
        return (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Facturación</h2>
              <p className="text-gray-600 leading-relaxed">
                Gestiona tus métodos de pago, historial de facturas y configuración de billing
              </p>
            </div>
          </div>
        );
        
      case 'profile':
        return (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfil</h2>
              <p className="text-gray-600 leading-relaxed">
                Edita tu información personal, foto de perfil y preferencias de cuenta
              </p>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuración</h2>
              <p className="text-gray-600 leading-relaxed">
                Personaliza notificaciones, privacidad y otras configuraciones de la aplicación
              </p>
            </div>
          </div>
        );
        
      default:
        return (
          <MainDashboardView 
            onPetSelect={handlePetSelect}
            onNavigationAction={handleNavigationAction}
          />
        );
    }
  }, [activeView, selectedPetId, handlePetSelect, handleBackFromProfile, handleNavigationAction]);

  // ========================================
  // RENDER PRINCIPAL
  // ========================================

  return (
    <div className={`flex h-screen bg-gray-50 ${className}`}>
      {/* Sidebar de navegación */}
      <ClientSidebar 
        activeItem={activeView} 
        onItemSelect={handleNavItemSelect} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header principal */}
        <DashboardHeader onMenuToggle={() => {}} />

        {/* Contenido principal */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <DashboardStats />
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}