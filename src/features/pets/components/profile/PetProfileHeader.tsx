// features/pets/components/profile/PetProfileHeader.tsx

import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

import type { Pet } from '../../types';
import { usePetsContext } from '../../hooks/usePetsContext';

export function PetProfileHeader({ pet }: { pet: Pet }) {
    const { dispatch } = usePetsContext();
    // const { showEditPetModal, deletePet } = usePetsActions();

    const handleBack = () => {
        dispatch({ type: 'SET_SELECTED_PET', payload: null });
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <button onClick={handleBack} className="...">
                    <ArrowLeft className="w-5 h-5" /> Volver
                </button>
                <div className="flex gap-3">
                    <button /* onClick={() => showEditPetModal(pet)} */ className="...">
                        <Edit className="w-4 h-4" /> Editar
                    </button>
                    <button /* onClick={() => deletePet(pet.id)} */ className="...">
                        <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm ...">
                {/* ... JSX para mostrar el avatar, nombre, raza, etc., usando el objeto `pet` ... */}
            </div>
        </>
    );
}