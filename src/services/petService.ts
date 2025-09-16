import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { CreatePetDTO, Pet, UpdatePetDTO } from '../types/common.types';

import { apiClient } from './api';

export class PetService {
  // GET /pets - Lista de mascotas del usuario
  async getAll(): Promise<Pet[]> {
    const response = await apiClient.get<ApiResponse<Pet[]>>('/pets');
    return response.data.data;
  }

  // GET /pets/{id} - Detalle de mascota específica
  async getById(id: string): Promise<Pet> {
    const response = await apiClient.get<ApiResponse<Pet>>(`/pets/${id}`);
    return response.data.data;
  }

  // POST /pets - Crear nueva mascota
  async create(petData: CreatePetDTO): Promise<Pet> {
    const response = await apiClient.post<ApiResponse<Pet>>('/pets', petData);
    return response.data.data;
  }

  // PUT /pets/{id} - Actualizar mascota
  async update(id: string, petData: UpdatePetDTO): Promise<Pet> {
    const response = await apiClient.put<ApiResponse<Pet>>(`/pets/${id}`, petData);
    return response.data.data;
  }

  // DELETE /pets/{id} - Eliminar mascota
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/pets/${id}`);
  }

  // POST /pets/{id}/upload-image - Subir imagen de mascota
  async uploadImage(id: string, imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post<ApiResponse<{ imageUrl: string }>>(
      `/pets/${id}/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.imageUrl;
  }

  // GET /pets/{id}/medical-records - Historial médico
  async getMedicalRecords(id: string): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/pets/${id}/medical-records`);
    return response.data.data;
  }
}

export const petService = new PetService();