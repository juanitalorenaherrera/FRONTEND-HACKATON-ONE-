// ===========================================
// utils/sitterUtils.ts - Utilidades para cuidadores
// ===========================================

export const SITTER_SPECIALTIES = [
    'Paseo',
    'Cuidado nocturno',
    'Cuidado diurno',
    'Medicación',
    'Entrenamiento básico',
    'Compañía',
    'Transporte veterinario',
    'Alimentación especial'
] as const;

export const AVAILABILITY_STATUS = {
    AVAILABLE: 'available',
    BUSY: 'busy',
    UNAVAILABLE: 'unavailable'
} as const;

export function formatDistance(distance?: string): string {
    if (!distance) return 'Distancia no disponible';
    return distance;
}

export function formatRating(rating?: number): string {
    if (!rating) return '0.0';
    return rating.toFixed(1);
}

export function formatHourlyRate(rate?: number): string {
    if (!rate) return 'Tarifa no disponible';
    return `${rate.toLocaleString()}/hora`;
}

export function getAvailabilityColor(isAvailable?: boolean): string {
    return isAvailable ? 'text-green-600' : 'text-gray-500';
}

export function getAvailabilityText(sitter: any): string {
    if (sitter.isAvailable) {
        return `✓ Disponible ${sitter.nextAvailable || 'ahora'}`;
    }
    return `Próxima disponibilidad: ${sitter.nextAvailable || 'Por consultar'}`;
}

export function truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

export interface SitterFilters {
    location?: string;
    maxDistance?: number;
    minRating?: number;
    maxHourlyRate?: number;
    availableOnly?: boolean;
    searchTerm?: string;
    specialty?: string;
    sortBy?: 'relevance' | 'rating' | 'distance' | 'hourlyRate' | 'name';
    sortDirection?: 'asc' | 'desc';
    verified?: boolean;
    hasReviews?: boolean;
}

// Re-exportamos las funciones ya definidas anteriormente
export { applySitterFilters, sortSitters } from './sitterUtils';

export const mapProfileToExtendedSitter = (profile: SitterProfileDTO): ExtendedSitter => {
  // ...lógica del mapeo...
  return { /* ...datos extendidos para la UI... */ };
};