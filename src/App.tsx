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
  return <RouterProvider router={router} />;
}