import React, { useEffect, useState } from 'react';
import './SecLayout.css';
import NavButton from '../components/NavButton';
import LogoText from '../components/LogoText';
import BlackButton from '../components/BlackButton';



function SecLayout({ children }) {

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);




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
          <NavButton text="Home" to="/" />
            <NavButton text="Topics" to="/" />
            <NavButton text="About Us" to="/explore" />
            <NavButton text="Profile" to="/about" />
            <BlackButton text="Create Story" to="/create-story" />
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
