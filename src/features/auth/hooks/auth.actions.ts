// src/features/auth/auth.actions.ts
// NOTA: Este archivo es opcional si decides usar React Router actions
// Recomiendo usar solo el hook useAuthActions para consistencia

import { loginRequest, registerRequest } from '../../../services/authService';

import type { Role } from '../../../types/auth';
import { redirect } from 'react-router-dom';
import { useAuthStore } from '../../../store/AuthStore';

// Función helper para navegación por rol
const getRedirectPath = (role: Role): string => {
  switch (role) {
    case 'ADMIN':
      return '/AdminDashboard';
    case 'SITTER':
      return '/SitterDashboard';
    case 'CLIENT':
      return '/dashboard';
    default:
      return '/dashboard';
  }
};

export const loginAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Aquí deberías añadir validación con Zod o similar
  if (!credentials.email || !credentials.password) {
    return { error: 'Email y contraseña son requeridos' };
  }

  try {
    const response = await loginRequest(credentials);
    
    // Actualizar el store
    useAuthStore.getState().login({
      token: response.token,
      profile: response.userProfile,
    });

    // Redirigir según el rol
    const redirectPath = getRedirectPath(response.userProfile.role);
    return redirect(redirectPath);
    
  } catch (error: any) {
    console.error('Login action failed:', error);
    return { 
      error: error?.response?.data?.message || 
             'Error al iniciar sesión. Verifica tus credenciales.' 
    };
  }
};

export const registerAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const userData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    address: formData.get('address') as string || undefined,
    phoneNumber: formData.get('phoneNumber') as string || undefined,
  };

  // Validación básica
  if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
    return { error: 'Todos los campos obligatorios deben ser completados' };
  }

  try {
    const response = await registerRequest(userData);
    
    // Actualizar el store
    useAuthStore.getState().login({
      token: response.token,
      profile: response.userProfile,
    });

    // Redirigir según el rol
    const redirectPath = getRedirectPath(response.userProfile.role);
    return redirect(redirectPath);
    
  } catch (error: any) {
    console.error('Register action failed:', error);
    return { 
      error: error?.response?.data?.message || 
             'Error en el registro. Verifica los datos ingresados.' 
    };
  }
};