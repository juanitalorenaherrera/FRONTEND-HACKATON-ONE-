import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Importar useNavigate

const Home: React.FC = () => {
  // 2. Obtener la función de navegación
  const navigate = useNavigate();

  // Función para manejar la navegación
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-200">
      <h1 className="text-4xl font-bold mb-6">🐾 PetCare</h1>
      <p className="mb-6 text-lg">Conectando dueños y cuidadores de mascotas</p>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 3. Agregar eventos onClick a los botones */}
        <button
          onClick={() => handleNavigate("/login?role=owner")}
          className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
        >
          Soy Dueño
        </button>
        <button
          onClick={() => handleNavigate("/login?role=sitter")}
          className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
        >
          Soy Cuidador
        </button>
        <button
          onClick={() => handleNavigate("/login?role=admin")}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          Soy Admin
        </button>
      </div>
    </div>
  );
};

export default Home;