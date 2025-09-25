import { useAuthStore } from '@/store/AuthStore';
import { useState } from 'react';
import type { RegisterFormData } from '../lib/registerSchema';
import { registerRequest } from '../api/auth';
import { navigateBasedOnRole } from '../utils/navigateBaseOnRole';
import { useNavigate } from 'react-router';

export const useRegister = () => {
	const navigate = useNavigate();
	const setProfile = useAuthStore((state) => state.setProfile);
	const setToken = useAuthStore((state) => state.setToken);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (data: RegisterFormData) => {
		setError(null);
		setIsLoading(true);

		try {
			const { token, userProfile } = await registerRequest(
				data.firstName,
				data.lastName,
				data.email,
				data.password,
				data.address,
				data.phoneNumber
			);

			setToken(token);
			setProfile(userProfile);
			navigateBasedOnRole(navigate, userProfile);
		} catch (err) {
			setError('Error en el registro. Verifica tus datos.');
			console.error('Error en el registro:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return { onSubmit, error, isLoading };
};
