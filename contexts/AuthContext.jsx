'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
    user: null,
    isLoading: true,
    login: (userData) => { },
    logout: () => { },
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Загружаем пользователя из localStorage при загрузке
        const loadUser = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
            setIsLoading(false);
        };

        loadUser();

        // Слушаем изменения localStorage для синхронизации между вкладками
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                if (e.newValue) {
                    setUser(JSON.parse(e.newValue));
                } else {
                    setUser(null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        // Триггерим событие для других вкладок
        window.dispatchEvent(new Event('storage'));
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);

        // Триггерим событие для других вкладок
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);