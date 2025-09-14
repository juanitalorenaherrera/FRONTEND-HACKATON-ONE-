// features/pets/components/PetProfile.tsx

import { PetProfileHeader } from './profile/PetProfileHeader';
import { PetProfileTabs } from './profile/PetProfileTabs';
import { PetsLoadingState } from './states';
import { usePetsStore } from '../../../store/PetStore';

export function PetProfile() {
    const state = usePetsStore((store) => store);
    const { selectedPet, isLoading } = state;

    // Si no hay mascota seleccionada, no se muestra nada.
    // Esto es manejado por el componente padre `PetsViewContent`.
    if (!selectedPet) {
        // Si está cargando la lista inicial, se podría mostrar un loader aquí también.
        return isLoading ? <PetsLoadingState /> : null;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <PetProfileHeader pet={selectedPet} />
            <PetProfileTabs pet={selectedPet} />
        </div>
    );
}