import { BrowserRouter, Route, Routes } from 'react-router';

import AdminDashboard from './pages/AdminDashboard';
//import BookingPage from './pages/BookingPage';
import { ClientDashboard } from './pages/ClientDashboard';
import Home from './pages/home';
import { LoginPage } from './pages/LoginPage';
import OwnerBooking from './pages/OwnerBooking';
import RegisterPage from './pages/Register';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import { Role } from './types/authStore';
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
