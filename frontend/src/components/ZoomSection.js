import React, { useRef, useEffect, useState } from "react";
import "./ZoomSection.css";

const ZoomSection = () => {
  const sectionRef = useRef(null);
  const [width, setWidth] = useState(50); 

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        
        const scrollProgress = Math.min(
          1,
          Math.max(0, 1 - rect.top / (windowHeight / 2))
        );

        
        const newWidth = 20 + scrollProgress * 80; 
        setWidth(newWidth);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="dynamic-expand-section"
      style={{
        width: `${width}vw`, 
      }}
    >
      <div className="dynamic-expand-content">
        <h1>Dynamic Expand Section</h1>
        <p>
          Watch this section expand as you scroll down, creating an engaging
          visual effect.
        </p>
      </div>
    </div>
  );
};

export default ZoomSection;
