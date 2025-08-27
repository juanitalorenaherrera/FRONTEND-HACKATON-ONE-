import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// Corregido: Importar los nombres de función correctos
import { addMyService, getMyServices } from "../services/sitterService";
import type { Service } from "../services/sitterService";
import { useAuth } from "../hooks/useAuth";

export default function SitterDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceType, setServiceType] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (user) {
      // Corregido: Llamar a la función con el nombre nuevo
      getMyServices(user.token)
        // Corregido: Añadir el tipo explícito para 'data'
        .then((data: Service[]) => {
          setServices(data);
        })
        .catch(console.error)
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleAddService = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Tu sesión ha expirado.");
      return;
    }
    if (!serviceType || !price) {
      alert("Por favor, completa todos los campos del servicio.");
      return;
    }
    try {
      // Corregido: Llamar a la función con el nombre nuevo
      const newService = await addMyService(user.token, { type: serviceType, price: Number(price) });
      setServices(currentServices => [...currentServices, newService]);
      setServiceType("");
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Error al registrar el servicio.");
    }
  };

  if (isLoading) {
    return <p className="p-8">Cargando datos del cuidador...</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Panel de Cuidador 👩‍⚕️</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Columna Izquierda: Gestión de Servicios */}
        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">🛠️ Mis Servicios</h2>
          
          <form onSubmit={handleAddService} className="flex flex-col gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Tipo de servicio (Paseo, Guardería...)"
              value={serviceType} 
              onChange={(e) => setServiceType(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
            <input 
              type="number" 
              placeholder="Precio"
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
              Añadir Servicio
            </button>
          </form>

          {services.length > 0 ? (
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id} className="p-3 bg-gray-100 rounded-md flex justify-between items-center">
                  <span>{service.type}</span>
                  <span className="font-bold">${service.price}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aún no has registrado ningún servicio.</p>
          )}
        </div>

        {/* Columna Derecha: Gestión de Disponibilidad */}
        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">📅 Mi Disponibilidad</h2>
          <Calendar
            onChange={(date) => setSelectedDate(date as Date)}
            value={selectedDate}
            className="border-0"
          />
          <p className="mt-4 text-center">
            Fecha seleccionada:{" "}
            <strong className="text-blue-600">
              {selectedDate ? selectedDate.toLocaleDateString() : "Ninguna"}
            </strong>
          </p>
        </div>

      </div>
    </div>
  );
}