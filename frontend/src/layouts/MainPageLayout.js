// src/layouts/MainPageLayout.js

import React, { useEffect, useState } from 'react';
import './SecLayout.css'; // Reutilizando o CSS de SecLayout
import LogoText from '../components/LogoText';
import BlackButton from '../components/BlackButton';
import { Outlet } from 'react-router-dom'; // Importar Outlet
import { HashLink as HashLink } from 'react-router-hash-link'; // Importar HashLink
import api from '../services/api';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa'; // Importando ícones de redes sociais
import { Link } from 'react-router-dom'; // Importar Link
function MainPageLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]); // Estado para armazenar categorias (se aplicável)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Adicionar evento de scroll
    window.addEventListener('scroll', handleScroll);

    // Limpar evento ao desmontar o componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories'); // Endpoint para buscar categorias públicas
        setCategories(response.data.categories);
        console.log('Categorias obtidas:', response.data.categories); // Debug
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="layout">
      {/* Header */}
      <header className={`header1 ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="header-container">
          <div className="logo">
            <LogoText text="StoryHub" to="/" />
          </div>
          <div className="nav-buttons">
            {/* Botões de Navegação para Âncoras */}
            <HashLink smooth to="/#home" className="nav-button">
              Home
            </HashLink>
            <HashLink smooth to="/#info" className="nav-button">
              About
            </HashLink>
            <HashLink smooth to="/#features" className="nav-button">
              Features
            </HashLink>
            <HashLink smooth to="/#cards" className="nav-button">
              Cards
            </HashLink>
            <HashLink smooth to="/#reviews" className="nav-button">
              Reviews
            </HashLink>
            <Link to="/login">
                                <button className='first-button'>Start Now</button>
                            </Link>
          </div>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="content">
        <Outlet /> {/* Renderiza os componentes filhos */}
      </main>

      {/* Footer Adaptado */}
      <footer className="footer">
        <div className="footer-container">
          {/* Seção 1: Genre Links */}
          <div className="footer-section">
            <h3>Genre Links</h3>
            <ul>
            <li><Link to='/Login' className="footer-link">Adventure</Link></li>
            <li><Link to='/Login' className="footer-link">Fantasy</Link></li>
            <li><Link to='/Login' className="footer-link">Mystery</Link></li>
            <li><Link to='/Login' className="footer-link">Romance</Link></li>
            </ul>
          </div>

          {/* Seção 2: General Links */}
          <div className="footer-section">
            <h3>General Links</h3>
            <ul>
              <li><HashLink smooth to="/Login" className="footer-link">Home</HashLink></li>
              <li><HashLink smooth to="/Login" className="footer-link">Topics</HashLink></li>
              {/* <li><HashLink smooth to="/StorysPage" className="footer-link">About Us</HashLink></li> */}
            </ul>
          </div>

          {/* Seção 3: Profile Links */}
          <div className="footer-section">
            <h3>Profile Links</h3>
            <ul>
              <li><HashLink smooth to='/Login' className="footer-link">Profile</HashLink></li>
              <li><HashLink smooth to='/Login' className="footer-link">Settings</HashLink></li>
              <li><HashLink smooth to='/Login' className="footer-link">Logout</HashLink></li>
            </ul>
          </div>

          {/* Seção 4: Redes Sociais */}
          <div className="footer-section socials">
            <h3>Social Networks</h3>
            <div className="social-icons">
              {/* Instagram */}
              <a href="https://www.instagram.com/_____s1lva_____/" className="social-link instagram" aria-label="Instagram">
                <FaInstagram className="social-icon" />
              </a>

              {/* GitHub */}
              <a href="https://github.com/SRamoras" className="social-link github" aria-label="GitHub">
                <FaGithub className="social-icon" />
              </a>

              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/diogo-silva-94068613b/" className="social-link linkedin" aria-label="LinkedIn">
                <FaLinkedin className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainPageLayout;
