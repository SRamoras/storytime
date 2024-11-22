import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import BlackButton from '../components/BlackButton'; // Certifique-se de que o caminho está correto

const LoginPageMain = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Substituindo useHistory por useNavigate

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token); // Salva o token no localStorage
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`; // Configura o header de autorização global do Axios
    
            alert('Login bem-sucedido!');
            navigate(`/profile/${username}`); // Redireciona para a página de perfil com o username
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
                <BlackButton type="submit" text="Login" /> {/* Supondo que você tem este componente */}
                <div>
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginPageMain;
