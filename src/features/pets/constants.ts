// features/pets/constants.ts

import type { PetFilters } from './types';

// Le damos el tipo correcto a las constantes
const DEFAULT_SORT_BY: PetFilters['sortBy'] = 'name';
const DEFAULT_SORT_ORDER: PetFilters['sortOrder'] = 'asc';

export const PETS_CONFIG = {
    DEFAULT_SORT_BY,
    DEFAULT_SORT_ORDER,
    MAX_PETS_PER_PAGE: 12,
};
export const PET_SPECIES_OPTIONS = [
    { label: 'Dog', value: 'dog' },
    { label: 'Cat', value: 'cat' },
    { label: 'Bird', value: 'bird' },
    { label: 'Rabbit', value: 'rabbit' },
    { label: 'Reptile', value: 'reptile' },
    { label: 'Other', value: 'other' },
];