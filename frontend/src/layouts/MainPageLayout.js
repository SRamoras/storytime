import React, { useEffect, useState } from 'react';
import './SecLayout.css';
import LogoText from '../components/LogoText';
import BlackButton from '../components/BlackButton';
import { Outlet } from 'react-router-dom'; // Importar Outlet

function MainPageLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="layout">
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="header-container">
          <div className="logo">
            <LogoText text="StoryHub" to="/" />
          </div>
          <div className="nav-buttons">
            <BlackButton text="Start now" to="/login" />
          </div>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="content">
        <Outlet /> {/* Renderiza os componentes filhos */}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 StoryTime. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default MainPageLayout;
