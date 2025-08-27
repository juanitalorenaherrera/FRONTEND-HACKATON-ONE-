import axios from "axios";

// URL base para los endpoints relacionados con cuidadores
const API_URL = "http://localhost:8080/sitters";

// --- Definición de Tipos ---

// Describe el perfil público de un cuidador
export interface Sitter {
  id: string | number;
  name: string;
  experience: string;
  city: string;
  rating?: number;       // <-- Añadido
  reviewCount?: number;  // <-- Añadido
}

// Describe un servicio ofrecido por un cuidador
export interface Service {
  id: string | number;
  type: string;
  price: number;
  description?: string; // <-- Añadido
}

// --- Funciones de API ---

/**
 * Obtiene la lista pública de todos los cuidadores disponibles.
 */
export const getSitters = async (): Promise<Sitter[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

/**
 * Obtiene los servicios del CUIDADOR AUTENTICADO.
 */
export const getMyServices = async (token: string): Promise<Service[]> => {
  const response = await axios.get(`${API_URL}/my-services`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Añade un nuevo servicio para el CUIDADOR AUTENTICADO.
 */
export const addMyService = async (
  token: string, 
  serviceData: { type: string; price: number }
): Promise<Service> => {
  const response = await axios.post(`${API_URL}/my-services`, serviceData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Obtiene el perfil público Y los servicios de UN cuidador específico por su ID.
 */
export const getSitterProfile = async (sitterId: string): Promise<Sitter & { services: Service[] }> => {
  const response = await axios.get(`${API_URL}/${sitterId}`);
  return response.data;
};