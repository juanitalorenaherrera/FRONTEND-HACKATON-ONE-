import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../../context/AuthContext";
import type { User } from "../../types/user";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
    } , []);

    const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    };

    return (
    <AuthContext.Provider value={{ user, login, logout }}>
        {children}
    </AuthContext.Provider>
    );
};