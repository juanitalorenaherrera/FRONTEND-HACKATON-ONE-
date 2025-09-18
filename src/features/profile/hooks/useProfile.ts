// src/features/profile/hooks/useProfile.ts

import type { UpdateUserPayload, UserProfile } from '@/features/profile/types';
import { useCallback, useEffect, useState } from 'react';

import { Role } from '@/types/authStore';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/AuthStore';
import { userService } from '@/services/userService';

// IMPORTANTE: Importamos el enum 'Role' para poder usar sus valores.


export const useProfile = () => {
  const { setProfile: setUser } = useAuthStore();
  
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfileFromApi = await userService.getUserProfile();

      // --- ¡ESTA ES LA CORRECCIÓN CLAVE! ---
      // Creamos un nuevo objeto para el store, asegurándonos de que 'role'
      // no es un simple string, sino un miembro del enum 'Role'.
      const profileForStore: UserProfile = {
        ...userProfileFromApi,
        // Hacemos una aserción de tipo. Le decimos a TypeScript:
        // "Confía en mí, este string que viene de la API es un valor válido para el enum Role".
        role: userProfileFromApi.role as Role,
      };

      setProfileData(profileForStore);
      setUser(profileForStore); // Ahora sí, el objeto es 100% compatible.

    } catch (err) {
      const errorMessage = 'Error al cargar tu perfil.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    if (!profileData) {
      loadProfile();
    }
  }, [loadProfile, profileData]);

  const updateProfile = async (payload: UpdateUserPayload) => {
    if (!profileData) return;

    const promise = async () => {
      const updatedProfileFromApi = await userService.updateUserProfile(profileData.id, payload);
      
      const updatedProfileForStore: UserProfile = {
          ...updatedProfileFromApi,
          role: updatedProfileFromApi.role as Role,
      };
      
      setProfileData(updatedProfileForStore);
      setUser(updatedProfileForStore);
      return updatedProfileForStore;
    };

    toast.promise(promise(), {
      loading: 'Actualizando tu perfil...',
      success: '¡Perfil actualizado con éxito! 🎉',
      error: 'No se pudo actualizar el perfil.',
    });
  };

  return {
    profile: profileData,
    loading,
    error,
    actions: {
      updateProfile,
      retry: loadProfile,
    },
  };
};