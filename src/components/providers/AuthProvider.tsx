import React, { ReactNode, useEffect, useState } from 'react';
import { login as apiLogin, logout as apiLogout, getProfile } from '../../services/authService';

import { AuthContext } from '../../context/AuthContext';
import type { AuthContextType } from '../../context/AuthContext';
import type { User } from '../../types/user';
import { useNavigate } from 'react-router-dom';

// Exporta únicamente el componente, cumpliendo la regla de Fast Refresh.
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Esta función se ejecuta una vez para verificar si ya existe una sesión.
        const loadUserProfile = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
            // Llama al servicio para obtener los datos del perfil.
            const userData = await getProfile();
            setUser(userData);
            } catch (error) {
            console.error("Token inválido o sesión expirada:", error);
            localStorage.removeItem('authToken'); 
            setUser(null);
            }
        }
        setIsLoading(false);
        };

        loadUserProfile();
    }, []);

    const handleLogin = async (credentials: { email: string; password: string }) => {
        try {
        const userData = await apiLogin(credentials);
        setUser(userData);
        navigate('/clientDashboard'); // O la ruta principal de tu app
        } catch (error) {
        console.error("Login fallido:", error);
        throw error; // Lanza el error para que el formulario de login pueda mostrar un mensaje.
        }
    };

    const handleLogout = () => {
        apiLogout();
        setUser(null);
        navigate('/login');
    };

    // Prepara el objeto 'value' que se compartirá a través del contexto.
    const value: AuthContextType = { 
        user, 
        isLoading, 
        login: handleLogin, 
        logout: handleLogout 
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}