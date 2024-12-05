import React, { useEffect, useState } from 'react';

import LogoText from '../components/LogoText';
import { Outlet } from 'react-router-dom'; // Importar Outlet

function ThirdLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <div className="layout">
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="header-container">
          {/* Logo */}
          <div className="logo">
            <LogoText text="StoryHub" to="/" />
          </div>

          {/* Botões de navegação (se necessários, podem ser adicionados aqui) */}
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="content">
        <Outlet /> {/* Renderiza as rotas aninhadas */}
      </main>


    
    </div>
  );
}

export default ThirdLayout;
