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
      <header className={`header1 ${isScrolled ? 'scrolled' : ''}`}>
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
            {/* <BlackButton
              text="Create Story"
              to="/create-story"
              onMouseEnter={() => toggleHeaderBackground(true)}
              onMouseLeave={() => toggleHeaderBackground(false)}
            /> */}

<Link to="/create-story"
 onMouseEnter={() => toggleHeaderBackground(true)}
 onMouseLeave={() => toggleHeaderBackground(false)}
>
<button className='first-button'>Start for free</button>
                            </Link>
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
          {/* Seção 1: StoryHub */}
          <div className="footer-section">
            <h3>Genre Links</h3>
            <ul>
            {categories.length > 0 ? (
                  categories.map((category) => (
                    
                    <Link
                      key={category.id}
                      to={`/StorysPage?category=${encodeURIComponent(category.name)}`}
                      className="footer-link"
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <p>Nenhuma categoria disponível</p>
                )}
            </ul>
          </div>

          {/* Seção 2: Links */}
          <div className="footer-section">
            <h3>General Links</h3>
            <ul>
              <li><Link to='/StorysPage' className="footer-link">Home</Link></li>
              <li><Link to='/StorysPage' className="footer-link">Topics</Link></li>
              <li><Link to='/StorysPage' className="footer-link">About Us</Link></li>
            </ul>
          </div>

          {/* Seção 3: Perfil */}
          <div className="footer-section">
            <h3>Profile Links</h3>
            <ul>
              <li><Link to={`/Profile/${username}`} className="footer-link">Profile</Link></li>
              <li><Link   to={`/Profile/${username}?tab=settings`} className="footer-link">Settings</Link></li>
              <li><Link to='/login' className="footer-link">Logout</Link></li>
            </ul>
          </div>

          {/* Seção 4: Redes Sociais */}
          <div className="footer-section socials">
            <h3>Redes Sociais</h3>
            <div className="social-icons">
  {/* Instagram */}
  <a href="https://www.instagram.com/_____s1lva_____/" className="social-link instagram" aria-label="Instagram">
    <i className="fa fa-instagram social-icon"></i>
  </a>

  {/* GitHub */}
  <a href="https://github.com/SRamoras" className="social-link github" aria-label="GitHub">
    <i className="fa fa-github social-icon"></i>
  </a>

  {/* LinkedIn */}
  <a href="https://www.linkedin.com/in/diogo-silva-94068613b/" className="social-link linkedin" aria-label="LinkedIn">
    <i className="fa fa-linkedin social-icon"></i>
  </a>
</div>

          </div>
        </div>
      </footer>
    </div>
  );
}

export default SecLayout;
