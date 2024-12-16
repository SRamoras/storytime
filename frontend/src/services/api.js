// frontend/src/services/api.js
import axios from 'axios';


const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://storytime-backend-f240.onrender.com/api' 
});


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


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, config } = error.response;
            const originalRequest = config;

     
            const excludedEndpoints = ['/auth/login', '/auth/register'];

      
            const isExcluded = excludedEndpoints.some(endpoint => originalRequest.url.includes(endpoint));

            console.log(`Interceptor de resposta: status ${status}, endpoint ${originalRequest.url}, excluído: ${isExcluded}`);

            if (!isExcluded && (status === 401 || status === 403)) {
                localStorage.removeItem('token');         
                window.location.href = '/login';
            }
        }
        return Promise.reject(error); 
    }
);

export default api;
