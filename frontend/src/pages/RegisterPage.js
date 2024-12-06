// src/pages/RegisterPage.js

import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // Usando o mesmo arquivo CSS da página de login
import registerImage from '../Assets/register_foto.jpg'; // Certifique-se de que esta imagem existe ou use a mesma da página de login

// Importando ícones do react-icons
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

// Importando o toast do react-toastify
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para alternar a visibilidade da senha
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para validar o formato do email
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Previne múltiplas submissões

    // Validação dos campos no frontend
    const { username, firstname, lastname, email, password } = formData;

    if (!username || !firstname || !lastname || !email || !password) {
      toast.error('Por favor, preencha todos os campos.', {
        position: "top-right",
        autoClose: 3000, // 3 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Por favor, insira um email válido.', {
        position: "top-right",
        autoClose: 3000, // 3 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setIsLoading(true);
    console.log('handleRegister foi chamado'); // Para depuração

    try {
      const response = await api.post('/auth/register', formData);
      console.log('Resposta do servidor:', response.data); // Para depuração

      // Exibir notificação de sucesso
      toast.success('Usuário registrado com sucesso!', {
        position: "top-right",
        autoClose: 1500, // 1.5 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      // Navegar para a página de login após exibir o toast
      setTimeout(() => {
        navigate('/login');
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Erro ao registrar o usuário:', error);

      // Determinar a mensagem de erro com base na resposta do servidor
      let errorMessage = 'Erro ao registrar o usuário. Por favor, verifique seus dados e tente novamente.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Exibir notificação de erro
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000, // 3 segundos
        hideProgressBar: false,
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
      <form className="login-form register-form" onSubmit={handleRegister}>
        <h1>Register</h1>
        <p>Create your account</p>
        
        {/* Campo de Username com Ícone */}
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            className="input-field"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            // Removendo o atributo 'required' para evitar a validação nativa do navegador
          />
        </div>

        {/* Campo de First Name com Ícone */}
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            className="input-field"
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            // Removendo o atributo 'required'
          />
        </div>

        {/* Campo de Last Name com Ícone */}
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            className="input-field"
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            // Removendo o atributo 'required'
          />
        </div>

        {/* Campo de Email com Ícone */}
        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            // Removendo o atributo 'required'
          />
        </div>

        {/* Campo de Password com Ícone e Botão de Alternância */}
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            className="input-field"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            // Removendo o atributo 'required'
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

        {/* Botão de Registro */}
        <button type="submit" className="first-button" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Register'}
        </button>

        {/* Link para Login com Ícone de Seta */}
        <div className="register-link">
          <p>Already have an account?{' '}
            <Link to="/login" className="register-link-with-arrow">
              Login here <FaArrowRight className="arrow-icon" />
            </Link>
          </p>
        </div>
      </form>

      {/* Imagem Lado Direito */}
      <div className="right-image">
        <img src={registerImage} alt="Decorative right side" /> {/* Certifique-se de que esta imagem existe */}
      </div>
    </div>
  );
};

export default RegisterPage;
