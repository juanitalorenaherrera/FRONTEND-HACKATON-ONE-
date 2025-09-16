// src/features/pets/pages/PetsView.tsx

import { PetsEmptyState, PetsErrorState, PetsLoadingState } from '../components/states';

import { PetModal } from '../components/PetModal';
import { PetProfile } from '../components/PetProfile';
import { PetStats } from '../components/PetStats';
import { PetsOverview } from '../components/PetsOverview';
import { useAuthStore } from '../../../store/AuthStore';
import { useEffect } from 'react';
import { usePetsActions } from '../hooks/usePetsActions';

// Importamos todos los componentes refactorizados





// Componentes de estado


export function PetsView() {
  const user = useAuthStore((state) => state.profile);
  
  const { 
    pets,
    stats,
    selectedPet,
    isLoading,
    error,
    modalState,
    loadPets,
    refreshPets,
    hideModal
  } = usePetsActions();

  // Carga inicial de mascotas cuando hay usuario
  useEffect(() => {
    if (user?.id && pets.length === 0 && !error) {
      loadPets(user.id);
    }
  }, [user?.id, pets.length, error, loadPets]);

  // Verificación de autenticación
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m8-9a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Requerido
          </h2>
          <p className="text-gray-600">
            Por favor, inicia sesión para ver tus mascotas.
          </p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Mascotas</h1>
          <p className="text-gray-600">Gestiona la información de tus peluditos</p>
        </header>
        
        <PetsErrorState 
          error={error}
          onRetry={() => user?.id && refreshPets(user.id)}
        />
      </div>
    );
  }

  // Estado de carga inicial
  if (isLoading && pets.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Mascotas</h1>
          <p className="text-gray-600">Gestiona la información de tus peluditos</p>
        </header>
        
        <PetsLoadingState />
      </div>
    );
  }

  // Estado vacío (sin mascotas)
  if (!isLoading && pets.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Mascotas</h1>
          <p className="text-gray-600">Gestiona la información de tus peluditos</p>
        </header>
        
        <PetsEmptyState />
      </div>
    );
  }

  // Vista principal con mascotas
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header principal */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Mascotas</h1>
              <p className="text-gray-600">
                Gestiona la información de tus peluditos ({pets.length} {pets.length === 1 ? 'mascota' : 'mascotas'})
              </p>
            </div>
            
            {/* Indicador de carga durante actualización */}
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Actualizando...</span>
              </div>
            )}
          </div>
        </header>

        <main className="space-y-6">
          {/* Vista condicional: Lista de mascotas o perfil individual */}
          {selectedPet ? (
            // Vista de perfil individual
            <PetProfile />
          ) : (
            // Vista de lista con estadísticas
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Contenido principal */}
              <div className="lg:col-span-3">
                <PetsOverview />
              </div>
              
              {/* Sidebar con estadísticas */}
              <div className="lg:col-span-1">
                <PetStats />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal para agregar/editar mascotas */}
      {modalState.isOpen && (
        <PetModal
          isOpen={modalState.isOpen}
          onClose={hideModal}
          pet={modalState.pet}
          type={modalState.type}
        />
      )}
    </div>
  );
}