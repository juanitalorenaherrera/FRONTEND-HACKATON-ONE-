import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./componentes/providers/AuthProvider";

// Componentes estructurales
import RoleProtectedRoute from "./componentes/auth/RoleProtectedRoute";

// Páginas
import Home from "./pages/home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import BookingPage from "./pages/BookingPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import SitterDashboard from "./pages/SitterDashboard";
import AdminDashboard from "./pages/AdminDashboard";




export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
          
        
        <main className="py-8 px-4">
          <Routes>
            {/* --- Rutas Públicas (accesibles para todos) --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* --- Rutas Protegidas (requieren iniciar sesión) --- */}
            
            {/* Ruta de reserva accesible para cualquier rol autenticado */}
            <Route element={<RoleProtectedRoute allowedRoles={['owner', 'sitter', 'admin']} />}>
              <Route path="/book/:sitterId" element={<BookingPage />} />
            </Route>

            {/* Rutas solo para el rol 'owner' */}
            <Route element={<RoleProtectedRoute allowedRoles={['owner']} />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            </Route>
            
            {/* Rutas solo para el rol 'sitter' */}
            <Route element={<RoleProtectedRoute allowedRoles={['sitter']} />}>
              <Route path="/sitter/dashboard" element={<SitterDashboard />} />
            </Route>

            {/* Rutas solo para el rol 'admin' */}
            <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}