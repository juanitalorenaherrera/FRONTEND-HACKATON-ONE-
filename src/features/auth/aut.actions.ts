// src/features/auth/auth.actions.ts

import { ActionFunctionArgs, redirect } from 'react-router-dom';

import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/AuthStore';

// --- Acción para el Login ---
export const loginAction = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validación simple
    if (!email || !password) {
      return { ok: false, error: 'Email y contraseña son requeridos.' };
    }

    // Llamada al servicio de autenticación
    const { token, user } = await authService.login({ email, password });

    // Guardar estado en Zustand
    useAuthStore.getState().loginSuccess(token, user);

    toast.success(`¡Bienvenido de nuevo, ${user.name}!`);
    return redirect('/dashboard');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
    toast.error(errorMessage);
    return { ok: false, error: errorMessage };
  }
};


// --- Acción para el Registro ---
export const registerAction = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();
        const registerData = Object.fromEntries(formData);

        // Aquí podrías agregar validación con Zod si quieres más robustez

        await authService.register(registerData);

        toast.success('¡Registro exitoso! 🎉', {
            description: 'Ahora puedes iniciar sesión con tu nueva cuenta.',
        });
        return redirect('/login');
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Ocurrió un error durante el registro.';
        toast.error(errorMessage);
        return { ok: false, error: errorMessage };
    }
}