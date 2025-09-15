// src/types/service.ts

/**
 * Define los tipos de servicio que puede ofrecer un cuidador.
 * Debería estar alineado con el enum `ServiceType` del backend.
 */
export enum ServiceType {
  WALK = 'WALK',
  BOARDING = 'BOARDING',
  DAY_CARE = 'DAY_CARE',
  HOUSE_SITTING = 'HOUSE_SITTING',
}

/**
 * DTO para un servicio ofrecido por un cuidador.
 * Corresponde a `ServiceOfferingDTO` del backend.
 */
export interface Service {
  id: number;
  sitterId: number;
  serviceType: ServiceType;
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
}

/**
 * DTO para crear un nuevo servicio.
 */
export interface CreateServiceRequest {
  serviceType: ServiceType;
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
}