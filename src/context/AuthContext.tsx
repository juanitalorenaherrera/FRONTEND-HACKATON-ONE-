// src/context/AuthContext.tsx

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, logout as apiLogout, getProfile } from '../services/authService';

import type { User } from '../types/user';
import { useNavigate } from 'react-router-dom';

// ====================================================================
// 1. TIPOS Y CONTEXTO (Sin cambios)
// ====================================================================
export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ====================================================================
// 2. AuthProvider: Componente con lógica mejorada
// ====================================================================
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Efecto para verificar la sesión al cargar la aplicación
    useEffect(() => {
        const checkUserSession = async () => {
            const token = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('authUser'); // <-- CAMBIO: Leemos también el usuario

            // Si tenemos ambos, la sesión es válida y la cargamos instantáneamente
            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Error al parsear datos de usuario desde localStorage", error);
                    // Si los datos están corruptos, limpiamos todo
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('authUser');
                }
            }
            // Marcamos la carga como finalizada, ya sea que encontramos sesión o no.
            setIsLoading(false);
        };

        checkUserSession();
    }, []);

    // Función de Login
    const login = async (credentials: { email: string; password: string }) => {
        try {
            const userData = await apiLogin(credentials); // apiLogin debe devolver { user, token }
            setUser(userData);
            
            // --- CAMBIO: Guardamos el objeto user en localStorage ---
            // El token ya lo guarda tu `authService`, pero ahora guardamos el usuario también.
            localStorage.setItem('authUser', JSON.stringify(userData));
            
            navigate('/clientDashboard');
        } catch (error) {
            console.error("Login fallido:", error);
            throw error;
        }
    };

    // Función de Logout
    const logout = () => {
        apiLogout(); // Tu servicio debería encargarse de remover el token
        setUser(null);

        // --- CAMBIO: Limpiamos también el usuario de localStorage ---
        localStorage.removeItem('authUser');
        
        navigate('/login');
    };

    const value: AuthContextType = { user, isLoading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

// ====================================================================
// 3. useAuth: El Hook "Consumidor" (Sin cambios)
// ====================================================================
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}