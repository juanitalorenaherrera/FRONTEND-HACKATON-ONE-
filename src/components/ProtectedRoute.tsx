import { useAuthStore } from '@/store/AuthStore';
import { Navigate, Outlet } from 'react-router';


const ProtectedRoute = () => {
	const user = useAuthStore((state) => state.profile);
	const isAuth = useAuthStore((state) => state.isAuth);

	if (!user && !isAuth)
    	// Si no hay usuario, redirige a la página de login
		return <Navigate to="/login" replace />;
  	// Si hay un usuario, renderiza el componente de la ruta (ej. OwnerDashboard)
	return <Outlet />;
};

export default ProtectedRoute;