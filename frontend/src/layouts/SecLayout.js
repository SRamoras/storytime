import React from 'react';
import './SecLayout.css';
import NavButton from '../components/NavButton';
import LogoText from '../components/LogoText';
import BlackButton from '../components/BlackButton';
function SecLayout({ children }) {
  return (
    <div className="layout">
      {/* Cabeçalho */}
      <header className="header">
        <nav className="header-container">
          {/* LogoText à esquerda */}
          <div className="logo">
            <LogoText text="Discover New Stories" to="/StorysPage" />
          </div>

          {/* Botões à direita */}
          <div className="nav-buttons">
          <NavButton text="Home" to="/" />
            <NavButton text="Topics" to="/" />
            <NavButton text="About Us" to="/explore" />
            <NavButton text="Profile" to="/about" />
            <BlackButton text="Create Story" to="/StorysPage" />
          </div>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="content">
        {children}
      </main>

      {/* Rodapé */}
      <footer className="footer">
        <p>&copy; 2024 StoryTime. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default SecLayout;
