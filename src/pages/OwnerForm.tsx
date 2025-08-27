import React, { useState } from "react";

const OwnerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    petName: "",
    email: "",
    service: "",
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Solicitud de servicio:", formData);
    alert(`¡Solicitud enviada para ${formData.petName}!`);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
        Reserva un servicio para tu mascota 🐶🐱
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="ownerName"
          placeholder="Tu nombre"
          value={formData.ownerName}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="petName"
          placeholder="Nombre de tu mascota"
          value={formData.petName}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        >
          <option value="">Selecciona un servicio</option>
          <option value="walk">Paseo</option>
          <option value="care">Cuidado en casa</option>
          <option value="training">Entrenamiento</option>
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
        >
          Reservar
        </button>
      </form>
    </div>
  );
};

export default OwnerForm;
