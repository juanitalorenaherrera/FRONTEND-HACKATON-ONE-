import { useContext } from 'react';
import { SittersContext } from '@/features/sitters/context/sittersContext';

export function useSittersContext() {
    const context = useContext(SittersContext);
    if (context === undefined) {
        throw new Error('useSittersContext must be used within a SittersProvider');
    }
    return context;
}