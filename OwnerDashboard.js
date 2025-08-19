export default function OwnerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Panel de Dueño</h1>
      <p>Aquí puedes registrar mascotas y reservar cuidadores 🐶🐱</p>
    </div>
  );
}
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { addPet, getPets } from "../services/petService";

export default function OwnerDashboard() {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");

  useEffect(() => {
    if (user) {
      getPets(user.token).then(setPets).catch(console.error);
    }
  }, [user]);

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      const newPet = await addPet(user.token, { name: petName, type: petType });
      setPets([...pets, newPet]);
      setPetName("");
      setPetType("");
    } catch (err) {
      alert("Error al registrar mascota");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Panel de Dueño</h1>
      <form onSubmit={handleAddPet} className="flex gap-2 my-4">
        <input type="text" placeholder="Nombre de la mascota"
               value={petName} onChange={(e) => setPetName(e.target.value)}
               className="p-2 border rounded"/>
        <input type="text" placeholder="Tipo (perro, gato...)"
               value={petType} onChange={(e) => setPetType(e.target.value)}
               className="p-2 border rounded"/>
        <button className="bg-green-500 text-white p-2 rounded">Añadir</button>
      </form>

      <h2 className="text-xl mt-4">Tus Mascotas</h2>
      <ul className="list-disc ml-6">
        {pets.map((p) => (
          <li key={p.id}>{p.name} ({p.type})</li>
        ))}
      </ul>
    </div>
  );
}
