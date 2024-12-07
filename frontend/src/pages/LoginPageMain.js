// src/pages/LoginPageMain.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import loginImage from '../assets/login_foto.jpg';
import jwt_decode from 'jwt-decode'; // Importação Padrão

// Importando ícones do react-icons
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

// Importando componentes do react-toastify
import { toast } from 'react-toastify';

const LoginPageMain = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
    const navigate = useNavigate();

    // useEffect para resetar os campos de login sempre que o componente é montado
    useEffect(() => {
        setUsernameInput('');
        setPassword('');
        setShowPassword(false);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário
        if (isLoading) return; // Previne múltiplas submissões
        setIsLoading(true);
        console.log('handleLogin foi chamado'); // Para depuração

        try {
            const response = await api.post('/auth/login', { username: usernameInput, password });
            console.log('Resposta do servidor:', response.data); // Para depuração

            const token = response.data.token;

            // Decodificar o token para obter o username
            const decodedToken = jwt_decode(token);
            console.log('Decoded Token:', decodedToken); // Adicionado para depuração
            const username = decodedToken.username; // Ajuste conforme a estrutura do token

            // Verificar se o username está definido
            if (!username) {
                throw new Error('Username não encontrado no token.');
            }

            // Armazenar o token no localStorage
            localStorage.setItem('token', token);

            // Configurar o header de autorização para requisições futuras
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Log antes do toast
            console.log('Chamando toast.success para login bem-sucedido');

            // Exibir notificação de sucesso
            toast.success('Login bem-sucedido!', {
                position: "top-right",
                autoClose: 1500, // 1.5 segundos
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });

            // Navegar após exibir o toast
            setTimeout(() => {
                navigate(`/profile/${username}`);
                setIsLoading(false);
            }, 1500);

        } catch (error) {
            console.error('Erro ao fazer login:', error);

            // Determinar a mensagem de erro com base na resposta do servidor
            let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }

            // Exibir notificação de erro
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 1500, // 1.5 segundos
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setIsLoading(false);
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
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
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
                <button type="submit" className="first-button" disabled={isLoading}>
                 Login
                </button>

                {/* Link para Registro com Ícone de Seta */}
                <div className="register-link">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="register-link-with-arrow">
                            Register here <FaArrowRight className="arrow-icon" />
                        </Link>
                    </p>
                </div>
            </form>

            {/* Botão de Teste para Toastr (Remover após o teste) */}
            {/* <button onClick={() => toast.info('Este é um toast de teste!')}>
                Mostrar Toast de Teste
            </button> */}

            {/* Imagem Lado Direito */}
            <div className="right-image">
                <img src={loginImage} alt="Decorative right side" />
            </div>

            {/* O ToastContainer agora está no App.js, não é necessário aqui */}
        </div>
    );
};

export default LoginPageMain;
