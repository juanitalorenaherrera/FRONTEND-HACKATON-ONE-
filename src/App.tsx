import { BrowserRouter, Route, Routes } from 'react-router';
import { Suspense, lazy } from 'react';
import { Role } from './types/authStore';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
const SitterDashboard = lazy(() => import('./pages/SitterDashboard'));

const BookingPage = lazy(() => import('./pages/BookingPage'));

// Lazy imports for code splitting
const Home = lazy(() => import('./pages/home'));
const LoginPage = lazy(() =>
	import('./pages/LoginPage').then((module) => ({
		default: module.LoginPage,
	}))
);
const RegisterPage = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OwnerBooking = lazy(() => import('./pages/OwnerBooking'));
const DashboardLayout = lazy(() =>
	import('./layouts/DashboardLayout').then((module) => ({
		default: module.DashboardLayout,
	}))
);
const MainDashboardView = lazy(
	() => import('./features/dashboard/MainDashboardView')
);
const PetsView = lazy(() =>
	import('./features/pets/view/PetsView').then((module) => ({
		default: module.PetsViewContent,
	}))
);
const PetsOverview = lazy(() =>
	import('./features/pets/components/PetsOverview').then((module) => ({
		default: module.PetsOverview,
	}))
);
const PetProfile = lazy(() =>
	import('./features/pets/components/PetProfile').then((module) => ({
		default: module.PetProfile,
	}))
);
const FindSittersView = lazy(() =>
	import('./features/sitters/components/FindSittersView').then((module) => ({
		default: module.SittersViewContent,
	}))
);
const BookingsView = lazy(() =>
	import('./features/booking/views/BookingView').then((module) => ({
		default: module.BookingsViewContent,
	}))
);
export default function App() {
	return (
		<BrowserRouter>
			<main className="py-8 px-4">
				<Suspense
					fallback={
						<div className="flex items-center justify-center min-h-screen">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						</div>
					}
				>
					<Routes>
						{/* --- Rutas Públicas (accesibles para todos) --- */}
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						{/* <Route path="/OwnerDashboard" element={<OwnerDashboard />} /> */}
						{/* <Route path="/SitterDashboard" element={<SitterDashboard />} /> */}
						<Route
							path="/AdminDashboard"
							element={<AdminDashboard />}
						/>
						<Route
							path="/OwnerBooking"
							element={<OwnerBooking />}
						/>
						{/* <Route path="/ClientDashboard" element={<ClientDashboard />} /> */}
						<Route path="/dashboard" element={<DashboardLayout />}>
							{/* Rutas hijas que se renderizarán dentro del <Outlet> */}
							<Route index element={<MainDashboardView />} />
							<Route path="pets" element={<PetsView />}>
								<Route index element={<PetsOverview />} />
								<Route path=":petId" element={<PetProfile />} />
							</Route>
							<Route
								path="pets/:petId"
								element={<PetProfile />}
							/>
							{/* // id={useParams().petId} onBack={() => console.log('Go back')} */}
							<Route
								path="find-sitters"
								element={<FindSittersView />}
							/>
							<Route path="bookings" element={<BookingsView />} />
							{/* <Route path="favorites" element={<FavoritesView />} /> ... y así sucesivamente */}
						</Route>

						{/* --- Rutas Protegidas (requieren iniciar sesión) --- */}

						{/* Ruta de reserva accesible para cualquier rol autenticado */}
						<Route
							element={
								<RoleProtectedRoute
									allowedRoles={[
										Role.CLIENT,
										Role.SITTER,
										Role.ADMIN,
									]}
								/>
							}
						>
							<Route
								path="/book/:sitterId"
								element={<BookingPage />}
							/>
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
								<RoleProtectedRoute
									allowedRoles={[Role.SITTER]}
								/>
							}
						>
							<Route
								path="/sitter/dashboard"
								element={<SitterDashboard />}
							/>
						</Route>

						{/* Rutas solo para el rol 'admin' */}
						<Route
							element={
								<RoleProtectedRoute
									allowedRoles={[Role.ADMIN]}
								/>
							}
						>
							<Route
								path="/admin/dashboard"
								element={<AdminDashboard />}
							/>
						</Route>
					</Routes>
				</Suspense>
			</main>
		</BrowserRouter>
	);
}
