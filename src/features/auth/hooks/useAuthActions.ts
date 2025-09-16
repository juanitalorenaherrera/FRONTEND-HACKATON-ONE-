import { LoginFormData } from '../schemas/auth.schema';
import { Role } from '@/types/user.types'; // Asegúrate que el enum Role esté en un lugar central
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const useAuthActions = () => {
  const navigate = useNavigate();
  const { setToken, setProfile } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    const loginPromise = authService.login(data.email, data.password);

    toast.promise(loginPromise, {
      loading: 'Iniciando sesión...',
      success: (res) => {
        const { token, userProfile } = res;
        setToken(token);
        setProfile(userProfile);
        
        // Redirección basada en el rol del usuario
        if (userProfile.role === Role.ADMIN) navigate('/admin/dashboard');
        else navigate('/dashboard'); // Para CLIENT y SITTER

        return `¡Bienvenido de nuevo, ${userProfile.firstName}! 🐾`;
      },
      error: (err) => {
        console.error(err);
        const errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
        setError(errorMessage); // También actualiza el estado local para mostrar en el form
        return errorMessage;
      },
      finally: () => {
        setIsLoading(false);
      }
    });
  };

  return {
    handleLogin,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};