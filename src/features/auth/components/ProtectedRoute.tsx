import { Navigate, Outlet } from 'react-router';

import { useAuthStore } from '../../../store/AuthStore';

const ProtectedRoute = () => {
	const user = useAuthStore((state) => state.profile);

	if (!user) {
    	// Si no hay usuario, redirige a la página de login
		return <Navigate to="/login" replace />;
	}

  	// Si hay un usuario, renderiza el componente de la ruta (ej. OwnerDashboard)
	return <Outlet />;
};

export default ProtectedRoute;