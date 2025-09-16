import { User } from '../types/user.types';
import { authService } from '../services/authService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearAuth: () => void;
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const authResponse = await authService.login({ email, password });
          authService.setAuthData(authResponse);
          
          set({
            user: authResponse.user,
            token: authResponse.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true });
        try {
          const authResponse = await authService.register(userData);
          authService.setAuthData(authResponse);
          
          set({
            user: authResponse.user,
            token: authResponse.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.warn('Error during logout:', error);
        } finally {
          authService.clearLocalStorage();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearAuth: () => {
        authService.clearLocalStorage();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshToken: async () => {
        try {
          const authResponse = await authService.refreshToken();
          authService.setAuthData(authResponse);
          
          set({
            user: authResponse.user,
            token: authResponse.token,
            isAuthenticated: true,
          });
        } catch (error) {
          get().clearAuth();
          throw error;
        }
      },

      checkAuth: async () => {
        const token = authService.getToken();
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          const user = await authService.getCurrentUser();
          set({
            user,
            token,
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          get().clearAuth();
          return false;
        }
      },
    }),
    {
      name: 'petcare-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);