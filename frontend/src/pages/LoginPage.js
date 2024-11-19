import React, { useState } from 'react';
import api from '../services/api';
import './LoginPage.css';
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token); // Salva o token no localStorage
            alert('Login bem-sucedido!');
        } catch (error) {
            alert('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Login</h1>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="input-field"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="button-black" type="submit">Login</button>
          
            <div>
                <p>Don't have an account?   <a href="/register">Register here</a></p>
             
            </div>  </form>
        </div>
    );
};

export default LoginPage;
