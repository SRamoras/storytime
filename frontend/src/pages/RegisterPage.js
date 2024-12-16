

import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; 
import registerImage from '../assets/register_foto.jpg'; 


import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';


import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return; 

    
    const { username, firstname, lastname, email, password } = formData;

    if (!username || !firstname || !lastname || !email || !password) {
      toast.error('Por favor, preencha todos os campos.', {
        position: "top-right",
        autoClose: 3000, 
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
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!isValidPassword(password)) {
      toast.error('A senha deve ter pelo menos 6 caracteres e incluir pelo menos uma letra maiúscula.', {
        position: "top-right",
        autoClose: 5000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setIsLoading(true);
    console.log('handleRegister foi chamado'); 

    try {
      const response = await api.post('/auth/register', formData);
      console.log('Resposta do servidor:', response.data); 

      
      toast.success('Usuário registrado com sucesso!', {
        position: "top-right",
        autoClose: 1500, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      
      setTimeout(() => {
        navigate('/login');
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Erro ao registrar o usuário:', error);

      
      let errorMessage = 'Erro ao registrar o usuário. Por favor, verifique seus dados e tente novamente.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setIsLoading(false);
    }
  };

  
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
