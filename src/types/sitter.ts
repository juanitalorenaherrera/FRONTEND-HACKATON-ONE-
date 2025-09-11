// ========== INTERFACES ALINEADAS CON BACKEND ==========

/**
 * Interface para el perfil completo de cuidador
 * Basada en SitterProfileDTO del backend
 */
export interface SitterProfileDTO {
	id?: number;
	userId?: number;
	bio?: string;
	hourlyRate?: number;
	servicingRadius?: number;
	profileImageUrl?: string;
	verified?: boolean;
	availableForBookings?: boolean;
}

/**
 * Interface para resumen de cuidador
 * Basada en SitterProfileSummary del backend
 */
export interface SitterProfileSummary {
	id: number;
	sitterName: string;
	profileImageUrl?: string;
	hourlyRate?: number;
	averageRating?: number;
	isVerified: boolean;
	location?: string;
}

/**
 * Interface para registro de cuidador
 * Basada en SitterRegisterDTO del backend
 */
export interface SitterRegisterRequest {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	address?: string;
	phoneNumber?: string;
}

/**
 * Interface para crear perfil de cuidador
 */
export interface CreateSitterProfileRequest {
	bio?: string;
	hourlyRate: number;
	servicingRadius?: number;
	profileImageUrl?: string;
	availableForBookings?: boolean;
}

/**
 * Interface para respuesta de autenticación
 */
export interface AuthResponse {
	token: string;
	role: string;
	user: {
		id: number;
		email: string;
		firstName: string;
		lastName: string;
	};
}

/**
 * Interface para cuidador con información extendida (para FindSittersView)
 */
export interface ExtendedSitter extends SitterProfileSummary {
	// Campos adicionales para la UI
	specialty?: string;
	image?: string;
	rating?: number;
	totalServices?: number;
	lastService?: string;
	pets?: string[];
	isAvailable?: boolean;
	distance?: string;
	bio?: string;
	nextAvailable?: string;
	specialties?: string[];
}


export interface NewService {
	sitterId: number;
	serviceType: string;
	name: 'caminata';
	description: string;
	price: number;
	durationInMinutes: 120;
}