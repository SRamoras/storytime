import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoText.css';

const LogoText = ({ text, to }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to); // Navega para o caminho especificado
        }
    };

    return (
        <span className="text-black-link" onClick={handleClick}>
            {text}
        </span>
    );
};

export default LogoText;
