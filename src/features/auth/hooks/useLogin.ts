import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/AuthStore';
import { loginRequest } from '@/features/auth/api/auth';
import { navigateBasedOnRole } from '../utils/navigateBaseOnRole';
import { type LoginFormData } from '@/features/auth/lib/loginSchema';

export const useLogin = () => {
	const navigate = useNavigate();
	const setToken = useAuthStore((state) => state.setToken);
	const setProfile = useAuthStore((state) => state.setProfile);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (data: LoginFormData) => {
		setError(null);
		setIsLoading(true);
		try {
			const res = await loginRequest(data.email, data.password);
			const { token, userProfile } = res;
			setToken(token);
			setProfile(userProfile);
			navigateBasedOnRole(navigate, userProfile);
		} catch (err) {
			setError('Error al iniciar sesión. Verifica tus credenciales.');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return { handleLogin, error, isLoading };
};
