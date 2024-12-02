// src/pages/LoginPageMain.js

import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import BlackButton from '../components/BlackButton';
import loginImage from '../Assets/login_foto.jpg';

// Importando ícones do react-icons
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPageMain = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para alternar a visibilidade da senha
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            alert('Login bem-sucedido!');
            navigate(`/profile/${username}`);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    // Função para alternar a visibilidade da senha
    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Hello Again!</h1>
                <p>Welcome Back</p>
                
                {/* Campo de Username com Ícone */}
                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                {/* Campo de Password com Ícone e Botão de Alternância */}
                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        className="input-field"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle-button"
                        onClick={toggleShowPassword}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>

                {/* Botão de Login */}
                <BlackButton type="submit" text="Login" />

                {/* Link para Registro */}
                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </form>

            {/* Imagem Lado Direito */}
            <div className="right-image">
                <img src={loginImage} alt="Decorative right side" />
            </div>
        </div>
    );
};

export default LoginPageMain;
