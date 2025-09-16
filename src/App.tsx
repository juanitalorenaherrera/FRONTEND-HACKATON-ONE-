// src/App.tsx (VERSIÓN FINAL Y COMPLETA)

import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { loginAction, registerAction } from './features/auth/hooks/auth.actions';
import { petProfileLoader, petsLoader } from './features/pets/pets.loader';

import AdminDashboard from './pages/AdminDashboard';
import { BookingsView } from './features/booking/views/BookingView';
import { DashboardLayout } from './layouts/DashboardLayout';
import { FindSittersView } from './features/sitters/components/FindSittersView';
import { LoginPage } from './features/auth/view/LoginView';
import MainDashboardView from './features/dashboard/MainDashboardView';
import { PetProfile } from './features/pets/components/PetProfile';
import { PetsOverview } from './features/pets/components/PetsOverview';
import { PetsView } from './features/pets/view/PetsView';
import RegisterPage from './features/auth/view/RegisterView';
import { Role } from './types/auth';
import { bookingsLoader } from './features/booking/booking.loader';
import { dashboardLoader } from './features/dashboard/dashboard.loader';
import { findSittersLoader } from './features/sitters/sitters.loader';
import { useAuthStore } from './store/AuthStore';

// --- Lógica de Protección de Rutas ---
const protectedLoader = () => {
  // Aquí usamos 'isAuthenticated' de nuestro store.
  const { isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated) {
    return redirect('/login');
  }
  return null;
};

const adminOnlyLoader = () => {
  // Aquí usamos tanto el perfil como el enum 'Role'.
  const { isAuthenticated, profile } = useAuthStore.getState();
  if (!isAuthenticated) {
    return redirect('/login');
  }
  if (profile?.role !== Role.ADMIN) {
    // Si no es admin, lo redirigimos fuera de la zona de admin.
    return redirect('/dashboard'); 
  }
  return null;
};


// --- Definición del Router ---
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    action: loginAction, 
  },
  {
    path: '/register',
    element: <RegisterPage />,
    action: registerAction, 
  },
  {
    path: '/',
    element: <DashboardLayout />,
    loader: protectedLoader,
    // errorElement: <ComponenteDeErrorGeneral />, // <-- Buena práctica: capturar errores aquí
    children: [
      {
        index: true, 
        loader: () => redirect('/dashboard'),
      },
      {
        path: 'dashboard',
        element: <MainDashboardView />,
        loader: dashboardLoader, 
      },
      {
        path: 'pets',
        element: <PetsView />,
        loader: petsLoader, 
        children: [
          {
            index: true,
            element: <PetsOverview />,
          },
          {
            path: ':petId',
            element: <PetProfile />,
            loader: petProfileLoader, 
          },
        ],
      },
      {
        path: 'find-sitters',
        element: <FindSittersView />,
         loader: findSittersLoader, 
      },
      {
        path: 'bookings',
        element: <BookingsView />,
         loader: bookingsLoader, 
      },
      {
        path: 'admin',
        loader: adminOnlyLoader,
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
        ],
      },
    ],
  },
]);

export default function App() {
<<<<<<< HEAD
	return (
		<BrowserRouter>
			
				<main className="py-8 px-4">
					<Routes>
						{/* --- Rutas Públicas (accesibles para todos) --- */}
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						{/* <Route path="/OwnerDashboard" element={<OwnerDashboard />} /> */}
						{/* <Route path="/SitterDashboard" element={<SitterDashboard />} /> */}
						<Route path="/AdminDashboard" element={<AdminDashboard />} />
						<Route path="/OwnerBooking" element={<OwnerBooking />} />
						{/* <Route path="/ClientDashboard" element={<ClientDashboard />} /> */}
						<Route path="/dashboard" element={<DashboardLayout />}>

						{/* Rutas hijas que se renderizarán dentro del <Outlet> */}
						<Route index element={<MainDashboardView />} />
						<Route path="pets" element={<PetsView />}>
                            <Route index element={<PetsOverview />} />
                            <Route path=":petId" element={<PetProfile />} />
                        </Route>
						<Route path="pets/:petId" element={<PetProfile/>} />
							{/* // id={useParams().petId} onBack={() => console.log('Go back')} */}
						<Route path="find-sitters" element={<FindSittersView />} />
						<Route path="bookings" element={<BookingsView />} />
						{/* <Route path="favorites" element={<FavoritesView />} /> ... y así sucesivamente */}
						</Route>


						{/* --- Rutas Protegidas (requieren iniciar sesión) --- */}

						{/* Ruta de reserva accesible para cualquier rol autenticado */}
					<Route
						element={
							<RoleProtectedRoute
								allowedRoles={[Role.CLIENT, Role.SITTER, Role.ADMIN]}
								/>
							}
						>
							{/* <Route
								path="/book/:sitterId"
								element={<BookingPage />}
							/> */}
						</Route>

						{/* Rutas solo para el rol 'owner' */}
						{/* <Route
							element={
								<RoleProtectedRoute allowedRoles={['owner']} />
							}
						>
							<Route
								path="/owner/dashboard"
								element={<OwnerDashboard />}
							/>
						</Route> */}

						{/* Rutas solo para el rol 'sitter' */}
						<Route
							element={
								<RoleProtectedRoute allowedRoles={[Role.SITTER]} />
							}
						>
							{/* <Route
								path="/sitter/dashboard"
								element={<SitterDashboard />}
							/> */}
						</Route>

						{/* Rutas solo para el rol 'admin' */}
						<Route
							element={
								<RoleProtectedRoute allowedRoles={[Role.ADMIN]} />
							}
						>
							<Route
								path="/admin/dashboard"
								element={<AdminDashboard />}
							/>
						</Route>
					</Routes>
				</main>
		</BrowserRouter>
	);
}
=======
  return <RouterProvider router={router} />;
}
>>>>>>> 3f401aec90ace12b8f9457208693584aabc9e409
