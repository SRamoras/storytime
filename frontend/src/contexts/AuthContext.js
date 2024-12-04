// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Certifique-se de que o caminho está correto

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Função para buscar os dados do usuário autenticado
    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Configura o header de autorização para todas as requisições
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Faz uma requisição para a rota protegida para obter os dados do usuário
                const response = await api.get('auth/protected-route'); // Certifique-se de que essa rota está implementada no backend
                setCurrentUser(response.data.user);
            } catch (error) {
                console.error('Erro ao buscar usuário autenticado:', error);
                setCurrentUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, fetchUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

