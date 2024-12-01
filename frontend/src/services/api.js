// src/services/api.js
import axios from 'axios';

// Cria uma instância do Axios com a baseURL configurada
const api = axios.create({
    baseURL: 'http://localhost:5000/api' // Certifique-se de que este é o endpoint correto do seu back-end
});

// Interceptor de requisição para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de resposta para lidar com erros de autenticação
api.interceptors.response.use(
    (response) => response, // Retorna a resposta diretamente se não houver erro
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401 || status === 403) {
                // Token expirado ou inválido
                // Remove o token do localStorage
                localStorage.removeItem('token');

                // Opcional: Remova outros dados de autenticação se existirem
                // Por exemplo: localStorage.removeItem('user');

                // Redireciona para a página de login
                window.location.href = '/login';
            }
        }
        return Promise.reject(error); // Propaga o erro para o componente que fez a requisição
    }
);

export default api;
