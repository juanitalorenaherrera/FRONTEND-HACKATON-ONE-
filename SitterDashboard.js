export default function SitterDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Panel de Cuidador</h1>
      <p>Aquí puedes aceptar o rechazar reservas 🐾</p>
    </div>
  );
}
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { addService, getServices } from "../services/sitterService";

export default function SitterDashboard() {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (user) {
      getServices(user.token).then(setServices).catch(console.error);
    }
  }, [user]);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const newService = await addService(user.token, { type: serviceType, price });
      setServices([...services, newService]);
      setServiceType("");
      setPrice("");
    } catch (err) {
      alert("Error al registrar servicio");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Panel de Cuidador</h1>
      <form onSubmit={handleAddService} className="flex gap-2 my-4">
        <input type="text" placeholder="Tipo de servicio (paseo, guardería...)"
               value={serviceType} onChange={(e) => setServiceType(e.target.value)}
               className="p-2 border rounded"/>
        <input type="number" placeholder="Precio"
               value={price} onChange={(e) => setPrice(e.target.value)}
               className="p-2 border rounded"/>
        <button className="bg-blue-500 text-white p-2 rounded">Añadir</button>
      </form>

      <h2 className="text-xl mt-4">Tus Servicios</h2>
      <ul className="list-disc ml-6">
        {services.map((s) => (
          <li key={s.id}>{s.type} – ${s.price}</li>
        ))}
      </ul>
    </div>
  );
}
