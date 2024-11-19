import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para navegação
import './BlackButton.css';

const BlackButton = ({ text, to, onClick }) => {
    const navigate = useNavigate(); // Inicializa a função de navegação

    const handleClick = () => {
        if (to) {
            navigate(to); // Navega para o caminho especificado
        }
        if (onClick) {
            onClick(); // Executa a ação personalizada, se existir
        }
    };

    return (
        <button className="black-button" onClick={handleClick}>
            {text}
        </button>
    );
};

export default BlackButton;
