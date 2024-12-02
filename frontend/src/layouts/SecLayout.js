// src/layouts/SecLayout.js

import React, { useEffect, useState } from 'react';
import './SecLayout.css';
import LogoText from '../components/LogoText';
import BlackButton from '../components/BlackButton';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function SecLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]); // Estado para armazenar categorias
  const navigate = useNavigate(); // Para redirecionar após logout

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
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Dados do usuário autenticado:', response.data);
        setUsername(response.data.username);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        setIsAuthenticated(false);
      }
    };

    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const response = await api.get('/auth/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.categories);
        console.log('Categorias obtidas:', response.data.categories); // Debug
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchUser();
    fetchCategories();
  }, []);

  // Adicionar useEffect para depuração do estado categories
  useEffect(() => {
    console.log('Estado "categories" atualizado:', categories);
  }, [categories]);

  // Função para lidar com o logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername('');
    navigate('/login'); // Redireciona para a página de login
  };

  // Função para adicionar/remover classe ao header
  const toggleHeaderBackground = (add) => {
    const header = document.querySelector('.header');
    if (header) {
      if (add) {
        header.classList.add('background-hover');
      } else {
        header.classList.remove('background-hover');
      }
    }
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="header-container">
          {/* LogoText à esquerda */}
          <div
            className="logo"
            onMouseEnter={() => toggleHeaderBackground(true)}
            onMouseLeave={() => toggleHeaderBackground(false)}
          >
            <LogoText text="Discover New Stories" to="/StorysPage" />
          </div>

          {/* Botões à direita */}
          <div className="nav-buttons">
            {/* Botão Home */}
            <div
              className="topics-menu"
              onMouseEnter={() => toggleHeaderBackground(true)}
              onMouseLeave={() => toggleHeaderBackground(false)}
            >
              <Link
                to="/StorysPage"
                className="nav-button"
                onMouseEnter={() => toggleHeaderBackground(true)}
                onMouseLeave={() => toggleHeaderBackground(false)}
              >
                <span className="material-symbols-outlined nav-icon">home</span>
                Home
              </Link>
            </div>

            {/* Menu de "Topics" com dropdown */}
            <div
              className="topics-menu"
              onMouseEnter={() => toggleHeaderBackground(true)}
              onMouseLeave={() => toggleHeaderBackground(false)}
            >
              <span
                className="nav-button"
                onMouseEnter={() => toggleHeaderBackground(true)}
                onMouseLeave={() => toggleHeaderBackground(false)}
              >
                <span className="material-symbols-outlined nav-icon">category</span>
                Topics
                <span className="material-symbols-outlined arrow-icon">
                  arrow_downward
                </span>
              </span>
              <div className="dropdown-content">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/StorysPage?category=${encodeURIComponent(category.name)}`}
                      className="dropdown-item"
                      onMouseEnter={() => toggleHeaderBackground(true)}
                      onMouseLeave={() => toggleHeaderBackground(false)}
                    >
                      <span className="material-symbols-outlined dropdown-icon">category</span>
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <p className="dropdown-item">Nenhuma categoria disponível</p>
                )}
              </div>
            </div>

            {/* Botão About Us */}
            <div
              className="topics-menu"
              onMouseEnter={() => toggleHeaderBackground(true)}
              onMouseLeave={() => toggleHeaderBackground(false)}
            >
              <Link
                to="/StorysPage"
                className="nav-button"
                onMouseEnter={() => toggleHeaderBackground(true)}
                onMouseLeave={() => toggleHeaderBackground(false)}
              >
                <span className="material-symbols-outlined nav-icon">info</span>
                About Us
              </Link>
            </div>

            {/* Menu de Perfil com dropdown */}
            {isAuthenticated && username && (
              <div
                className="profile-menu"
                onMouseEnter={() => toggleHeaderBackground(true)}
                onMouseLeave={() => toggleHeaderBackground(false)}
              >
                <span
                  className="nav-button"
                  onMouseEnter={() => toggleHeaderBackground(true)}
                  onMouseLeave={() => toggleHeaderBackground(false)}
                >
                  <span className="material-symbols-outlined nav-icon">person</span>
                  {username}
                  <span className="material-symbols-outlined arrow-icon">
                    arrow_downward
                  </span>
                </span>
                <div className="dropdown-content">
                  <Link
                    to={`/Profile/${username}`}
                    className="dropdown-item"
                    onMouseEnter={() => toggleHeaderBackground(true)}
                    onMouseLeave={() => toggleHeaderBackground(false)}
                  >
                    <span className="material-symbols-outlined dropdown-icon">person</span>
                    Profile
                  </Link>
                  <Link
                    to={`/Profile/${username}?tab=settings`}
                    className="dropdown-item"
                    onMouseEnter={() => toggleHeaderBackground(true)}
                    onMouseLeave={() => toggleHeaderBackground(false)}
                  >
                    <span className="material-symbols-outlined dropdown-icon">settings</span>
                    Settings
                  </Link>
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                    onMouseEnter={() => toggleHeaderBackground(true)}
                    onMouseLeave={() => toggleHeaderBackground(false)}
                  >
                    <span className="material-symbols-outlined dropdown-icon logout-icon">logout</span>
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Botão Create Story (sem ícone) */}
            <BlackButton
              text="Create Story"
              to="/create-story"
              onMouseEnter={() => toggleHeaderBackground(true)}
              onMouseLeave={() => toggleHeaderBackground(false)}
            />
          </div>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="content">
        <Outlet /> {/* Renderiza as rotas aninhadas aqui */}
      </main>

      {/* Rodapé (Footer) */}
      <footer className="footer">
        <div className="footer-container">
          {/* Links de navegação no footer */}
          <div className="footer-links">
            <Link to="/about" className="footer-link">
              <span className="material-symbols-outlined footer-icon">info</span>
              Sobre Nós
            </Link>
            <Link to="/contact" className="footer-link">
              <span className="material-symbols-outlined footer-icon">contact_mail</span>
              Contato
            </Link>
            <Link to="/privacy" className="footer-link">
              <span className="material-symbols-outlined footer-icon">privacy_tip</span>
              Política de Privacidade
            </Link>
          </div>
          
          {/* Ícones de redes sociais (opcional) */}
          <div className="footer-social">
            <a href="https://facebook.com" className="footer-link" aria-label="Facebook">
              <span className="material-symbols-outlined footer-social-icon">facebook</span>
              Facebook
            </a>
            <a href="https://twitter.com" className="footer-link" aria-label="Twitter">
              <span className="material-symbols-outlined footer-social-icon">twitter</span>
              Twitter
            </a>
            <a href="https://instagram.com" className="footer-link" aria-label="Instagram">
              <span className="material-symbols-outlined footer-social-icon">instagram</span>
              Instagram
            </a>
          </div>

          {/* Direitos autorais */}
          <div className="footer-copyright">
            &copy; 2024 StoryTime. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SecLayout;
