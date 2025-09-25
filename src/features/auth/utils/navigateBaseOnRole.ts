import { type NavigateFunction } from 'react-router';
import { Role, type Profile } from '@/features/auth/types/authStore';

/**
 * Navega a una ruta específica según el rol del usuario.
 * @param navigate - La función de navegación de react-router-dom.
 * @param userProfile - El perfil del usuario que contiene el rol.
 */
export const navigateBasedOnRole = (
	navigate: NavigateFunction,
	userProfile: Profile
) => {
	switch (userProfile.role) {
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
			// Opcional: manejar un rol no reconocido o redirigir a una página por defecto
			navigate('/login');
			break;
	}
};
