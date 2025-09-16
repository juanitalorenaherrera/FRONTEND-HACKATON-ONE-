// features/pets/components/profile/PetProfileHeader.tsx

import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

import type { Pet } from '../../types';
import { usePetsActions } from '../../hooks/usePetsActions';

export function PetProfileHeader({ pet }: { pet: Pet }) {
    const { 
        selectPet, 
        showEditPetModal, 
        deletePet,
        isLoading 
    } = usePetsActions();

    const handleBack = () => {
        selectPet(null);
    };

    const handleEdit = () => {
        showEditPetModal(pet);
    };

    const handleDelete = () => {
        deletePet(pet.id);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <button 
                    onClick={handleBack} 
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={isLoading}
                >
                    <ArrowLeft className="w-5 h-5" /> 
                    Volver
                </button>
                <div className="flex gap-3">
                    <button 
                        onClick={handleEdit}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Edit className="w-4 h-4" /> 
                        Editar
                    </button>
                    <button 
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 className="w-4 h-4" /> 
                        Eliminar
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