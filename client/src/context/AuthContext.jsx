import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext({
    user: null, // Datos del usuario logueado ({ id, username, email, role })
    token: null, // JWT
    isLoggedIn: false, // Estado de conexión
    login: (token, userData) => {}, // Función para iniciar sesión
    logout: () => {}, // Función para cerrar sesión
});

const STORAGE_KEY_TOKEN = 'userToken';
const STORAGE_KEY_USER = 'userData';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const isLoggedIn = !!token && !!user;

    // Efecto para hidratar el estado desde localStorage al montar
    useEffect(() => {
        const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        
        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (error) {
                console.error("Error al cargar datos del usuario desde el almacenamiento:", error);
                // Limpiar si los datos están corruptos
                localStorage.removeItem(STORAGE_KEY_TOKEN);
                localStorage.removeItem(STORAGE_KEY_USER);
            }
        }
    }, []);

    // Función para iniciar sesión
    const login = useCallback((newToken, userData) => {
        localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    }, []);

    // Función para cerrar sesión
    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
        setToken(null);
        setUser(null);
    }, []);

    const contextValue = {
        user,
        token,
        isLoggedIn,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto
export function useAuthContext() {
    return useContext(AuthContext);
}

export default AuthContext;