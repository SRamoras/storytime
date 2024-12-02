// src/layouts/SecLayout.js

import React, { useEffect, useState } from 'react';
import './SecLayout.css';
import NavButton from '../components/NavButton';
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
          <div className="logo">
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
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <p className="dropdown-item">Nenhuma categoria disponível</p>
                )}
              </div>
            </div>

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
    About us
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
                    Profile
                  </Link>
                  <Link
                    to={`/Profile/${username}?tab=settings`}
                    className="dropdown-item"
                    onMouseEnter={() => toggleHeaderBackground(true)}
                    onMouseLeave={() => toggleHeaderBackground(false)}
                  >
                    Settings
                  </Link>
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                    onMouseEnter={() => toggleHeaderBackground(true)}
                    onMouseLeave={() => toggleHeaderBackground(false)}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Botão Create Story */}
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

      {/* Rodapé */}
      <footer className="footer">
        <div className="footer-container">
          {/* Links de navegação no footer */}
          <div className="footer-links">
            <Link to="/about" className="footer-link">Sobre Nós</Link>
            <Link to="/contact" className="footer-link">Contato</Link>
            <Link to="/privacy" className="footer-link">Política de Privacidade</Link>
          </div>
          
          {/* Ícones de redes sociais (opcional) */}
          <div className="footer-social">
            <a href="https://facebook.com" className="footer-link" aria-label="Facebook">
              {/* Ícone do Facebook */}
              <svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.675 0h-21.35C.596 0 0 .593 0 1.326v21.348C0 23.406.596 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.716-1.795 1.764v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.404 24 24 23.406 24 22.674V1.326C24 .593 23.404 0 22.675 0z"/>
              </svg>
            </a>
            <a href="https://twitter.com" className="footer-link" aria-label="Twitter">
              {/* Ícone do Twitter */}
              <svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184A4.916 4.916 0 0 0 16.616 3c-2.737 0-4.952 2.215-4.952 4.951 0 .388.044.765.127 1.124C7.728 8.84 4.1 6.884 1.671 3.905a4.822 4.822 0 0 0-.666 2.482c0 1.713.87 3.223 2.188 4.107a4.904 4.904 0 0 1-2.24-.616v.062c0 2.385 1.698 4.374 3.946 4.828a4.902 4.902 0 0 1-2.232.084c.63 1.953 2.445 3.377 4.6 3.417A9.868 9.868 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.01-7.514 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/>
              </svg>
            </a>
            <a href="https://instagram.com" className="footer-link" aria-label="Instagram">
              {/* Ícone do Instagram */}
              <svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.976 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.976.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.976-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.976-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.766.132 4.575.418 3.633 1.36c-.942.942-1.228 2.133-1.288 3.419C2.013 6.332 2 6.741 2 12s.013 5.668.072 6.948c.06 1.286.346 2.477 1.288 3.419.942.942 2.133 1.228 3.419 1.288 1.28.059 1.689.072 6.948.072s5.668-.013 6.948-.072c1.286-.06 2.477-.346 3.419-1.288.942-.942 1.228-2.133 1.288-3.419.059-1.28.072-1.689.072-6.948s-.013-5.668-.072-6.948c-.06-1.286-.346-2.477-1.288-3.419C19.425.418 18.234.132 16.948.072 15.668.013 15.259 0 12 0zM12 5.838a6.162 6.162 0 1 0 0 12.324A6.162 6.162 0 0 0 12 5.838zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
              </svg>
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
