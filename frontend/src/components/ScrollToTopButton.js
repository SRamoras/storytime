import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';
import { FaLongArrowAltUp } from 'react-icons/fa'; // Importa o ícone


const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Função para verificar a posição do scroll
    const handleScroll = () => {
      if (window.pageYOffset > 10) {
        setShowButton(true); // Mostra o botão após rolar 10px
      } else {
        setShowButton(false); // Esconde o botão se estiver no topo
      }
    };

    // Adiciona o event listener
    window.addEventListener('scroll', handleScroll);

    // Limpa o event listener ao desmontar o componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Função para rolar suavemente até o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Rolagem suave
    });
  };

  return (
    <>
      {showButton && (
        <button className="scroll-to-top-button" onClick={scrollToTop}>
          <FaLongArrowAltUp className="arrow-icon" />
        </button>
      )}
    </>
  );
  
};

export default ScrollToTopButton;
