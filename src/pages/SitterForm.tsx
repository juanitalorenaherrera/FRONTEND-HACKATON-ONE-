import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { register as registerService } from "../services/authService";

export default function RegisterPage() {
  // --- Hooks ---
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- Estado del formulario ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"owner" | "sitter">("owner"); // Rol por defecto
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Lógica de envío ---
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios.");
      setIsLoading(false);
      return;
    }

    try {
      const userData = await registerService(name, email, password, role);
      // Inicia sesión automáticamente al usuario después del registro
      login(userData);
      // Redirige al dashboard correspondiente según el rol
      navigate(`/${userData.role}/dashboard`);
    } catch (err) {
      setError("No se pudo completar el registro. El correo ya puede estar en uso.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-10 shadow-md rounded-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Crear Cuenta</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Nombre completo" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
          className="p-2 border rounded-md"
          required 
        />
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          className="p-2 border rounded-md"
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          className="p-2 border rounded-md"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "owner" | "sitter")}
          className="p-2 border rounded-md bg-white"
        >
          <option value="owner">Soy Dueño de Mascota</option>
          <option value="sitter">Quiero ser Cuidador</option>
        </select>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition-colors disabled:bg-gray-400"
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}