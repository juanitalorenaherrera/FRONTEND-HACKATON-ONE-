// src/store/AuthStore.ts

import type { AuthActions, AuthState, Profile } from '../types/auth';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState: AuthState = {
  token: null,
  profile: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      
      // Acción principal de login
      login: ({ token, profile }) =>
        set({
          token,
          profile,
          isAuthenticated: true,
        }),
      
      // Acciones individuales para compatibilidad con código existente
      setToken: (token: string) =>
        set((state) => ({
          token,
          isAuthenticated: !!token && !!state.profile,
        })),
      
      setProfile: (profile: Profile | null) =>
        set((state) => ({
          profile,
          isAuthenticated: !!state.token && !!profile,
        })),
      
      logout: () => set(initialState),
    }),
    {
      name: 'auth-session',
    }
  )
);