import { BrowserRouter, Route, Routes } from 'react-router';

import AdminDashboard from './pages/AdminDashboard';
//import BookingPage from './pages/BookingPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { DashboardLayout } from './layouts/DashboardLayout';
import { FindSittersView } from './features/sitters/components/FindSittersView';
import Home from './pages/home';
import { LoginPage } from './pages/LoginPage';
import MainDashboardView from './features/dashboard/MainDashboardView';
import OwnerBooking from './pages/OwnerBooking';
import { PetProfile } from './features/pets/components/PetProfile';
import { PetsOverview } from './features/pets/components/PetsOverview';
import { PetsView } from './features/pets/view/PetsView';
import RegisterPage from './pages/Register';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import { Role } from './types/authStore';
import { BookingsView } from './features/booking/views/BookingView';
//import SitterDashboard from './pages/SitterDashboard';

// import OwnerDashboard from './pages/OwnerDashboard';




export default function App() {
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
						<Route path="/ClientDashboard" element={<ClientDashboard />} />
						<Route path="/dashboard" element={<DashboardLayout />}>

						{/* Rutas hijas que se renderizarán dentro del <Outlet> */}
						<Route index element={<MainDashboardView />} />
						<Route path="pets" element={<PetsView />}>
                            <Route index element={<PetsOverview />} />
                            <Route path=":petId" element={<PetProfile />} />
                        </Route>
						<Route path="pets/:petId" element={<PetProfile />
							// id={useParams().petId} onBack={() => console.log('Go back')}
} />
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
