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
            <NavButton text="Home" to="/StorysPage" />

            {/* Menu de "Topics" com dropdown */}
            <div className="topics-menu">
              <span className="nav-button">Topics</span>
              <div className="dropdown-content">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/StorysPage?category=${encodeURIComponent(category.name)}`}
                      className="dropdown-item"
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <p className="dropdown-item">Nenhuma categoria disponível</p>
                )}
              </div>
            </div>

            <NavButton text="About Us" to="/explore" />

            {/* Exibe o menu de perfil com dropdown */}
            {isAuthenticated && username && (
              <div className="profile-menu">
                <span className="nav-button">{username}</span>
                <div className="dropdown-content">
                  <Link to={`/Profile/${username}`} className="dropdown-item">
                    Profile
                  </Link>
                  <Link
                    to={`/Profile/${username}?tab=settings`}
                    className="dropdown-item"
                  >
                    Settings
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            )}

            <BlackButton text="Create Story" to="/create-story" />
          </div>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="content">
        <Outlet /> {/* Renderiza as rotas aninhadas aqui */}
      </main>

      {/* Rodapé */}
      <footer className="footer">
        <p>&copy; 2024 StoryTime. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default SecLayout;
