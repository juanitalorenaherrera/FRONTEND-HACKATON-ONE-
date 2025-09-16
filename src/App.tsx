import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';

import { DashboardLayout } from './layout/DashboardLayout';
import { DashboardView } from './features/dashboard/view/DashboardView';
import { LoginView } from './features/auth/view/LoginView';
import { PetsView } from './features/pets/view/PetsView';
import { RegisterView } from './features/auth/view/RegisterView';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/AuthStore';

// --- Layouts ---


// --- Vistas de Autenticación ---



// --- Vistas del Dashboard ---


// Importa aquí las otras vistas principales a medida que las crees
// import { FindSittersView } from './features/sitters/components/FindSittersView';
// import { BookingsView } from './features/booking/views/BookingView';

// --- Store de Autenticación ---


// --- Lógica de Protección de Rutas ---
// Este "loader" se ejecuta ANTES de cargar cualquier ruta protegida.
// Si el usuario no está autenticado, lo redirige al login.
const protectedLoader = () => {
  const { token } = useAuthStore.getState(); // Acceso directo al estado del store
  if (!token) {
    // Si no hay token, aborta la carga de la ruta y redirige.
    return redirect('/login');
  }
  // Si hay token, permite que la ruta se cargue.
  return null;
};

// --- Definición del Router Moderno ---
// Usamos createBrowserRouter para una configuración centralizada y clara.
const router = createBrowserRouter([
  // Grupo de Rutas Públicas (Autenticación)
  {
    path: '/login',
    element: <LoginView />,
  },
  {
    path: '/register',
    element: <RegisterView />,
  },
  
  // Grupo de Rutas Protegidas (El Dashboard y todo su contenido)
  {
    path: '/',
    element: <DashboardLayout />, // Nuestro layout persistente
    loader: protectedLoader,      // ¡La seguridad primero!
    children: [
      {
        // Redirige la ruta raíz ("/") a "/dashboard" por defecto
        index: true, 
        loader: () => redirect('/dashboard'),
      },
      {
        path: 'dashboard',
        element: <DashboardView />, // Nuestra nueva y limpia vista del dashboard
      },
      {
        path: 'pets',
        element: <PetsView />,
        // Aquí puedes anidar sub-rutas para el perfil de cada mascota
        // children: [ { path: ':petId', element: <PetProfile /> } ]
      },
      // {
      //   path: 'find-sitters',
      //   element: <FindSittersView />,
      // },
      // {
      //   path: 'bookings',
      //   element: <BookingsView />,
      // },
    ],
  },
]);

// --- Componente Principal de la Aplicación ---
// Ahora el componente App es increíblemente simple.
function App() {
  return (
    <>
      {/* El proveedor del router que hace toda la magia */}
      <RouterProvider router={router} />
      
      {/* Componente para mostrar las notificaciones toast en toda la app */}
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;