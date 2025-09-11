// ========== INTERFACES ==========

/**
 * Interfaz para la respuesta completa de una mascota desde el backend
 * Basada en PetResponse
 */
export interface PetResponse {
	id: number;
	accountId: number;
	accountName: string;
	name: string;
	species: string;
	breed: string;
	age: number;
	weight?: number;
	gender?: string;
	color?: string;
	physicalDescription?: string;
	medications?: string;
	allergies?: string;
	specialNotes?: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Interfaz para la respuesta resumida de mascotas
 * Basada en PetSummaryResponse
 */
export interface PetSummaryResponse {
	id: number;
	accountId: number;
	accountName: string;
	name: string;
	species: string;
	breed: string;
	age: number;
	active: boolean;
	createdAt: string;
}

/**
 * Interfaz para crear una nueva mascota
 * Basada en CreatePetRequest
 */
export interface CreatePetRequest {
	accountId: number;
	name: string;
	species?: string;
	breed?: string;
	age?: number;
	weight?: number;
	gender?: string;
	color?: string;
	physicalDescription?: string;
	medications?: string;
	allergies?: string;
	specialNotes?: string;
}

/**
 * Interfaz para las estadísticas de mascotas
 * Basada en PetStatsResponse
 */
export interface PetStatsResponse {
	totalPets: number;
	activePets: number;
	inactivePets: number;
	petsBySpecies: Record<string, number>;
	petsByGender: Record<string, number>;
	petsByAgeRange: Record<string, number>;
	accountsWithPets: number;
	averagePetsPerAccount: number;
	petsRegisteredLast30Days: number;
	petsRegisteredLast7Days: number;
}
