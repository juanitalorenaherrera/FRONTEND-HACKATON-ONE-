import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login } from "../services/authService";

export default function LoginPage() {
  const { login: loginContext } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      loginContext(data);
      alert("Login exitoso");
    } catch (err) {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Iniciar Sesión</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input type="email" placeholder="Correo" value={email}
               onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded"/>
        <input type="password" placeholder="Contraseña" value={password}
               onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded"/>
        <button className="bg-blue-500 text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
