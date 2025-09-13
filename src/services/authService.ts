// src/services/authService.ts

import type { User } from '../types/user';
import axios from '../services/auth';
import type { Profile, Role } from '../types/authStore';
;

const API_URL = import.meta.env.VITE_API_URL;

// 1. (Opcional pero recomendado) Creamos una interfaz para la respuesta del login
interface LoginResponse {
	token: string;
	userProfile: Profile;
}

export const loginRequest = async (email: string, password: string): Promise<LoginResponse> => {
	const res = await axios.post<LoginResponse>('/api/users/login', {
		email,
		password,
	});

	console.log(res.data);
	return res.data;
};

/**
 * Inicia sesión, guarda el token y devuelve los datos del usuario.
 */
/**
 * Obtiene el perfil del usuario autenticado a través del token.
 */
export const getProfile = async (): Promise<User> => {
	const token = localStorage.getItem('auth');
	if (!token) {
		throw new Error('No se encontró el token de autenticación.');
	}

	const response = await axios.get<User>(`/api/dashboard/profile`);

	return response.data;
};

interface RegisterResponse {
	token: string;
	role: Role;
	userProfile: Profile;
}

/**
 * Registra un nuevo usuario. (Función que ya tenías)
 */
export const registerRequest = async (
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	address: string,
	phoneNumber: string,
): Promise<RegisterResponse> => {
	const response = await axios.post<RegisterResponse>(`${API_URL}/api/users/register`, {
		firstName,
		lastName,
		email,
		password,
		address,
		phoneNumber
	});
	return response.data;
};
