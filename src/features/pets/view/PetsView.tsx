import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { PetsEmptyState, PetsErrorState, PetsLoadingState } from '../components/PetStates';

import { PetModal } from '../components/PetModal';
import { PetsHeader } from '../components/PetsHeader';
import { useAuthStore } from '../../../store/AuthStore';
import { useEffect } from 'react';
import { usePetsActions } from '../../pets/hooks/usePetsActions';

export const PetsView = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const {
    pets,
    stats,
    isLoading,
    error,
    modalState,
    loadPets,
    showAddModal,
    hideModal,
    handleCreatePet,
    handleUpdatePet
  } = usePetsActions();

  // Carga inicial de las mascotas
  useEffect(() => {
    if (user?.id) {
      loadPets();
    }
  }, [user?.id]); // Dependencia simplificada

  const renderContent = () => {
    // 1. Estado de carga inicial
    if (isLoading && pets.length === 0) {
      return <PetsLoadingState />;
    }

    // 2. Estado de error
    if (error) {
      return <PetsErrorState error={error} onRetry={loadPets} />;
    }

    // 3. Estado vacío (sin mascotas)
    if (!isLoading && pets.length === 0) {
      return <PetsEmptyState onAddPet={showAddModal} />;
    }
    
    // 4. Contenido principal (la lista de mascotas o el perfil)
    // React Router se encargará de renderizar el componente correcto aquí
    return <Outlet context={{ pets, stats, showEditModal, showAddModal }} />;
  };

  return (
    <>
      <div className="space-y-6">
        <PetsHeader
          petCount={pets.length}
          isLoading={isLoading && pets.length > 0} // Muestra spinner de actualización
          onAddPet={showAddModal}
        />
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* El Modal vive aquí pero es controlado por el hook */}
      <PetModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        petToEdit={modalState.pet}
        onSubmit={modalState.type === 'add' ? handleCreatePet : handleUpdatePet}
      />
    </>
  );
};