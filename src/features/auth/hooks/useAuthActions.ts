// src/features/auth/hooks/useAuthActions.ts

import type { LoginFormData, RegisterFormData } from '../../../types/auth';
import { loginRequest, registerRequest } from '../../../services/authService';

import { Role } from '../../../types/auth';
import { useAuthStore } from '../../../store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface UseAuthActionsReturn {
  handleLogin: (data: LoginFormData) => Promise<void>;
  handleRegister: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useAuthActions = (): UseAuthActionsReturn => {
  const { login: loginToStore } = useAuthStore();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleLogin = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await loginRequest(data);
      const { token, userProfile } = response;
      
      // Actualiza el store de Zustand
      loginToStore({ token, profile: userProfile });
      
      // Navegación basada en el rol
      navigateByRole(userProfile.role);
      
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Error al iniciar sesión. Verifica tus credenciales.';
      setError(errorMessage);
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await registerRequest(data);
      const { token, userProfile } = response;
      
      // Actualiza el store de Zustand
      loginToStore({ token, profile: userProfile });
      
      // Navegación basada en el rol
      navigateByRole(userProfile.role);
      
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Error en el registro. Verifica los datos ingresados.';
      setError(errorMessage);
      console.error('Register failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateByRole = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        navigate('/AdminDashboard');
        break;
      case Role.SITTER:
        navigate('/SitterDashboard');
        break;
      case Role.CLIENT:
        navigate('/dashboard');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  return { 
    handleLogin,
    handleRegister, 
    isLoading, 
    error, 
    clearError 
  };
};