import React, { useEffect, useState } from 'react';
import './SecLayout.css';
import NavButton from '../components/NavButton';
import LogoText from '../components/LogoText';
import BlackButton from '../components/BlackButton';

function MainLayout({ children }) {
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
          {/* Logo */}
          <div className="logo">
            <LogoText text="StoryHub" to="/" />
          </div>

          {/* Navigation Buttons */}
          <div className="nav-buttons">
            <BlackButton text="Start now" to="/login" />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 StoryTime. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default MainLayout;
