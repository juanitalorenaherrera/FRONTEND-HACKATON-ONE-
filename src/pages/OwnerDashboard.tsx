import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { addPet, getPets } from "../services/petService";

interface Pet {
  id: string | number;
  name: string;
  type: string;
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // El Hook se llama siempre en el nivel superior.
  useEffect(() => {
    // La lógica condicional se mueve DENTRO del Hook.
    if (user) {
      getPets(user.token)
        .then(data => {
          setPets(data);
        })
        .catch(console.error)
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Si no hay usuario, simplemente no hacemos la llamada a la API
      // y consideramos que la carga ha terminado.
      setIsLoading(false);
    }
    // La dependencia ahora es el objeto 'user' completo.
  }, [user]);

  const handleAddPet = async (e: FormEvent) => {
    e.preventDefault();
    // Añadimos una comprobación aquí también por si el usuario cierra sesión
    // mientras está en la página.
    if (!user) {
      alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      return;
    }
    if (!petName || !petType) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    try {
      const newPet = await addPet(user.token, { name: petName, type: petType });
      setPets(currentPets => [...currentPets, newPet]);
      setPetName("");
      setPetType("");
    } catch (err) {
      console.error(err);
      alert("Error al registrar la mascota.");
    }
  };
  
  // Si la página se carga y el usuario se está autenticando,
  // el 'ProtectedRoute' y este estado de carga lo manejan.
  if (isLoading) {
    return <p>Cargando datos del dueño...</p>
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Panel de Dueño 🐾</h1>
      
      {/* Sección para añadir mascotas */}
      <div className="p-6 bg-white rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Registrar una nueva mascota</h2>
        <form onSubmit={handleAddPet} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Nombre de la mascota"
            value={petName} 
            onChange={(e) => setPetName(e.target.value)}
            className="p-2 border rounded-md flex-grow"
          />
          <input 
            type="text" 
            placeholder="Tipo (perro, gato...)"
            value={petType} 
            onChange={(e) => setPetType(e.target.value)}
            className="p-2 border rounded-md flex-grow"
          />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Añadir
          </button>
        </form>
      </div>

      {/* Sección para listar mascotas */}
      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Tus Mascotas</h2>
        {pets.length > 0 ? (
          <ul className="space-y-2">
            {pets.map((pet) => (
              <li key={pet.id} className="p-3 bg-gray-100 rounded-md">
                <strong>{pet.name}</strong> ({pet.type})
              </li>
            ))}
          </ul>
        ) : (
          <p>Aún no has registrado ninguna mascota.</p>
        )}
      </div>
    </div>
  );
}