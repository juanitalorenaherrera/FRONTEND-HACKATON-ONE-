// features/pets/components/profile/PetProfileHeader.tsx

import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

import type { Pet } from '../../types';
import { usePetsStore } from '../../../../store/PetStore';

export function PetProfileHeader({ pet }: { pet: Pet }) {
    const setSelectedPet = usePetsStore((state) => state.setSelectedPet);
    // const { showEditPetModal, deletePet } = usePetsActions();

    const handleBack = () => {
        setSelectedPet(null);
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
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold">{pet.name}</h1>
                <p className="text-gray-600">{pet.breed} • {pet.species}</p>
            </div>
        </>
    );
}