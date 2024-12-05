import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';
import { FaLongArrowAltUp } from 'react-icons/fa'; // Importa o ícone

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(20); // Define a distância inicial do botão em relação à parte inferior

  useEffect(() => {
    // Função para verificar a posição do scroll
    const handleScroll = () => {
      const footer = document.querySelector('.footer'); // Certifique-se de que a classe do footer está correta

      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Mostra o botão após rolar 10px
      setShowButton(window.pageYOffset > 10);

      // Ajusta o botão para "parar" antes de tocar o footer
      if (footerRect.top < windowHeight) {
        const overlap = windowHeight - footerRect.top; // Calcula o quanto o botão está "sobrepondo" o footer
        setBottomOffset(20 + overlap); // Ajusta a posição do botão
      } else {
        setBottomOffset(20); // Reseta a posição quando o footer não está visível
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
    <button
      className={`scroll-to-top-button ${showButton ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{ bottom: `${bottomOffset}px` }} // Atualiza a posição dinamicamente
    >
      <FaLongArrowAltUp className="arrow-icon-main" />
    </button>
  );
};

export default ScrollToTopButton;
