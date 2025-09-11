// features/pets/hooks/usePetsContext.ts

import { PetsContext } from '../context/PetsContext';
import { useContext } from 'react';

export function usePetsContext() {
    const context = useContext(PetsContext);
    if (context === undefined) {
        throw new Error('usePetsContext must be used within a PetsProvider');
    }
    return context;
}