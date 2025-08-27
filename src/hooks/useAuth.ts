import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * Centraliza la lógica de consumo y la verificación de existencia del provider.
 */
export const useAuth = () => {
  // Consume el contexto
    const context = useContext(AuthContext);

  // Lanza un error si el hook se usa fuera de un AuthProvider
    if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }

    return context;
};