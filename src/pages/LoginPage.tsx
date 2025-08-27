// src/pages/LoginPage.tsx (Refactorizado con el custom hook)

import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { login as loginService } from "../services/authService";

export default function LoginPage() {
  const { login } = useAuth(); // 2. Usar el hook para obtener la función 'login'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginService(email, password);
      login(data);
      alert("Login exitoso");
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-10 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors">
          Entrar
        </button>
      </form>
    </div>
  );
}