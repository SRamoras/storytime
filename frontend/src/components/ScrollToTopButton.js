import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';
import { FaLongArrowAltUp } from 'react-icons/fa'; 

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(20); 

  useEffect(() => {
    
    const handleScroll = () => {
      const footer = document.querySelector('.footer'); 

      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      
      setShowButton(window.pageYOffset > 10);

      
      if (footerRect.top < windowHeight) {
        const overlap = windowHeight - footerRect.top; 
        setBottomOffset(20 + overlap); 
      } else {
        setBottomOffset(20); 
      }
    };

    
    window.addEventListener('scroll', handleScroll);

    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    });
  };

  return (
    <button
      className={`scroll-to-top-button ${showButton ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{ bottom: `${bottomOffset}px` }} 
    >
      <FaLongArrowAltUp className="arrow-icon-main" />
    </button>
  );
};

export default ScrollToTopButton;
