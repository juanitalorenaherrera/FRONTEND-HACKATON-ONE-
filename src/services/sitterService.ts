// ===========================================
// services/sitterService.ts - Servicio completo alineado con backend
// ===========================================

import type {
    AuthResponse,
    CreateSitterProfileRequest,
    SitterProfileDTO,
    SitterProfileSummary,
    SitterRegisterRequest,
} from '../types/sitter';

import type { ExtendedSitter } from '@/features/sitters/types';
import type { Service } from '@/pages/SitterDashboard';
import type { ServiceOffering } from '@/features/booking/types';
import axios from './auth';

// AHORA (Correcto 👍)





// 👇 1. Importa el tipo ServiceOffering que creamos


const API_URL = '/api/sitter-profiles';
const USERS_API_URL = '/api/users';
const SERVICE_OFFERINGS_URL = '/api/services'; // URL base para servicios


// ========== SERVICIOS DE PERFILES ==========

/**
 * Crea un perfil de cuidador para el usuario autenticado
 */
export const createSitterProfile = async (
	profileData: CreateSitterProfileRequest
): Promise<SitterProfileDTO> => {
	try {
		const response = await axios.post<SitterProfileDTO>(API_URL, profileData);
		return response.data;
	} catch (error) {
		console.error('Error creating sitter profile:', error);
		throw new Error('No se pudo crear el perfil de cuidador');
	}
};

/**
 * Obtiene el perfil de un cuidador específico
 */
export const getSitterProfile = async (
	userId: number
): Promise<SitterProfileDTO> => {
	try {
		const response = await axios.get<SitterProfileDTO>(
			`${API_URL}/${userId}`
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching sitter profile:', error);
		throw new Error('No se pudo cargar el perfil del cuidador');
	}
};

/**
 * Obtiene todos los perfiles de cuidadores (solo admin)
 */
export const getAllSitterProfiles = async (): Promise<SitterProfileDTO[]> => {
	try {
		const response = await axios.get<SitterProfileDTO[]>(API_URL);
		return response.data;
	} catch (error) {
		console.error('Error fetching all sitter profiles:', error);
		throw new Error('No se pudieron cargar los perfiles de cuidadores');
	}
};

/**
 * Actualiza un perfil de cuidador
 */
export const updateSitterProfile = async (
	userId: number,
	profileData: CreateSitterProfileRequest
): Promise<SitterProfileDTO> => {
	try {
		const response = await axios.put<SitterProfileDTO>(`${API_URL}/${userId}`, profileData);
		return response.data;
	} catch (error) {
		console.error('Error updating sitter profile:', error);
		throw new Error('No se pudo actualizar el perfil de cuidador');
	}
};

/**
 * Elimina un perfil de cuidador
 */
export const deleteSitterProfile = async (userId: number): Promise<void> => {
	try {
		await axios.delete(`${API_URL}/${userId}`);
	} catch (error) {
		console.error('Error deleting sitter profile:', error);
		throw new Error('No se pudo eliminar el perfil de cuidador');
	}
};

// ========== SERVICIOS DE USUARIOS/CUIDADORES ==========

/**
 * Obtiene cuidadores activos con sus perfiles
 */
export const getActiveSitters = async (): Promise<ExtendedSitter[]> => {
    try {
        // Tu lógica actual aquí es funcional. Obtiene todos los perfiles y los mapea.
        const profiles = await getAllSitterProfiles();
        return profiles
            .filter((profile) => profile.availableForBookings)
            .map(mapProfileToExtendedSitter); // Asegúrate que esta función mapee bien los datos
    } catch (error) {
        console.error('Error fetching active sitters:', error);
        return [];
    }
};

/**
 * ✅ 2. Obtiene los servicios ofrecidos por un cuidador específico.
 * Esta es la función clave que necesita `useCreateBooking`.
 */
export const getServicesBySitter = async (sitterId: number): Promise<ServiceOffering[]> => {
    try {
        const response = await axios.get<ServiceOffering[]>(`${SERVICE_OFFERINGS_URL}/${sitterId}`);
        const data = response.data;

    // ✅ ESTA ES LA LÓGICA CLAVE:
    // Si la respuesta de la API (data) es un array, la devolvemos tal cual.
    if (Array.isArray(data)) {
      return data;
    }
    // Si la respuesta es un objeto (y no es nulo), lo metemos dentro de un nuevo array y lo devolvemos.
    if (data && typeof data === 'object') {
      return [data];
    }
    
    // Si la respuesta es cualquier otra cosa (null, undefined, etc.), devolvemos un array vacío.
    return [];

  } catch (error) {
    console.error(`Error fetching services for sitter ${sitterId}:`, error);
    // En caso de error, siempre devolvemos un array vacío para no romper la UI.
    return []; 
  }
};

/**
 * Registra un nuevo cuidador
 */
export const registerSitter = async (
	sitterData: SitterRegisterRequest
): Promise<AuthResponse> => {
	try {
		const response = await axios.post<AuthResponse>(
			`${USERS_API_URL}/register-sitter`,
			sitterData
		);
		return response.data;
	} catch (error) {
		console.error('Error registering sitter:', error);
		throw new Error('No se pudo registrar el cuidador');
	}
};

/**
 * Obtiene todos los cuidadores (usuarios con rol SITTER)
 */
export const getAllSitters = async (): Promise<SitterProfileSummary[]> => {
	try {
		const response = await axios.get(`${USERS_API_URL}/role/SITTER`);
		// Los datos vienen como UserSummaryResponse, necesitamos mapearlos
		return response.data.map(mapUserToSitter);
	} catch (error) {
		console.error('Error fetching sitters:', error);
		throw new Error('No se pudieron cargar los cuidadores');
	}
};

/**
 * Busca cuidadores por filtros
 */
export const searchSitters = async (filters: {
	location?: string;
	maxDistance?: number;
	minRating?: number;
	maxHourlyRate?: number;
	availableOnly?: boolean;
}): Promise<ExtendedSitter[]> => {
	try {
		// Por ahora obtenemos todos los cuidadores y filtramos en cliente
		// En producción esto debería ser un endpoint específico con filtros en backend
		const allSitters = await getActiveSitters();

		return allSitters.filter((sitter) => {
			// Filtrar por disponibilidad
			if (filters.availableOnly && !sitter.isAvailable) return false;

			// Filtrar por rating mínimo
			if (
				filters.minRating &&
				(sitter.averageRating || 0) < filters.minRating
			)
				return false;

			// Filtrar por tarifa máxima
			if (
				filters.maxHourlyRate &&
				(sitter.hourlyRate || 0) > filters.maxHourlyRate
			)
				return false;

			// Filtrar por ubicación (búsqueda simple)
			if (
				filters.location &&
				sitter.location &&
				!sitter.location
					.toLowerCase()
					.includes(filters.location.toLowerCase())
			)
				return false;

			return true;
		});
	} catch (error) {
		console.error('Error searching sitters:', error);
		throw new Error('No se pudo realizar la búsqueda de cuidadores');
	}
};

// ========== FUNCIONES DE UTILIDAD ==========

/**
 * Mapea UserSummaryResponse a SitterProfileSummary
 */
const mapUserToSitter = (user: {
	id: number;
	firstName: string;
	lastName: string;
	emailVerified?: boolean;
	address?: string;
}): SitterProfileSummary => {
	return {
		id: user.id,
		sitterName: `${user.firstName} ${user.lastName}`,
		profileImageUrl: '', // Se completará con el perfil
		hourlyRate: 0, // Se completará con el perfil
		averageRating: 5.0, // Valor por defecto
		isVerified: user.emailVerified || false,
		location: user.address || 'Ubicación no especificada',
	};
};

/**
 * Mapea SitterProfileDTO a ExtendedSitter para la UI
 */
const mapProfileToExtendedSitter = (
	profile: SitterProfileDTO
): ExtendedSitter => {
	return {
		id: profile.id || 0,
		sitterName: 'Cuidador', // Se completará con datos del usuario
		profileImageUrl: profile.profileImageUrl,
		hourlyRate: profile.hourlyRate || 0,
		averageRating: 4.5, // Valor por defecto
		isVerified: profile.verified || false,
		location: 'Santiago, Chile', // Valor por defecto

		// Campos adicionales para ExtendedSitter
		specialty: 'Cuidado General',
		image: profile.profileImageUrl,
		rating: 4.5,
		totalServices: Math.floor(Math.random() * 50) + 5, // Datos de ejemplo
		lastService: 'Hace ' + Math.floor(Math.random() * 7) + ' días',
		pets: ['Max', 'Luna'], // Datos de ejemplo
		isAvailable: profile.availableForBookings || false,
		distance: (Math.random() * 5).toFixed(1) + ' km', // Datos de ejemplo
		bio: profile.bio || 'Cuidador profesional con experiencia.',
		nextAvailable:
			'Hoy a las ' + (12 + Math.floor(Math.random() * 8)) + ':00',
		specialties: ['Paseo', 'Cuidado', 'Compañía'], // Datos de ejemplo
	};
};

/**
 * Verifica si el usuario actual tiene perfil de cuidador
 */
export const hasActiveSitterProfile = async (): Promise<boolean> => {
	try {
		const token = localStorage.getItem('auth');
		if (!token) return false;

		const payload = JSON.parse(atob(token.split('.')[1]));
		const userId = payload.id || payload.sub;

		const profile = await getSitterProfile(userId);
		return profile.availableForBookings || false;
	} catch (error) {
		console.error('Error checking sitter profile:', error);
		return false; // No tiene perfil o error
	}
};

/**
 * Obtiene estadísticas de cuidadores para dashboard admin
 */
export const getSitterStats = async () => {
	try {
		const [allProfiles, activeSitters] = await Promise.all([
			getAllSitterProfiles(),
			getActiveSitters(),
		]);

		const verifiedCount = allProfiles.filter((p) => p.verified).length;
		const availableCount = allProfiles.filter(
			(p) => p.availableForBookings
		).length;

		return {
			totalSitters: allProfiles.length,
			activeSitters: activeSitters.length,
			verifiedSitters: verifiedCount,
			availableSitters: availableCount,
			averageHourlyRate:
				allProfiles.reduce((sum, p) => sum + (p.hourlyRate || 0), 0) /
					allProfiles.length || 0,
		};
	} catch (error) {
		console.error('Error fetching sitter stats:', error);
		return {
			totalSitters: 0,
			activeSitters: 0,
			verifiedSitters: 0,
			availableSitters: 0,
			averageHourlyRate: 0,
		};
	}
};

export async function getMyServices(id: number): Promise<Service[]> {
	// Lógica para obtener los servicios del cuidador desde la API
	const response = await axios.get<Service[]>(`/api/services/all/${id}`);
	return response.data;
}

export async function addMyService(
	serviceType: string,
	name: string,
	description: string,
	price: number,
	durationInMinutes: number,
	sitterId: number
): Promise<Service> {
	// Lógica para añadir un nuevo servicio a través de la API
	const response = await axios.post<Service>(
		`/api/services/create/${sitterId}`,
		{
			serviceType,
			name,
			description,
			price,
			durationInMinutes
		}
	);
	return response.data;
}
